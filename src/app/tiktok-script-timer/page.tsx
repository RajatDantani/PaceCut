import type { Metadata } from "next";
import { Landing } from "@/components/Landing";
import { TIKTOK } from "@/lib/landing";

export const metadata: Metadata = {
  title: "TikTok Script Timer",
  description: " How Long Should Your Script Be?:Time your TikTok script and see the exact word where 60 seconds runs out. Free and private, no AI.",
  alternates: { canonical: "/tiktok-script-timer" },
};

export default function Page() {
  return <Landing c={TIKTOK} />;
}
