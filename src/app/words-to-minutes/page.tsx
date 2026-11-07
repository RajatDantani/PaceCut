import Link from "next/link";
import type { Metadata } from "next";
import { PageShell, Faq, RelatedTools } from "@/components/Shell";
import { AdSlot } from "@/components/AdSlot";
import { WordsToMinutes } from "@/components/HelperTools";

export const metadata: Metadata = {
  title: "Words to Minutes Calculator: How Long Is Your Text Spoken?",
  description: "Convert a word count into speaking time. Choose slow, normal or fast speed or enter your own WPM. Free and private.",
  alternates: { canonical: "/words-to-minutes" },
};
const FAQ = [
  { q: "How many words is one minute of speech?", a: "About 150 words at a normal conversational pace. Slow, clear speech is closer to 120 and fast, energetic speech is about 180." },
  { q: "How many words is a 5-minute speech?", a: "Roughly 750 words at 150 WPM, or 600 to 900 words depending on your pace." },
  { q: "Does this count pauses?", a: "This quick calculator uses pure words per minute. For pauses after commas and full stops, use the speech time calculator." },
];
export default function Page() {
  return (
    <PageShell title="Words to Minutes Calculator" intro="Turn a word count into speaking time in seconds. Pick a speed or enter your own words per minute.">
      <WordsToMinutes />
      <AdSlot id="words-to-minutes" />
      <section className="prose-pc">
        <h2>How the calculation works</h2>
        <p>Speaking time in minutes equals words divided by words per minute. At 150 WPM, 500 words take about 3 minutes 20 seconds. Audiobook narrators average around 150 to 160 WPM, while auctioneers and fast talkers can exceed 250.</p>
        <p>Have the full text? Paste it into the <Link href="/">PaceCut script timer</Link> to see the exact cut-off point for your time limit, or use the <Link href="/speech-time-calculator">speech time calculator</Link> to include natural pauses.</p>
      </section>
      <Faq items={FAQ} />
      <RelatedTools exclude="/words-to-minutes" />
    </PageShell>
  );
}
