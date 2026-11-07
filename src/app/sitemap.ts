import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
const paths = ["/", "/words-to-minutes", "/speech-time-calculator", "/hook-length-checker", "/caption-counter", "/elevator-pitch-timer", "/speech-pace-test", "/tiktok-script-timer", "/youtube-shorts-script-length", "/instagram-reels-script-timer", "/presentation-timer", "/about", "/privacy", "/terms", "/contact"];
export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((p) => ({ url: `${SITE.url}${p}`, changeFrequency: "monthly", priority: p === "/" ? 1 : 0.7 }));
}
