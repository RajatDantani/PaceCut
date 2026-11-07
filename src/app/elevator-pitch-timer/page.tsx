import Link from "next/link";
import type { Metadata } from "next";
import { PageShell, Faq, RelatedTools } from "@/components/Shell";
import { AdSlot } from "@/components/AdSlot";
import { ElevatorPitchTimer } from "@/components/HelperTools";

export const metadata: Metadata = {
  title: "Elevator Pitch Timer: Fit Your Pitch in 30 or 60 Seconds",
  description: "Paste your elevator pitch, pick 15 to 120 seconds, and see the exact word where time runs out. Free and private.",
  alternates: { canonical: "/elevator-pitch-timer" },
};
const FAQ = [
  { q: "How long is an elevator pitch?", a: "Usually 30 to 60 seconds, which is about 75 to 150 words at a conversational pace." },
  { q: "What should a pitch include?", a: "Who you help, the problem you solve, how you are different, and a clear next step." },
  { q: "Is my pitch stored?", a: "No. Everything runs in your browser." },
];
export default function Page() {
  return (
    <PageShell title="Elevator Pitch Timer" intro="Pick your length, paste your pitch and see exactly where it gets cut off.">
      <ElevatorPitchTimer />
      <AdSlot id="pitch-timer" />
      <section className="prose-pc">
        <h2>A simple pitch structure</h2>
        <ul>
          <li>Hook: who you help and the problem (about 10 seconds)</li>
          <li>Body: what you do and why it works (about 35 seconds)</li>
          <li>CTA: the one thing you want next (about 10 seconds)</li>
        </ul>
        <p>Tag these sections in the full <Link href="/">PaceCut tool</Link> to see your time split, then rehearse with the free teleprompter.</p>
      </section>
      <Faq items={FAQ} />
      <RelatedTools exclude="/elevator-pitch-timer" />
    </PageShell>
  );
}
