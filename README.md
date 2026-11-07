# PaceCut

Free, privacy-first script timer and teleprompter. No AI, no backend, no accounts.
**Your script never leaves your device.**

## Run
```bash
npm install --legacy-peer-deps
npm run dev      # http://localhost:3000
npm test         # unit tests for the timing engine
npm run lint
npm run build && npm start
```

## Deploy to Vercel
1. Push this repo to GitHub (`pacecut`).
2. In Vercel: **Add New → Project → Import** the repo. Framework is detected as Next.js. No env vars required.
3. Optional: set `NEXT_PUBLIC_SITE_URL` to your real domain (used in sitemap, robots and canonical URLs).

## Structure
- `src/lib/engine.ts`: core engine (word count, timing, pauses, cut-off, sections, trimming). Tested in `engine.test.ts`.
- `src/components/PaceCutTool.tsx`: hero tool. `Teleprompter.tsx`: full-screen teleprompter.
- `src/lib/premium.ts`: `isPremium` flag (off). Gates recording, mirror mode, fonts and colors.
- `src/components/AdSlot.tsx`: empty AdSense and affiliate slots. `Analytics.tsx`: placeholder.
- `src/lib/landing.ts`: content for platform landing pages.
