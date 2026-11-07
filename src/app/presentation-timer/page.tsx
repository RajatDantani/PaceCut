import type { Metadata } from "next";
import { Landing } from "@/components/Landing";
import { PRESENTATION } from "@/lib/landing";

export const metadata: Metadata = {
  title: "Presentation Timer",
  description: " Plan Your Talk Script and Pace:Estimate how long your presentation script takes, from 5 to 20 minutes, with section timing and a free teleprompter.",
  alternates: { canonical: "/presentation-timer" },
};

export default function Page() {
  return <Landing c={PRESENTATION} />;
}
