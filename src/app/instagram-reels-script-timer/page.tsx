import type { Metadata } from "next";
import { Landing } from "@/components/Landing";
import { REELS } from "@/lib/landing";

export const metadata: Metadata = {
  title: "Instagram Reels Script Timer",
  description: " Check 30, 60 or 90 Seconds:Time your Reels script, see the cut-off word and trim fillers. Free, private and instant.",
  alternates: { canonical: "/instagram-reels-script-timer" },
};

export default function Page() {
  return <Landing c={REELS} />;
}
