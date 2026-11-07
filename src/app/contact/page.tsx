import type { Metadata } from "next";
import { PageShell } from "@/components/Shell";
export const metadata: Metadata = { title: "Contact", description: "Contact the PaceCut team with feedback, bug reports or partnership questions.", alternates: { canonical: "/contact" } };
// TODO: replace with a real address (see TODO.md).
const EMAIL = "hello@example.com";
export default function Page() {
  return (
    <PageShell title="Contact" intro="Feedback, bug reports and ideas are welcome.">
      <div className="prose-pc">
        <p>Email us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p>
        <p>Please do not send private scripts. We never need them to fix a bug.</p>
      </div>
    </PageShell>
  );
}
