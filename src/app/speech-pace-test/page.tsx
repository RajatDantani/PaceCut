import Link from "next/link";
import type { Metadata } from "next";
import { PageShell, Faq, RelatedTools } from "@/components/Shell";
import { AdSlot } from "@/components/AdSlot";
import { SpeechPaceTest } from "@/components/HelperTools";

export const metadata: Metadata = {
  title: "Speech Pace Test: Find Your Real Words Per Minute",
  description: "Read a short passage aloud with a stopwatch and discover your real speaking speed in words per minute. Free and private.",
  alternates: { canonical: "/speech-pace-test" },
};
const FAQ = [
  { q: "What is a good speaking pace?", a: "Around 140 to 160 WPM is comfortable for most audiences. Presentations often land at 120 to 150." },
  { q: "Does it record my voice?", a: "No. It is a plain stopwatch. No microphone access is requested." },
  { q: "How do I use my result?", a: "Enter it as a custom WPM in the PaceCut script timer for more accurate estimates." },
];
export default function Page() {
  return (
    <PageShell title="Speech Pace Test" intro="Read the passage aloud at your natural speed. We time you and calculate your real words per minute.">
      <SpeechPaceTest />
      <AdSlot id="pace-test" />
      <section className="prose-pc">
        <h2>Why measure your own pace?</h2>
        <p>Averages are only a guide. Some people naturally speak at 130 WPM, others at 190. Knowing yours makes every time estimate in <Link href="/">PaceCut</Link> more accurate.</p>
      </section>
      <Faq items={FAQ} />
      <RelatedTools exclude="/speech-pace-test" />
    </PageShell>
  );
}
