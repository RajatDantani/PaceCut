import Link from "next/link";
import type { Metadata } from "next";
import { PageShell, Faq, RelatedTools } from "@/components/Shell";
import { AdSlot } from "@/components/AdSlot";
import { HookLengthChecker } from "@/components/HelperTools";

export const metadata: Metadata = {
  title: "Hook Length Checker for TikTok, Shorts and Reels",
  description: "Check how long your opening hook takes to say and whether it lands inside the first 3 seconds. Free, private, no sign-up.",
  alternates: { canonical: "/hook-length-checker" },
};
const FAQ = [
  { q: "How long should a hook be?", a: "For short-form video, aim for a first line you can say in about 3 seconds, which is roughly 8 to 10 words at a lively pace." },
  { q: "What makes a good hook?", a: "A clear promise, a surprising claim or a direct question about the viewer's problem. Cut greetings and warm-ups." },
  { q: "Can I time the whole script?", a: "Yes. Use the main PaceCut tool and tag the first lines with # Hook to see its share of your total time." },
];
export default function Page() {
  return (
    <PageShell title="Hook Length Checker" intro="Your first sentence decides whether people keep watching. See how long your hook takes to say.">
      <HookLengthChecker />
      <AdSlot id="hook-checker" />
      <section className="prose-pc">
        <h2>Why hook length matters</h2>
        <p>Short-form platforms reward early retention. A hook that takes six seconds to say loses viewers before the point lands. Write the hook, trim it until it fits in about 3 seconds, then check the rest of your script in <Link href="/">PaceCut</Link> with HOOK, BODY and CTA sections.</p>
      </section>
      <Faq items={FAQ} />
      <RelatedTools exclude="/hook-length-checker" />
    </PageShell>
  );
}
