import type { Metadata } from "next";
import { PageShell } from "@/components/Shell";
export const metadata: Metadata = { title: "Terms of Use", description: "Terms of use for the PaceCut script timer and teleprompter.", alternates: { canonical: "/terms" } };
export default function Page() {
  return (
    <PageShell title="Terms of Use" intro="Plain-language terms for using PaceCut.">
      <div className="prose-pc">
        <p>PaceCut is provided as is, without warranties. Time estimates are approximations based on words per minute and may differ from your real delivery. Always rehearse with a real timer.</p>
        <p>Platform limits shown on this site (for example caption lengths) change over time. Check each platform for current rules.</p>
        <p>You keep full ownership of everything you write. We do not receive or store it.</p>
        <p>You agree not to misuse the site or attempt to disrupt it. We may update these terms and the site at any time.</p>
        <p className="text-sm">Last updated: November 2026.</p>
      </div>
    </PageShell>
  );
}
