"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { isPremium } from "@/lib/premium";
import { countWords } from "@/lib/engine";

const FONTS = [
  { id: "sans", label: "Sans", css: "ui-sans-serif, system-ui, sans-serif" },
  { id: "serif", label: "Serif", css: "Georgia, 'Times New Roman', serif" },
  { id: "mono", label: "Mono", css: "ui-monospace, Menlo, monospace" },
];
const BGS = ["#000000", "#0f172a", "#1c1917", "#ffffff"];

function ProBadge() {
  return (
    <span className="ml-1 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-black">PRO</span>
  );
}

export function Teleprompter({ text, wpm: initialWpm, onClose }: { text: string; wpm: number; onClose: () => void }) {
  const [wpm, setWpm] = useState(initialWpm);
  const [fontSize, setFontSize] = useState(44);
  const [width, setWidth] = useState(80); // percent
  const [playing, setPlaying] = useState(false);
  const [mirror, setMirror] = useState(false);
  const [fontId, setFontId] = useState("sans");
  const [bg, setBg] = useState("#000000");
  const [recording, setRecording] = useState(false);
  const [recError, setRecError] = useState("");
  const [showUpsell, setShowUpsell] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const wpmRef = useRef(wpm);
  const videoRef = useRef<HTMLVideoElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  useEffect(() => { wpmRef.current = wpm; }, [wpm]);

  const words = countWords(text);

  // Smooth scroll. Duration is derived from the real content height so speed tracks WPM.
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const el = scrollRef.current;
      const dt = (now - last) / 1000;
      last = now;
      if (el) {
        const dist = Math.max(1, el.scrollHeight - el.clientHeight);
        const duration = Math.max(1, (words / Math.max(1, wpmRef.current)) * 60);
        posRef.current = Math.min(dist, posRef.current + (dist / duration) * dt);
        el.scrollTop = posRef.current;
        if (posRef.current >= dist) {
          setPlaying(false);
          return;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, words]);

  const restart = useCallback(() => {
    posRef.current = 0;
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    setPlaying(false);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " ") { e.preventDefault(); setPlaying((p) => !p); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setWpm((w) => Math.min(400, w + 10)); }
      else if (e.key === "ArrowDown") { e.preventDefault(); setWpm((w) => Math.max(40, w - 10)); }
      else if (e.key === "+" || e.key === "=") setFontSize((s) => Math.min(120, s + 4));
      else if (e.key === "-") setFontSize((s) => Math.max(20, s - 4));
      else if (e.key.toLowerCase() === "r") restart();
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, restart]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };
  useEffect(() => stopStream, []);

  async function toggleRecording() {
    if (!isPremium) { setShowUpsell(true); return; }
    setRecError("");
    if (recording) { recorderRef.current?.stop(); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; void videoRef.current.play(); }
      chunksRef.current = [];
      const rec = new MediaRecorder(stream);
      recorderRef.current = rec;
      rec.ondataavailable = (e) => { if (e.data.size) chunksRef.current.push(e.data); };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `pacecut-recording-${Date.now()}.webm`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
        stopStream();
        setRecording(false);
      };
      rec.start();
      setRecording(true);
      setPlaying(true);
    } catch {
      setRecError("Camera or microphone access was blocked.");
    }
  }

  const locked = !isPremium;
  const proClick = (fn: () => void) => () => (locked ? setShowUpsell(true) : fn());
  const fontCss = FONTS.find((f) => f.id === fontId)?.css;
  const light = bg === "#ffffff";

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: bg, color: light ? "#000" : "#fff" }} role="dialog" aria-label="Teleprompter">
      <video ref={videoRef} muted playsInline className={`absolute right-3 top-3 z-10 h-28 w-20 rounded-lg object-cover sm:h-36 sm:w-28 ${recording ? "" : "hidden"}`} />
      <div
        ref={scrollRef}
        className="relative flex-1 overflow-hidden"
        onClick={() => setPlaying((p) => !p)}
        style={{ transform: mirror ? "scaleX(-1)" : undefined }}
      >
        <div className="mx-auto" style={{ width: `${width}%`, fontSize, lineHeight: 1.45, fontFamily: fontCss, paddingTop: "40vh", paddingBottom: "60vh", whiteSpace: "pre-wrap" }}>
          {text}
        </div>
      </div>
      {/* reading-line guide */}
      <div aria-hidden="true" className="pointer-events-none absolute left-0 right-0 top-[40%] border-y-2 border-red-500/70" style={{ height: fontSize * 1.45, background: "rgba(239,68,68,.08)" }} />

      <div className="z-20 border-t border-white/20 bg-neutral-900 p-3 text-sm text-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-2">
          <button className="btn btn-primary" onClick={() => setPlaying((p) => !p)}>{playing ? "Pause" : "Play"}</button>
          <button className="btn !bg-neutral-800 !text-white" onClick={restart}>Restart</button>
          <label className="flex items-center gap-2">Speed
            <input type="range" min={40} max={300} value={wpm} onChange={(e) => setWpm(+e.target.value)} aria-label="Speed in words per minute" />
            <span className="w-16 tabular-nums">{wpm} WPM</span>
          </label>
          <label className="flex items-center gap-2">Size
            <input type="range" min={20} max={120} value={fontSize} onChange={(e) => setFontSize(+e.target.value)} aria-label="Font size" />
          </label>
          <label className="flex items-center gap-2">Width
            <input type="range" min={40} max={100} value={width} onChange={(e) => setWidth(+e.target.value)} aria-label="Text width" />
          </label>
          <button className="btn !bg-neutral-800 !text-white" onClick={proClick(() => setMirror((m) => !m))}>
            Mirror{locked && <ProBadge />}{!locked && mirror ? " (on)" : ""}
          </button>
          <select className="field !w-auto !bg-neutral-800 !text-white" value={fontId} onChange={(e) => (locked ? setShowUpsell(true) : setFontId(e.target.value))} aria-label="Font">
            {FONTS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
          </select>
          <span className="flex items-center gap-1" aria-label="Background color">
            {BGS.map((c) => (
              <button key={c} aria-label={`Background ${c}`} className="h-8 w-8 rounded-full border border-white/40" style={{ background: c }} onClick={proClick(() => setBg(c))} />
            ))}
            {locked && <ProBadge />}
          </span>
          <button className="btn !bg-neutral-800 !text-white" onClick={toggleRecording}>
            {recording ? "Stop & save" : "Record"}{locked && <ProBadge />}
          </button>
          <button className="btn !bg-neutral-800 !text-white ml-auto" onClick={onClose}>Close (Esc)</button>
        </div>
        <p className="mx-auto mt-2 max-w-5xl text-xs text-neutral-400">
          Space: play/pause · ↑/↓: speed · +/−: size · R: restart · Esc: close. Recordings never leave your device.
        </p>
        {recError && <p role="alert" className="mx-auto mt-1 max-w-5xl text-xs text-red-400">{recError}</p>}
        {showUpsell && (
          <div role="status" className="mx-auto mt-2 max-w-5xl rounded-lg border border-amber-400/50 bg-amber-400/10 p-3 text-xs text-amber-200">
            <strong>PaceCut Pro</strong> (coming soon) adds in-browser webcam recording with teleprompter overlay, mirror mode and custom fonts and colors. Everything runs locally on your device.
            <button className="ml-2 underline" onClick={() => setShowUpsell(false)}>Dismiss</button>
          </div>
        )}
      </div>
    </div>
  );
}
