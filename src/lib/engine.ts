// PaceCut core engine: pure functions, no I/O, no network. Runs in the browser.

export type PauseConfig = {
  enabled: boolean;
  comma: number; // seconds
  period: number;
  question: number;
  paragraph: number;
};

export const DEFAULT_PAUSES: PauseConfig = {
  enabled: true,
  comma: 0.25,
  period: 0.5,
  question: 0.6,
  paragraph: 0.8,
};

export const NO_PAUSES: PauseConfig = { ...DEFAULT_PAUSES, enabled: false };

export const SPEED_PRESETS = [
  { id: "slow", label: "Slow & clear", wpm: 120 },
  { id: "normal", label: "Conversation", wpm: 150 },
  { id: "fast", label: "Fast & energetic", wpm: 180 },
] as const;

export type Token = {
  text: string; // original text including punctuation
  start: number; // char offset
  end: number;
  isWord: boolean;
};

/** A "word" is any run of non-whitespace containing a letter or digit. */
export function tokenize(text: string): Token[] {
  const out: Token[] = [];
  const re = /\S+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const t = m[0];
    out.push({
      text: t,
      start: m.index,
      end: m.index + t.length,
      isWord: /[\p{L}\p{N}]/u.test(t),
    });
  }
  return out;
}

export function countWords(text: string): number {
  return tokenize(text).filter((t) => t.isWord).length;
}

export function countChars(text: string): { withSpaces: number; withoutSpaces: number } {
  const chars = Array.from(text);
  return {
    withSpaces: chars.length,
    withoutSpaces: chars.filter((c) => !/\s/.test(c)).length,
  };
}

/** Pause (seconds) that follows a token, based on its trailing punctuation. */
function trailingPause(token: string, nextGapHasParagraph: boolean, p: PauseConfig): number {
  if (!p.enabled) return 0;
  let pause = 0;
  if (/[.!…]["')\]]*$/.test(token)) pause = p.period;
  else if (/\?["')\]]*$/.test(token)) pause = p.question;
  else if (/[,;:–—]["')\]]*$/.test(token)) pause = p.comma;
  if (nextGapHasParagraph) pause += p.paragraph;
  return pause;
}

export type TimedWord = {
  index: number; // word index (words only)
  token: Token;
  startTime: number; // seconds when this word begins
  endTime: number; // seconds when this word (and its pause) ends
};

export function timeline(text: string, wpm: number, pauses: PauseConfig = DEFAULT_PAUSES): {
  words: TimedWord[];
  total: number;
} {
  const safeWpm = Math.max(1, wpm);
  const perWord = 60 / safeWpm;
  const tokens = tokenize(text);
  const words: TimedWord[] = [];
  let t = 0;
  let idx = 0;
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    if (!tok.isWord) continue;
    const next = tokens[i + 1];
    const gap = next ? text.slice(tok.end, next.start) : "";
    const para = /\n\s*\n/.test(gap);
    const start = t;
    t += perWord + trailingPause(tok.text, para, pauses);
    words.push({ index: idx++, token: tok, startTime: start, endTime: t });
  }
  return { words, total: t };
}

export function speakingSeconds(text: string, wpm: number, pauses: PauseConfig = DEFAULT_PAUSES): number {
  return timeline(text, wpm, pauses).total;
}

export type CutOff = {
  fits: boolean;
  total: number;
  limit: number;
  diff: number; // positive = over, negative = under (seconds)
  cutWordIndex: number; // index of the last word that fits; -1 if none; words.length-1 if all fit
  cutCharOffset: number; // text offset right after the last word that fits
};

/** Find the exact word where time runs out. */
export function findCutOff(text: string, limit: number, wpm: number, pauses: PauseConfig = DEFAULT_PAUSES): CutOff {
  const { words, total } = timeline(text, wpm, pauses);
  const perWord = 60 / Math.max(1, wpm);
  let last = -1;
  for (const w of words) {
    // a word fits if its spoken part (excluding trailing pause) ends within the limit
    if (w.startTime + perWord <= limit + 1e-9) last = w.index;
    else break;
  }
  const fits = total <= limit + 1e-9;
  return {
    fits,
    total,
    limit,
    diff: total - limit,
    cutWordIndex: fits ? words.length - 1 : last,
    cutCharOffset: fits ? text.length : last >= 0 ? words[last].token.end : 0,
  };
}

export function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export function formatDiff(seconds: number): string {
  const s = Math.round(Math.abs(seconds));
  const label = formatDuration(s);
  if (s === 0) return "right on the limit";
  return seconds > 0 ? `${label} over` : `${label} under`;
}

/** Words needed to fill a given duration. */
export function wordsForDuration(seconds: number, wpm: number): number {
  return Math.round((seconds / 60) * wpm);
}

// ---------- Platform presets ----------
export const PLATFORM_PRESETS = [
  { id: "tiktok", label: "TikTok", seconds: 60, note: "Most videos land best at 21–34s; 60s is the common cap for scripted posts." },
  { id: "shorts", label: "YouTube Shorts", seconds: 60, note: "Shorts can run up to 3 minutes, but 60s is the sweet spot." },
  { id: "reels", label: "Instagram Reels", seconds: 90, note: "Reels allow up to 90s; shorter loops tend to retain better." },
  { id: "ad30", label: "30s ad read", seconds: 30, note: "Standard podcast and video ad read length." },
  { id: "pitch60", label: "60s elevator pitch", seconds: 60, note: "One minute to say who you help and why it matters." },
  { id: "talk5", label: "5-min presentation", seconds: 300, note: "A short talk or lightning presentation." },
] as const;

// ---------- Sections (HOOK / BODY / CTA) ----------
export type SectionName = "Hook" | "Body" | "CTA";

export type SectionStat = {
  name: SectionName;
  words: number;
  seconds: number;
  share: number; // fraction of limit (budget), may exceed 1
  shareOfTotal: number; // fraction of script total
};

const SECTION_RE = /^\s*#{1,3}\s*(hook|body|cta)\b[:\s-]*(.*)$/i;

/** Split text into sections by "# Hook", "# Body", "# CTA" heading lines. Heading lines are not spoken. */
export function parseSections(text: string): { name: SectionName | null; body: string }[] {
  const lines = text.split("\n");
  const sections: { name: SectionName | null; lines: string[] }[] = [{ name: null, lines: [] }];
  for (const line of lines) {
    const m = SECTION_RE.exec(line);
    if (m) {
      const n = m[1].toLowerCase();
      const name: SectionName = n === "hook" ? "Hook" : n === "body" ? "Body" : "CTA";
      sections.push({ name, lines: m[2] ? [m[2]] : [] });
    } else {
      sections[sections.length - 1].lines.push(line);
    }
  }
  return sections
    .map((s) => ({ name: s.name, body: s.lines.join("\n") }))
    .filter((s) => s.name !== null || s.body.trim().length > 0);
}

/** Text with section heading lines removed (what is actually spoken). */
export function spokenText(text: string): string {
  return text
    .split("\n")
    .map((line) => {
      const m = SECTION_RE.exec(line);
      return m ? m[2] : line;
    })
    .join("\n");
}

export function sectionStats(text: string, limit: number, wpm: number, pauses: PauseConfig = DEFAULT_PAUSES): SectionStat[] {
  const parts = parseSections(text).filter((s) => s.name !== null);
  if (parts.length === 0) return [];
  const secs = parts.map((p) => speakingSeconds(p.body, wpm, pauses));
  const total = secs.reduce((a, b) => a + b, 0) || 1;
  return parts.map((p, i) => ({
    name: p.name as SectionName,
    words: countWords(p.body),
    seconds: secs[i],
    share: limit > 0 ? secs[i] / limit : 0,
    shareOfTotal: secs[i] / total,
  }));
}

// ---------- Trimming suggestions (rule-based, no AI) ----------
export type Suggestion = {
  id: string;
  kind: "filler" | "long-sentence" | "repeat";
  label: string;
  detail: string;
  start: number;
  end: number;
  replacement: string | null; // null = advisory only (cannot be auto-removed)
  secondsSaved: number;
};

// Longest first so multi-word phrases match before their parts.
export const FILLER_PHRASES = [
  "so yeah",
  "you know what i mean",
  "you know",
  "i mean",
  "kind of",
  "sort of",
  "basically",
  "actually",
  "literally",
  "honestly",
  "obviously",
  "essentially",
  "definitely",
  "totally",
  "just",
  "really",
  "very",
  "like,",
];

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const FILLER_RE = new RegExp(
  `(?<![\\p{L}\\p{N}])(${FILLER_PHRASES.map(escapeRe).join("|")})(?![\\p{L}\\p{N}])[,]?[ \\t]?`,
  "giu"
);

export function findSuggestions(text: string, wpm: number, pauses: PauseConfig = DEFAULT_PAUSES): Suggestion[] {
  const base = speakingSeconds(text, wpm, pauses);
  const out: Suggestion[] = [];
  const claimed: [number, number][] = [];
  const overlaps = (s: number, e: number) => claimed.some(([a, b]) => s < b && e > a);

  // 1. Fillers
  FILLER_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = FILLER_RE.exec(text))) {
    const start = m.index;
    const end = start + m[0].length;
    if (SECTION_RE.test(lineAt(text, start))) continue;
    const after = text.slice(0, start) + text.slice(end);
    const saved = base - speakingSeconds(cleanup(after), wpm, pauses);
    out.push({
      id: `f-${start}`,
      kind: "filler",
      label: `Remove "${m[1].replace(/,$/, "")}"`,
      detail: "Filler word or phrase",
      start,
      end,
      replacement: "",
      secondsSaved: Math.max(0, saved),
    });
    claimed.push([start, end]);
  }

  // 2. Repeated words (immediate repeats like "the the")
  const rep = /(?<![\p{L}\p{N}])([\p{L}']+)(\s+)\1(?![\p{L}\p{N}])/giu;
  while ((m = rep.exec(text))) {
    const start = m.index;
    const end = start + m[0].length;
    if (overlaps(start, end)) continue;
    const word = m[1];
    const after = text.slice(0, start) + word + text.slice(end);
    out.push({
      id: `r-${start}`,
      kind: "repeat",
      label: `Remove repeated "${word}"`,
      detail: "The same word appears twice in a row",
      start,
      end,
      replacement: word,
      secondsSaved: Math.max(0, base - speakingSeconds(after, wpm, pauses)),
    });
    claimed.push([start, end]);
  }

  // 3. Repeated phrases (3-word phrase used 3+ times) - advisory only
  const toks = tokenize(text).filter((t) => t.isWord);
  const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}']/gu, "");
  const gramMap = new Map<string, number[]>();
  for (let i = 0; i + 2 < toks.length; i++) {
    const g = [toks[i], toks[i + 1], toks[i + 2]].map((t) => norm(t.text)).join(" ");
    if (g.trim().split(" ").length < 3) continue;
    const arr = gramMap.get(g) ?? [];
    arr.push(i);
    gramMap.set(g, arr);
  }
  for (const [g, idxs] of gramMap) {
    if (idxs.length >= 3) {
      const second = idxs[1];
      out.push({
        id: `p-${g}`,
        kind: "repeat",
        label: `"${g}" used ${idxs.length} times`,
        detail: "Repeated phrase. Consider cutting or varying it.",
        start: toks[second].start,
        end: toks[second + 2].end,
        replacement: null,
        secondsSaved: ((idxs.length - 1) * 3 * 60) / Math.max(1, wpm),
      });
    }
  }

  // 4. Long sentences (> 30 words) - advisory
  const sentRe = /[^.!?\n]+[.!?]*/g;
  while ((m = sentRe.exec(text))) {
    const s = m[0];
    const wc = countWords(s);
    if (wc > 30 && !SECTION_RE.test(s)) {
      out.push({
        id: `l-${m.index}`,
        kind: "long-sentence",
        label: `Long sentence (${wc} words)`,
        detail: "Split it or cut it down. Long sentences are hard to say in one breath.",
        start: m.index,
        end: m.index + s.length,
        replacement: null,
        secondsSaved: 0,
      });
    }
  }

  return out.sort((a, b) => a.start - b.start);
}

function lineAt(text: string, pos: number) {
  const s = text.lastIndexOf("\n", pos - 1) + 1;
  let e = text.indexOf("\n", pos);
  if (e === -1) e = text.length;
  return text.slice(s, e);
}

/** Tidy double spaces and orphan punctuation after removals. */
export function cleanup(text: string): string {
  return text
    .replace(/[ \t]{2,}/g, " ")
    .replace(/[ \t]+([,.!?;:])/g, "$1")
    .replace(/,{2,}/g, ",")
    .replace(/^[ \t]+(?=\S)/gm, (m) => m)
    .replace(/(^|[.!?]\s+)([a-z])/g, (_, a, b) => a + b.toUpperCase());
}

export function applySuggestion(text: string, s: Suggestion): string {
  if (s.replacement === null) return text;
  return cleanup(text.slice(0, s.start) + s.replacement + text.slice(s.end));
}

export function applyAll(text: string, suggestions: Suggestion[]): string {
  const removable = suggestions
    .filter((s) => s.replacement !== null)
    .sort((a, b) => b.start - a.start);
  let out = text;
  for (const s of removable) out = out.slice(0, s.start) + s.replacement + out.slice(s.end);
  return cleanup(out);
}

// ---------- Misc helpers ----------
export function calcWpm(words: number, seconds: number): number {
  if (seconds <= 0) return 0;
  return Math.round((words / seconds) * 60);
}

export const SAMPLE_SCRIPT = `# Hook
Stop scrolling. You are probably wasting ten seconds of every video, and you do not even know it.

# Body
So basically, most creators write a script, hit record, and just hope it fits. It never does. You know, you end up cutting the best part, or you run over and the platform cuts it for you.

Here is the fix. Paste your script, pick your platform, and see the exact word where your time runs out. Really simple, and actually very fast.

# CTA
Try PaceCut free. Your script never leaves your device.`;
