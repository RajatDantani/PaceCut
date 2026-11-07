export const SITE = {
  name: "PaceCut",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://pacecut.vercel.app",
  tagline: "Free script timer and teleprompter. Your script never leaves your device.",
};

export const NAV = [
  { href: "/", label: "Script timer" },
  { href: "/words-to-minutes", label: "Words to minutes" },
  { href: "/speech-time-calculator", label: "Speech time" },
  { href: "/hook-length-checker", label: "Hook checker" },
  { href: "/caption-counter", label: "Caption counter" },
  { href: "/elevator-pitch-timer", label: "Pitch timer" },
  { href: "/speech-pace-test", label: "Pace test" },
];

export const PLATFORM_PAGES = [
  { href: "/tiktok-script-timer", label: "TikTok script timer" },
  { href: "/youtube-shorts-script-length", label: "YouTube Shorts script length" },
  { href: "/instagram-reels-script-timer", label: "Instagram Reels script timer" },
  { href: "/presentation-timer", label: "Presentation timer" },
];
