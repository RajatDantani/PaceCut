import type { Metadata } from "next";
import { PageShell, RelatedTools } from "@/components/Shell";
export const metadata: Metadata = { title: "About PaceCut", description: "PaceCut is a free, private script timer and teleprompter built with simple rules and formulas, no AI.", alternates: { canonical: "/about" } };
export default function Page() {
  return (
    <PageShell title="About PaceCut" intro="A free, privacy-first script timer and teleprompter for creators, founders, students and speakers.">
      <div className="prose-pc">
        <p>PaceCut answers one question quickly: will my script fit? It counts your words, estimates speaking time from your pace and shows the exact word where your time runs out.</p>
        <h2>Private by design</h2>
        <p>Everything happens in your browser. Your script is never uploaded, logged or stored. There are no accounts.</p>
        <h2>No AI</h2>
        <p>PaceCut uses plain rules and formulas, so results are instant and predictable.</p>
        <h2>How it is funded</h2>
        <p>Core tools are free with no limits. The site may show ads and affiliate links, and a low-priced Pro tier for local extras such as recording, mirror mode and custom looks is planned.</p>
      </div>
      <RelatedTools exclude="/about" />
    </PageShell>
  );
}
