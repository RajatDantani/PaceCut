"use client";
import { useMemo, useRef, useState } from "react";
import {
  DEFAULT_PAUSES, NO_PAUSES, PLATFORM_PRESETS, SAMPLE_SCRIPT, SPEED_PRESETS,
  applyAll, applySuggestion, countWords, findCutOff, findSuggestions, formatDiff, formatDuration,
  sectionStats, spokenText, type PauseConfig,
} from "@/lib/engine";
import { Teleprompter } from "./Teleprompter";

type Props = { initialSeconds?: number; initialPresetId?: string; compact?: boolean };

export function PaceCutTool({ initialSeconds = 60, initialPresetId = "tiktok" }: Props) {
  const [text, setText] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [limit, setLimit] = useState(initialSeconds);
  const [presetId, setPresetId] = useState<string | null>(initialPresetId);
  const [wpm, setWpm] = useState(150);
  const [usePauses, setUsePauses] = useState(true);
  const [pauses, setPauses] = useState<PauseConfig>(DEFAULT_PAUSES);
  const [showPauseCfg, setShowPauseCfg] = useState(false);
  const [teleprompter, setTeleprompter] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const p = usePauses ? { ...pauses, enabled: true } : NO_PAUSES;
  const spoken = useMemo(() => spokenText(text), [text]);
  const words = useMemo(() => countWords(spoken), [spoken]);
  const cut = useMemo(() => findCutOff(spoken, limit, wpm, p), [spoken, limit, wpm, usePauses, pauses]); // eslint-disable-line react-hooks/exhaustive-deps
  const sections = useMemo(() => sectionStats(text, limit, wpm, p), [text, limit, wpm, usePauses, pauses]); // eslint-disable-line react-hooks/exhaustive-deps
  const suggestions = useMemo(() => findSuggestions(text, wpm, p), [text, wpm, usePauses, pauses]); // eslint-disable-line react-hooks/exhaustive-deps
  const removable = suggestions.filter((s) => s.replacement !== null);
  const [saved, setSaved] = useState(0);

  function setTextTracked(next: string) {
    setHistory((h) => [...h, text]);
    setText(next);
  }
  function applyOne(i: number) {
    const s = suggestions[i];
    const before = findCutOff(spokenText(text), limit, wpm, p).total;
    const next = applySuggestion(text, s);
    const after = findCutOff(spokenText(next), limit, wpm, p).total;
    setSaved((x) => x + Math.max(0, before - after));
    setTextTracked(next);
  }
  function applyEverything() {
    const before = cut.total;
    const next = applyAll(text, suggestions);
    const after = findCutOff(spokenText(next), limit, wpm, p).total;
    setSaved((x) => x + Math.max(0, before - after));
    setTextTracked(next);
  }
  function undo() {
    setHistory((h) => {
      if (!h.length) return h;
      const prev = h[h.length - 1];
      const before = findCutOff(spokenText(text), limit, wpm, p).total;
      const after = findCutOff(spokenText(prev), limit, wpm, p).total;
      setSaved((x) => Math.max(0, x - Math.max(0, after - before)));
      setText(prev);
      return h.slice(0, -1);
    });
  }
  function tagSection(name: "Hook" | "Body" | "CTA") {
    const ta = taRef.current;
    const pos = ta ? ta.selectionStart : 0;
    const lineStart = text.lastIndexOf("\n", pos - 1) + 1;
    setTextTracked(text.slice(0, lineStart) + `# ${name}\n` + text.slice(lineStart));
  }
  function pickPreset(id: string, seconds: number) {
    setPresetId(id);
    setLimit(seconds);
  }

  // Cut-off view: before / marker / after
  const before = spoken.slice(0, cut.cutCharOffset);
  const after = spoken.slice(cut.cutCharOffset);
  const statusColor = !words ? "text-muted" : cut.fits ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="script" className="font-semibold">Your script</label>
          <div className="flex flex-wrap gap-2 text-sm">
            <button className="btn !min-h-[36px] !py-1" onClick={() => setTextTracked(SAMPLE_SCRIPT)}>Try a sample</button>
            {(["Hook", "Body", "CTA"] as const).map((n) => (
              <button key={n} className="btn !min-h-[36px] !py-1" onClick={() => tagSection(n)} title={`Insert a "# ${n}" marker line`}>+ {n}</button>
            ))}
            <button className="btn !min-h-[36px] !py-1" onClick={() => setTextTracked("")} disabled={!text}>Clear</button>
          </div>
        </div>
        <textarea
          id="script"
          ref={taRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={9}
          className="field mt-2 min-h-[200px] text-base"
          placeholder={'Paste or type your script here. Tip: start lines with "# Hook", "# Body" or "# CTA" to time each section.'}
          spellCheck
        />
        <p className="mt-2 text-sm text-muted">🔒 Your script never leaves your device. Nothing is uploaded, saved or logged.</p>
      </div>

      <div className="card space-y-4">
        <div>
          <div className="mb-2 text-sm font-semibold">Platform</div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Platform presets">
            {PLATFORM_PRESETS.map((pp) => (
              <button key={pp.id} className={`btn !min-h-[40px] !py-1 text-sm ${presetId === pp.id ? "btn-active" : ""}`} aria-pressed={presetId === pp.id} onClick={() => pickPreset(pp.id, pp.seconds)}>
                {pp.label} · {formatDuration(pp.seconds)}
              </button>
            ))}
            <label className="flex items-center gap-2 text-sm">
              Custom (sec)
              <input type="number" min={1} max={7200} className="field !w-24" value={limit}
                onChange={(e) => { setPresetId(null); setLimit(Math.max(1, Number(e.target.value) || 1)); }} />
            </label>
          </div>
        </div>
        <div>
          <div className="mb-2 text-sm font-semibold">Speaking speed</div>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Speed presets">
            {SPEED_PRESETS.map((s) => (
              <button key={s.id} className={`btn !min-h-[40px] !py-1 text-sm ${wpm === s.wpm ? "btn-active" : ""}`} aria-pressed={wpm === s.wpm} onClick={() => setWpm(s.wpm)}>
                {s.label} · {s.wpm}
              </button>
            ))}
            <label className="flex items-center gap-2 text-sm">
              Custom WPM
              <input type="number" min={40} max={400} className="field !w-24" value={wpm} onChange={(e) => setWpm(Math.min(400, Math.max(40, Number(e.target.value) || 150)))} />
            </label>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-5 w-5" checked={usePauses} onChange={(e) => setUsePauses(e.target.checked)} />
              Add pauses for punctuation
            </label>
            {usePauses && <button className="underline" onClick={() => setShowPauseCfg((s) => !s)}>{showPauseCfg ? "Hide" : "Adjust"} pause lengths</button>}
          </div>
          {usePauses && showPauseCfg && (
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4 text-sm">
              {([["comma", "Comma"], ["period", "Full stop"], ["question", "Question"], ["paragraph", "Paragraph"]] as const).map(([k, label]) => (
                <label key={k} className="flex flex-col gap-1">{label} (sec)
                  <input type="number" step={0.05} min={0} max={5} className="field" value={pauses[k]} onChange={(e) => setPauses({ ...pauses, [k]: Math.max(0, Number(e.target.value) || 0) })} />
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card" aria-live="polite">
        <div className="flex flex-wrap items-center gap-5">
          <Ring pct={Math.min(1, cut.total / Math.max(1, limit))} over={!cut.fits && words > 0} empty={!words} label={formatDuration(cut.total)} />
          <div className="grid flex-1 gap-3 sm:grid-cols-3">
            <Stat label="Limit" value={formatDuration(limit)} />
            <Stat label="Words" value={String(words)} />
            <div>
              <div className="text-xs uppercase tracking-wide text-muted">Result</div>
              <div className={`text-2xl font-extrabold ${statusColor}`}>
                {!words ? "Add a script" : cut.fits ? "Fits ✓" : "Too long"}
              </div>
              {words > 0 && <div className={`text-sm ${statusColor}`}>{formatDiff(cut.diff)}</div>}
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="btn btn-primary" disabled={!words} onClick={() => setTeleprompter(true)}>▶ Open teleprompter</button>
        </div>
      </div>

      {words > 0 && (
        <div className="card pop">
          <h2 className="font-semibold">Exact cut-off view</h2>
          <p className="text-sm text-muted">{cut.fits ? "Everything fits inside your limit." : `Time runs out at the red marker (${formatDuration(limit)}). Text after it is dimmed.`}</p>
          <div className="mt-3 whitespace-pre-wrap text-lg leading-relaxed">
            <span>{before}</span>
            {!cut.fits && <span className="cut-marker" role="img" aria-label="Time runs out here">✂ {formatDuration(limit)}</span>}
            <span className="opacity-35">{after}</span>
          </div>
        </div>
      )}

      {sections.length > 0 && (
        <div className="card">
          <h2 className="font-semibold">Section timing</h2>
          <ul className="mt-3 space-y-3">
            {sections.map((s, i) => (
              <li key={s.name + i}>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">{s.name} <span className="font-normal text-muted">· {s.words} words</span></span>
                  <span>{s.seconds.toFixed(1)}s · {Math.round(s.share * 100)}% of budget</span>
                </div>
                <div className="mt-1 h-3 overflow-hidden rounded-full bg-border">
                  <div className="h-full bg-accent" style={{ width: `${Math.min(100, s.share * 100)}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {words > 0 && (
        <div className="card">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold">Trimming suggestions</h2>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-full bg-accent/15 px-3 py-1 font-semibold" aria-live="polite">Saved so far: {saved.toFixed(1)}s</span>
              <button className="btn !min-h-[36px] !py-1" onClick={undo} disabled={!history.length}>Undo</button>
              <button className="btn !min-h-[36px] !py-1" onClick={applyEverything} disabled={!removable.length}>Remove all fillers</button>
            </div>
          </div>
          {suggestions.length === 0 ? (
            <p className="mt-2 text-sm text-muted">No filler words, repeats or very long sentences found. Nice and tight.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {suggestions.slice(0, 40).map((s, i) => (
                <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                  <div>
                    <div className="font-medium">{s.label}</div>
                    <div className="text-sm text-muted">
                      {s.detail}
                      {s.secondsSaved > 0 && <> · saves ~{s.secondsSaved.toFixed(1)}s</>}
                      <> · “…{spoken.slice(Math.max(0, s.start - 18), s.start)}<mark>{s.end - s.start > 60 ? spoken.slice(s.start, s.start + 60) + "…" : spoken.slice(s.start, s.end)}</mark>…”</>
                    </div>
                  </div>
                  {s.replacement !== null ? (
                    <button className="btn !min-h-[36px] !py-1 text-sm" onClick={() => applyOne(i)}>Remove</button>
                  ) : (
                    <span className="text-xs text-muted">Manual edit</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {teleprompter && <Teleprompter text={spoken.trim()} wpm={wpm} onClose={() => setTeleprompter(false)} />}
    </div>
  );
}

function Ring({ pct, over, empty, label }: { pct: number; over: boolean; empty: boolean; label: string }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  const color = empty ? "var(--border)" : over ? "#ef4444" : "#22c55e";
  return (
    <div className="relative h-28 w-28 shrink-0" role="img" aria-label={`Script uses ${Math.round(pct * 100)}% of the time limit`}>
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" strokeWidth="10" className="ring-track" />
        <circle cx="60" cy="60" r={r} fill="none" strokeWidth="10" strokeLinecap="round" className="ring-bar" stroke={color} strokeDasharray={c} strokeDashoffset={c * (1 - (empty ? 0 : pct))} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-xl font-extrabold tabular-nums">{label}</div>
        <div className="text-[10px] uppercase tracking-wide text-muted">estimated</div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-muted">{label}</div>
      <div className="text-2xl font-extrabold tabular-nums">{value}</div>
    </div>
  );
}
