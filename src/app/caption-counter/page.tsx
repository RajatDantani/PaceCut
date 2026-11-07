import Link from "next/link";
import type { Metadata } from "next";
import { PageShell, Faq, RelatedTools } from "@/components/Shell";
import { AdSlot } from "@/components/AdSlot";
import { CaptionCounter } from "@/components/HelperTools";

export const metadata: Metadata = {
  title: "Caption & Character Counter for TikTok, Instagram and YouTube",
  description: "Count characters, words and hashtags and compare against TikTok, Instagram and YouTube caption limits. Free and private.",
  alternates: { canonical: "/caption-counter" },
};
const FAQ = [
  { q: "What is the Instagram caption limit?", a: "Instagram captions have commonly been capped at 2,200 characters, with the first lines shown before the 'more' cut-off. Platforms change limits, so verify in the app." },
  { q: "Do spaces count as characters?", a: "On most platforms, yes. This tool shows both counts." },
  { q: "Are my captions stored?", a: "No. Counting happens locally in your browser." },
];
export default function Page() {
  return (
    <PageShell title="Caption & Character Counter" intro="Count characters, words and hashtags and see how your caption compares with each platform's limit.">
      <CaptionCounter />
      <AdSlot id="caption-counter" />
      <section className="prose-pc">
        <h2>Write captions that fit</h2>
        <p>Put the most important words first, because feeds truncate long captions. Pair your caption with a tight script: check spoken time in the <Link href="/">PaceCut script timer</Link>.</p>
      </section>
      <Faq items={FAQ} />
      <RelatedTools exclude="/caption-counter" />
    </PageShell>
  );
}
