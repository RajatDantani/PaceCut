import Link from "next/link";
import type { Metadata } from "next";
import { PageShell, Faq, RelatedTools } from "@/components/Shell";
import { AdSlot } from "@/components/AdSlot";
import { SpeechTimeCalculator } from "@/components/HelperTools";

export const metadata: Metadata = {
  title: "Speech Time Calculator: Estimate How Long Your Speech Takes",
  description: "Paste your speech and get an estimated speaking time with natural pauses for punctuation. Private, runs in your browser.",
  alternates: { canonical: "/speech-time-calculator" },
};
const FAQ = [
  { q: "Why does punctuation change the time?", a: "Speakers pause at commas, full stops, questions and paragraph breaks. Adding those pauses makes the estimate more realistic than words alone." },
  { q: "Is my speech saved?", a: "No. The calculation runs in your browser and your text is never uploaded or stored." },
  { q: "What speed should I choose?", a: "Use 150 WPM for a natural talk, 120 for formal or nervous delivery, and 180 for a lively pace. Test your own speed with the speech pace test." },
];
export default function Page() {
  return (
    <PageShell title="Speech Time Calculator" intro="Paste your speech to estimate how long it takes to deliver, including natural pauses.">
      <SpeechTimeCalculator />
      <AdSlot id="speech-time" />
      <section className="prose-pc">
        <h2>Plan a speech that fits its slot</h2>
        <p>Weddings, toasts, class presentations and conference talks all come with a time limit. Estimate your total, then trim or expand. If you are over, the <Link href="/">PaceCut script timer</Link> shows exactly which word you would be cut off on and suggests filler words to remove.</p>
        <p>Not sure of your speed? Take the <Link href="/speech-pace-test">speech pace test</Link> and use your real words per minute.</p>
      </section>
      <Faq items={FAQ} />
      <RelatedTools exclude="/speech-time-calculator" />
    </PageShell>
  );
}
