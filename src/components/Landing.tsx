import { PaceCutTool } from "./PaceCutTool";
import { AdSlot, AffiliateSlot } from "./AdSlot";
import { Faq, RelatedTools } from "./Shell";

export type LandingContent = {
  path: string;
  h1: string;
  intro: string;
  presetId: string;
  seconds: number;
  sections: { h: string; body: string[] }[];
  bullets: { h: string; items: string[] };
  faq: { q: string; a: string }[];
};

export function Landing({ c }: { c: LandingContent }) {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{c.h1}</h1>
      <p className="mt-3 text-lg text-muted">{c.intro}</p>
      <p className="mt-2 inline-block rounded-full border border-border px-3 py-1 text-sm font-semibold">🔒 Your script never leaves your device.</p>
      <div className="mt-6"><PaceCutTool initialPresetId={c.presetId} initialSeconds={c.seconds} /></div>
      <AdSlot id={`${c.path.slice(1)}-below-tool`} />
      <article className="prose-pc">
        {c.sections.map((s) => (
          <section key={s.h}>
            <h2>{s.h}</h2>
            {s.body.map((p, i) => <p key={i}>{p}</p>)}
          </section>
        ))}
        <h2>{c.bullets.h}</h2>
        <ul>{c.bullets.items.map((i) => <li key={i}>{i}</li>)}</ul>
      </article>
      <AffiliateSlot id={`${c.path.slice(1)}-gear`} />
      <Faq items={c.faq} />
      <RelatedTools exclude={c.path} />
    </main>
  );
}
