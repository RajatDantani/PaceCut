import type { Metadata } from "next";
import { Landing } from "@/components/Landing";
import { SHORTS } from "@/lib/landing";

export const metadata: Metadata = {
  title: "YouTube Shorts Script Length",
  description: " Words for 30 and 60 Seconds:How many words fit in a YouTube Short? Paste your script and see where the time limit cuts it off.",
  alternates: { canonical: "/youtube-shorts-script-length" },
};

export default function Page() {
  return <Landing c={SHORTS} />;
}
