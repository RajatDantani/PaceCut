import type { LandingContent } from "@/components/Landing";

export const TIKTOK: LandingContent = {
  path: "/tiktok-script-timer",
  h1: "TikTok Script Timer",
  intro: "Time your TikTok script before you film. See the exact word where 60 seconds runs out and trim the rest.",
  presetId: "tiktok",
  seconds: 60,
  sections: [
    { h: "How long should a TikTok script be?", body: [
      "TikTok lets you post much longer videos than it used to, but scripted videos still work best when they are tight. A 15 to 30 second script holds 40 to 75 words. A full 60 second script holds about 150 words at a normal pace.",
      "Because TikTok viewers swipe fast, the first sentence matters most. Write your hook first, then check it with the hook length checker so it lands inside about 3 seconds.",
    ]},
    { h: "Words per TikTok length", body: [
      "At 150 words per minute: 15 seconds is about 38 words, 30 seconds about 75 words, 45 seconds about 112 words and 60 seconds about 150 words. Trending-sound videos and fast cuts often use 170 to 190 WPM, so switch the speed above to match your style.",
    ]},
  ],
  bullets: { h: "TikTok scripting checklist", items: [
    "Open with the payoff or a pattern-breaking question in the first line.",
    "Keep sentences short so captions stay readable.",
    "Cut filler words like basically and literally. PaceCut shows the seconds saved.",
    "End with one clear action: follow, comment or visit the link.",
  ]},
  faq: [
    { q: "How many words fit in a 60 second TikTok?", a: "About 150 words at a conversational 150 WPM, or 180 words if you speak fast." },
    { q: "What is the best TikTok video length?", a: "There is no single best length. Scripted tips and explainers often do well between 20 and 45 seconds, but retention matters more than duration." },
    { q: "Does the timer upload my script?", a: "No. Everything stays in your browser." },
  ],
};

export const SHORTS: LandingContent = {
  path: "/youtube-shorts-script-length",
  h1: "YouTube Shorts Script Length Calculator",
  intro: "Find out how many words your Short can hold and see where a 60 second limit cuts your script.",
  presetId: "shorts",
  seconds: 60,
  sections: [
    { h: "Shorts length and word count", body: [
      "Shorts originally capped at 60 seconds and now allow longer clips, but many creators still target 30 to 60 seconds for loop-friendly pacing. Sixty seconds is about 150 words at a normal speaking pace.",
      "Shorts reward replays. A script that ends cleanly right at the final beat encourages the loop. That makes exact timing more important than on longer videos.",
    ]},
    { h: "Write for the loop", body: [
      "Aim to finish your last line a fraction before the video ends so it flows back into the opening. Use the cut-off view to see where your time lands, then trim the closing words rather than rushing everything.",
      "If your Short is a teaser for a long video, tag the last sentence as CTA and keep it under 5 seconds.",
    ]},
  ],
  bullets: { h: "Quick Shorts targets", items: [
    "Under 30 seconds: 60 to 75 words",
    "45 seconds: about 110 words",
    "60 seconds: about 150 words",
    "Hook: first 8 to 10 words, spoken in about 3 seconds",
  ]},
  faq: [
    { q: "How many words is a 60 second YouTube Short?", a: "Roughly 150 words at 150 WPM. Use the speed buttons for slower or faster delivery." },
    { q: "Can Shorts be longer than 60 seconds?", a: "YouTube has expanded the maximum Shorts length beyond 60 seconds, but check YouTube's current help page for the exact limit." },
    { q: "Should I read from a teleprompter?", a: "It helps keep eye contact and pace. PaceCut has a free teleprompter you can open from the tool above." },
  ],
};

export const REELS: LandingContent = {
  path: "/instagram-reels-script-timer",
  h1: "Instagram Reels Script Timer",
  intro: "Time your Reel script, check it against 30, 60 or 90 seconds and cut it down without losing your point.",
  presetId: "reels",
  seconds: 90,
  sections: [
    { h: "Reels length: shorter usually wins", body: [
      "Instagram allows long Reels, but most scripted Reels perform best when they are short and clear. A 30 second Reel holds about 75 words, 60 seconds about 150 and 90 seconds about 225.",
      "Reels also rely on on-screen text and captions, so your spoken script and your caption should work together rather than repeat each other.",
    ]},
    { h: "Match script to visuals", body: [
      "Break your script into beats of 5 to 8 seconds, one per shot or text overlay. Mark them as Hook, Body and CTA in PaceCut to see how your time is split. If the body takes 80 percent of your budget, shorten it.",
      "Use the caption counter to check your caption stays within Instagram's limit, and keep key words in the first line.",
    ]},
  ],
  bullets: { h: "Reels script tips", items: [
    "Say your point in the first 3 seconds, then explain.",
    "One idea per Reel. Cut side points.",
    "Leave a half second of silence at the end for the loop.",
    "Add a single call to action, such as save or share.",
  ]},
  faq: [
    { q: "How many words fit in a 30 second Reel?", a: "About 75 words at 150 WPM." },
    { q: "How long can an Instagram Reel be?", a: "Instagram has increased Reel limits over time. Check the app for the current maximum. The tool above defaults to 90 seconds." },
    { q: "Is there a teleprompter for Reels?", a: "Yes. Open the free PaceCut teleprompter from the tool above and read while you film." },
  ],
};

export const PRESENTATION: LandingContent = {
  path: "/presentation-timer",
  h1: "Presentation Timer & Script Pacing Tool",
  intro: "Plan a 5 minute talk, a class presentation or a conference slot. See your total time and the exact cut-off point.",
  presetId: "talk5",
  seconds: 300,
  sections: [
    { h: "How many words is a presentation?", body: [
      "Presentations are usually delivered more slowly than conversation because you change slides, gesture and pause for effect. Plan for 120 to 140 words per minute. A 5 minute talk is about 600 to 700 words, and a 10 minute talk about 1,200 to 1,400.",
      "Never plan to fill your entire slot. Aim to finish 30 to 60 seconds early so questions, technical hiccups and applause do not push you over.",
    ]},
    { h: "Budget time by section", body: [
      "A simple structure is a 10 percent opening, 80 percent body and 10 percent close. Mark sections in the tool above to see exactly how many seconds each uses compared with your budget.",
      "Rehearse with the teleprompter at a slow speed. Pausing between points feels long to you but sounds natural to the audience.",
    ]},
  ],
  bullets: { h: "Presentation timing checklist", items: [
    "Pick 120 to 140 WPM for talks with slides.",
    "Leave at least 10 percent of your slot as a buffer.",
    "Spend about one minute per slide at most.",
    "Test your real pace with the speech pace test.",
  ]},
  faq: [
    { q: "How many words for a 5 minute presentation?", a: "About 600 to 700 words at a typical presentation pace of 120 to 140 WPM." },
    { q: "How long should I rehearse?", a: "Run through it aloud at least three times with a timer, and adjust your script if you drift more than 15 seconds from your target." },
    { q: "Can I time a longer talk?", a: "Yes. Set a custom time in seconds, for example 1200 for a 20 minute talk." },
  ],
};
