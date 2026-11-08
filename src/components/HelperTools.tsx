"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { countChars, countWords, formatDuration, speakingSeconds, wordsForDuration, calcWpm, findCutOff, DEFAULT_PAUSES, NO_PAUSES, SPEED_PRESETS } from "@/lib/engine";

function Big({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card text-center">
      <div className="text-xs uppercase tracking-wide text-muted">{label}</div>
      <div className="text-3xl font-extrabold tabular-nums">{value}</div>
      {sub && <div className="text-sm text-muted">{sub}</div>}
    </div>
  );
}

function SpeedPicker({ wpm, setWpm }: { wpm: number; setWpm: (n: number) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Speaking speed">
      {SPEED_PRESETS.map((s) => (
        <button key={s.id} className={`btn !min-h-[40px] !py-1 text-sm ${wpm === s.wpm ? "btn-active" : ""}`} onClick={() => setWpm(s.wpm)} aria-pressed={wpm === s.wpm}>{s.label} · {s.wpm}</button>
      ))}
      <label className="flex items-center gap-2 text-sm">Custom WPM
        <input type="number" className="field !w-24" min={40} max={400} value={wpm} onChange={(e) => setWpm(Math.min(400, Math.max(40, Number(e.target.value) || 150)))} />
      </label>
    </div>
  );
}

export function CtaToHero({ text = "Paste a full script into PaceCut" }: { text?: string }) {
  return <Link href="/" className="btn btn-primary mt-4">{text} →</Link>;
}

export function WordsToMinutes() {
  const [text, setText] = useState("");
  const [manual, setManual] = useState(500);
  const [wpm, setWpm] = useState(150);
  const fromText = text.trim().length > 0;
  const words = fromText ? countWords(text) : manual;
  const secs = (words / wpm) * 60;
  return (
    <div className="space-y-4">
      <div className="card space-y-3">
        <label htmlFor="wtm-text" className="flex flex-col gap-1 font-semibold">Paste your text (optional)
          <textarea id="wtm-text" className="field min-h-[120px] font-normal" rows={5} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste your script or speech and we will count the words for you..." />
        </label>
        <p className="text-sm text-muted">🔒 Your text never leaves your device.</p>
        <label className="flex flex-col gap-1 font-semibold">
          {fromText ? "Words counted from your text" : "Or enter a number of words"}
          <input type="number" min={0} className="field" disabled={fromText} value={words} onChange={(e) => setManual(Math.max(0, Number(e.target.value) || 0))} />
        </label>
        {fromText && <button className="btn !min-h-[36px] !py-1 text-sm" onClick={() => { setManual(words); setText(""); }}>Clear text and enter a number instead</button>}
        <SpeedPicker wpm={wpm} setWpm={setWpm} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2" aria-live="polite">
        <Big label="Speaking time" value={formatDuration(secs)} sub={`${(secs / 60).toFixed(2)} minutes`} />
        <Big label="Reading aloud at" value={`${wpm} WPM`} sub={`${(words / 170).toFixed(1)} to ${(words / 130).toFixed(1)} min at 130-170 WPM`} />
      </div>
      <div className="card">
        <h3 className="font-semibold">Quick reference at {wpm} WPM</h3>
        <table className="mt-2 w-full text-left text-sm">
          <thead><tr className="text-muted"><th className="py-1">Time</th><th>Words</th></tr></thead>
          <tbody>
            {[30, 60, 90, 180, 300, 600, 1200].map((s) => (
              <tr key={s} className="border-t border-border"><td className="py-1">{formatDuration(s)}</td><td>{wordsForDuration(s, wpm)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SpeechTimeCalculator() {
  const [text, setText] = useState("");
  const [wpm, setWpm] = useState(150);
  const [pauses, setPauses] = useState(true);
  const p = pauses ? DEFAULT_PAUSES : NO_PAUSES;
  const words = countWords(text);
  const secs = useMemo(() => speakingSeconds(text, wpm, p), [text, wpm, pauses]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="space-y-4">
      <div className="card space-y-3">
        <label htmlFor="sp" className="font-semibold">Paste your speech</label>
        <textarea id="sp" className="field min-h-[180px]" rows={8} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste your speech or script..." />
        <SpeedPicker wpm={wpm} setWpm={setWpm} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-5 w-5" checked={pauses} onChange={(e) => setPauses(e.target.checked)} /> Add pauses for punctuation</label>
        <p className="text-sm text-muted">🔒 Your text never leaves your device.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3" aria-live="polite">
        <Big label="Speaking time" value={formatDuration(secs)} />
        <Big label="Words" value={String(words)} />
        <Big label="Sentences" value={String((text.match(/[.!?]+(\s|$)/g) || []).length)} />
      </div>
      <CtaToHero text="Check it against a time limit" />
    </div>
  );
}

const HOOK_LIMITS = [
  { label: "TikTok", sec: 3, note: "Viewers decide in about 3 seconds." },
  { label: "YouTube Shorts", sec: 3, note: "Aim for a first line under 3 seconds." },
  { label: "Instagram Reels", sec: 3, note: "Front-load the payoff." },
  { label: "YouTube (long)", sec: 15, note: "The first 15 seconds decide retention." },
];

export function HookLengthChecker() {
  const [text, setText] = useState("");
  const [wpm, setWpm] = useState(160);
  const words = countWords(text);
  const secs = speakingSeconds(text, wpm, DEFAULT_PAUSES);
  return (
    <div className="space-y-4">
      <div className="card space-y-3">
        <label htmlFor="hk" className="font-semibold">Your opening line (hook)</label>
        <textarea id="hk" className="field" rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Stop scrolling. You are wasting 10 seconds of every video." />
        <SpeedPicker wpm={wpm} setWpm={setWpm} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2" aria-live="polite">
        <Big label="Hook length" value={`${secs.toFixed(1)}s`} sub={`${words} words`} />
        <Big label="Words that fit in 3s" value={String(wordsForDuration(3, wpm))} sub={`at ${wpm} WPM`} />
      </div>
      <ul className="space-y-2">
        {HOOK_LIMITS.map((h) => {
          const ok = words > 0 && secs <= h.sec;
          return (
            <li key={h.label} className="card flex items-center justify-between gap-3">
              <div><div className="font-semibold">{h.label} · target ≤ {h.sec}s</div><div className="text-sm text-muted">{h.note}</div></div>
              <div className={`font-bold ${!words ? "text-muted" : ok ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>{!words ? "-" : ok ? "Good" : `${(secs - h.sec).toFixed(1)}s long`}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// Limits are commonly cited platform limits and can change. Verify before relying on them.
const CAPTION_LIMITS = [
  { label: "TikTok caption", limit: 2200 },
  { label: "TikTok on-screen hashtag-friendly (short)", limit: 150 },
  { label: "Instagram caption", limit: 2200 },
  { label: "Instagram bio", limit: 150 },
  { label: "YouTube title", limit: 100 },
  { label: "YouTube description", limit: 5000 },
  { label: "YouTube Shorts title", limit: 100 },
];

export function CaptionCounter() {
  const [text, setText] = useState("");
  const c = countChars(text);
  const hashtags = (text.match(/#[\p{L}\p{N}_]+/gu) || []).length;
  return (
    <div className="space-y-4">
      <div className="card space-y-2">
        <label htmlFor="cap" className="font-semibold">Your caption</label>
        <textarea id="cap" className="field" rows={6} value={text} onChange={(e) => setText(e.target.value)} placeholder="Write your caption..." />
        <p className="text-sm text-muted">🔒 Your text never leaves your device.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-4" aria-live="polite">
        <Big label="Characters" value={String(c.withSpaces)} />
        <Big label="No spaces" value={String(c.withoutSpaces)} />
        <Big label="Words" value={String(countWords(text))} />
        <Big label="Hashtags" value={String(hashtags)} />
      </div>
      <ul className="space-y-2">
        {CAPTION_LIMITS.map((l) => {
          const pct = Math.min(100, (c.withSpaces / l.limit) * 100);
          const over = c.withSpaces > l.limit;
          return (
            <li key={l.label} className="card">
              <div className="flex justify-between text-sm"><span className="font-semibold">{l.label}</span><span className={over ? "font-bold text-red-600 dark:text-red-400" : ""}>{c.withSpaces} / {l.limit}{over ? ` (${c.withSpaces - l.limit} over)` : ""}</span></div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-border"><div className={`h-full ${over ? "bg-red-500" : "bg-accent"}`} style={{ width: `${pct}%` }} /></div>
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-muted">Platform limits change over time. Check each platform for the latest numbers.</p>
    </div>
  );
}

export function ElevatorPitchTimer() {
  const [text, setText] = useState("");
  const [target, setTarget] = useState(30);
  const [wpm, setWpm] = useState(150);
  const cut = findCutOff(text, target, wpm, DEFAULT_PAUSES);
  const words = countWords(text);
  const before = text.slice(0, cut.cutCharOffset);
  const after = text.slice(cut.cutCharOffset);
  return (
    <div className="space-y-4">
      <div className="card space-y-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Pitch length">
          {[15, 30, 60, 90, 120].map((s) => (
            <button key={s} className={`btn !min-h-[40px] !py-1 text-sm ${target === s ? "btn-active" : ""}`} onClick={() => setTarget(s)} aria-pressed={target === s}>{s}s</button>
          ))}
        </div>
        <label htmlFor="pitch" className="font-semibold">Your pitch</label>
        <textarea id="pitch" className="field" rows={7} value={text} onChange={(e) => setText(e.target.value)} placeholder="I help [who] do [what] so they can [result]..." />
        <SpeedPicker wpm={wpm} setWpm={setWpm} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3" aria-live="polite">
        <Big label="Your pitch" value={formatDuration(cut.total)} sub={`${words} words`} />
        <Big label="Target" value={`${target}s`} sub={`about ${wordsForDuration(target, wpm)} words`} />
        <Big label="Result" value={!words ? "-" : cut.fits ? "Fits ✓" : "Too long"} sub={words ? `${Math.abs(Math.round(cut.diff))}s ${cut.diff > 0 ? "over" : "under"}` : undefined} />
      </div>
      {words > 0 && !cut.fits && (
        <div className="card whitespace-pre-wrap">
          <span>{before}</span><span className="cut-marker">✂ {target}s</span><span className="opacity-35">{after}</span>
        </div>
      )}
      <CtaToHero text="Open the full script timer and teleprompter" />
    </div>
  );
}

const PACE_SAMPLE = `Good communication is less about speed and more about clarity. When you speak at a steady pace, your audience can follow your ideas, remember your key points, and feel confident in what you are saying. Take a breath, pause between thoughts, and let each sentence land before you move on. Practice reading this passage aloud a few times, and you will quickly find a rhythm that feels natural, calm and easy to listen to.`;

export function SpeechPaceTest() {
  const [state, setState] = useState<"idle" | "running" | "done">("idle");
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(0);
  const words = countWords(PACE_SAMPLE);

  useEffect(() => {
    if (state !== "running") return;
    const id = setInterval(() => setElapsed((performance.now() - startRef.current) / 1000), 100);
    return () => clearInterval(id);
  }, [state]);

  const start = () => { startRef.current = performance.now(); setElapsed(0); setState("running"); };
  const stop = () => { setElapsed((performance.now() - startRef.current) / 1000); setState("done"); };
  const wpm = calcWpm(words, elapsed);
  const label = wpm < 110 ? "Slow and deliberate" : wpm < 140 ? "Calm and clear" : wpm < 170 ? "Conversational" : "Fast and energetic";

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="font-semibold">Read this aloud ({words} words)</h2>
        <p className="mt-2 text-lg leading-relaxed">{PACE_SAMPLE}</p>
      </div>
      <div className="card flex flex-wrap items-center gap-4">
        <div className="text-4xl font-extrabold tabular-nums" aria-live="off">{elapsed.toFixed(1)}s</div>
        {state !== "running" ? (
          <button className="btn btn-primary" onClick={start}>{state === "done" ? "Try again" : "Start reading"}</button>
        ) : (
          <button className="btn btn-primary" onClick={stop}>I finished</button>
        )}
      </div>
      {state === "done" && elapsed > 1 && (
        <div className="grid gap-3 sm:grid-cols-2" aria-live="polite">
          <Big label="Your pace" value={`${wpm} WPM`} sub={label} />
          <Big label="Your 60s script length" value={`${wpm} words`} sub={`about ${Math.round(wpm * 0.5)} words for 30s`} />
        </div>
      )}
      {state === "done" && <CtaToHero text="Use my pace in the script timer" />}
    </div>
  );
}
