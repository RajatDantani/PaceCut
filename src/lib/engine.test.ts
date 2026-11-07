import { describe, it, expect } from "vitest";
import {
  countWords, speakingSeconds, findCutOff, NO_PAUSES, DEFAULT_PAUSES, formatDuration,
  sectionStats, findSuggestions, applySuggestion, applyAll, calcWpm, spokenText, wordsForDuration,
} from "./engine";

describe("countWords", () => {
  it("handles empty, whitespace, punctuation and numbers", () => {
    expect(countWords("")).toBe(0);
    expect(countWords("   \n  ")).toBe(0);
    expect(countWords("Hello, world!")).toBe(2);
    expect(countWords("It costs 1,000 dollars - really.")).toBe(5);
    expect(countWords("-- ... !!")).toBe(0);
  });
  it("handles line breaks", () => {
    expect(countWords("one\ntwo\n\nthree")).toBe(3);
  });
  it("counts contractions and hyphenated words as one", () => {
    expect(countWords("don't well-known")).toBe(2);
  });
});

describe("speakingSeconds", () => {
  it("is words/wpm without pauses", () => {
    const text = Array(150).fill("word").join(" ");
    expect(speakingSeconds(text, 150, NO_PAUSES)).toBeCloseTo(60, 5);
    expect(speakingSeconds(text, 120, NO_PAUSES)).toBeCloseTo(75, 5);
    expect(speakingSeconds(text, 180, NO_PAUSES)).toBeCloseTo(50, 5);
  });
  it("adds punctuation pauses", () => {
    const base = speakingSeconds("a b c", 60, NO_PAUSES); // 3s
    expect(base).toBeCloseTo(3);
    expect(speakingSeconds("a, b. c?", 60, DEFAULT_PAUSES)).toBeCloseTo(3 + 0.25 + 0.5 + 0.6);
  });
  it("adds paragraph pauses", () => {
    const t = speakingSeconds("a.\n\nb.", 60, DEFAULT_PAUSES);
    expect(t).toBeCloseTo(2 + 0.5 + 0.8 + 0.5);
  });
  it("respects custom pause lengths", () => {
    const p = { ...DEFAULT_PAUSES, comma: 1 };
    expect(speakingSeconds("a, b", 60, p)).toBeCloseTo(3);
  });
});

describe("findCutOff", () => {
  const text = "one two three four five six seven eight nine ten";
  it("fits when under limit", () => {
    const r = findCutOff(text, 20, 60, NO_PAUSES);
    expect(r.fits).toBe(true);
    expect(r.diff).toBeCloseTo(10 - 20);
    expect(r.cutCharOffset).toBe(text.length);
  });
  it("finds exact word where time runs out", () => {
    const r = findCutOff(text, 4, 60, NO_PAUSES); // 1 word/sec -> 4 words fit
    expect(r.fits).toBe(false);
    expect(r.cutWordIndex).toBe(3);
    expect(text.slice(0, r.cutCharOffset)).toBe("one two three four");
    expect(r.diff).toBeCloseTo(6);
  });
  it("handles zero limit", () => {
    const r = findCutOff(text, 0, 60, NO_PAUSES);
    expect(r.cutWordIndex).toBe(-1);
    expect(r.cutCharOffset).toBe(0);
  });
  it("accounts for pauses", () => {
    const r = findCutOff("a. b. c. d.", 4, 60, DEFAULT_PAUSES);
    // a:0-1(+.5) b:1.5-2.5(+.5) c:3-4 fits (ends at 4), d starts 4.5
    expect(r.cutWordIndex).toBe(2);
  });
});

describe("formatDuration", () => {
  it("formats m:ss", () => {
    expect(formatDuration(0)).toBe("0:00");
    expect(formatDuration(65)).toBe("1:05");
    expect(formatDuration(300)).toBe("5:00");
  });
});

describe("sections", () => {
  const t = "# Hook\nOne two.\n# Body\nThree four five six.\n# CTA\nSeven.";
  it("computes per-section words and seconds", () => {
    const s = sectionStats(t, 10, 60, NO_PAUSES);
    expect(s.map((x) => x.name)).toEqual(["Hook", "Body", "CTA"]);
    expect(s.map((x) => x.words)).toEqual([2, 4, 1]);
    expect(s[1].seconds).toBeCloseTo(4);
    expect(s[1].share).toBeCloseTo(0.4);
  });
  it("heading lines are not spoken", () => {
    expect(countWords(spokenText(t))).toBe(7);
  });
  it("returns nothing without markers", () => {
    expect(sectionStats("just text", 10, 150)).toEqual([]);
  });
});

describe("suggestions", () => {
  it("finds fillers with seconds saved and removes them", () => {
    const t = "So basically, this is really good.";
    const s = findSuggestions(t, 150, NO_PAUSES);
    expect(s.length).toBeGreaterThanOrEqual(2);
    expect(s.every((x) => x.secondsSaved > 0)).toBe(true);
    const out = applyAll(t, s);
    expect(out.toLowerCase()).not.toContain("basically");
    expect(out.toLowerCase()).not.toContain("really");
  });
  it("does not match fillers inside other words", () => {
    expect(findSuggestions("justice is averse to eventually", 150).length).toBe(0);
  });
  it("detects immediate repeats", () => {
    const t = "This is is a test.";
    const s = findSuggestions(t, 150).filter((x) => x.id.startsWith("r-"));
    expect(s.length).toBe(1);
    expect(applySuggestion(t, s[0])).toBe("This is a test.");
  });
  it("flags long sentences as advisory", () => {
    const t = Array(35).fill("word").join(" ") + ".";
    const s = findSuggestions(t, 150);
    expect(s.some((x) => x.kind === "long-sentence" && x.replacement === null)).toBe(true);
  });
  it("flags phrases repeated three times", () => {
    const t = "we love pizza. we love pizza. we love pizza.";
    expect(findSuggestions(t, 150).some((x) => x.id.startsWith("p-"))).toBe(true);
  });
});

describe("misc", () => {
  it("calculates wpm", () => {
    expect(calcWpm(150, 60)).toBe(150);
    expect(calcWpm(10, 0)).toBe(0);
  });
  it("words for duration", () => {
    expect(wordsForDuration(60, 150)).toBe(150);
  });
});
