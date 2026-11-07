import { PaceCutTool } from "@/components/PaceCutTool";
import { AdSlot, AffiliateSlot } from "@/components/AdSlot";
import { Faq, RelatedTools } from "@/components/Shell";

const FAQ = [
  { q: "Is my script uploaded anywhere?", a: "No. All timing, trimming and teleprompter logic runs in your browser. Your script is never sent to a server, logged or stored." },
  { q: "How does PaceCut estimate speaking time?", a: "It divides your word count by your speaking speed in words per minute (120 slow, 150 conversational, 180 fast), then optionally adds short pauses for commas, full stops, question marks and paragraph breaks." },
  { q: "Does PaceCut use AI?", a: "No. Everything is simple rules and formulas, so results are instant, predictable and private." },
  { q: "Is the teleprompter really free?", a: "Yes. The timer, cut-off view, trimming suggestions and teleprompter are free with no limits. Local extras like recording and mirror mode are planned as a low-priced Pro tier." },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">See the exact word where your time runs out.</h1>
      <p className="mt-3 text-lg text-muted">Paste your script, pick a platform and speed, and PaceCut shows how long it takes to say, where it gets cut off, and what to trim. Free, instant and private.</p>
      <p className="mt-2 inline-block rounded-full border border-border px-3 py-1 text-sm font-semibold">🔒 Your script never leaves your device.</p>
      <div className="mt-6"><PaceCutTool /></div>
      <AdSlot id="home-below-tool" />
      <section className="prose-pc mt-8">
        <h2>How to time a script</h2>
        <p>Most people speak at 130 to 160 words per minute, so a 60-second video holds roughly 150 words. PaceCut counts your words, adds natural pauses, and compares the total with your time limit. The cut-off view marks the exact word where you would be cut off, so you can trim with confidence instead of guessing.</p>
        <h2>Built for creators, founders, students and speakers</h2>
        <p>Use platform presets for TikTok, YouTube Shorts and Instagram Reels, a 30-second ad read, a 60-second elevator pitch or a 5-minute presentation. Mark Hook, Body and CTA sections to see how your time is split, then rehearse with the free teleprompter.</p>
      </section>
      <AffiliateSlot id="home-gear" />
      <Faq items={FAQ} />
      <RelatedTools exclude="/" />
    </main>
  );
}
