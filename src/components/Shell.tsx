import Link from "next/link";
import { NAV, PLATFORM_PAGES } from "@/lib/site";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight" aria-label="PaceCut home">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl text-white" style={{ background: "linear-gradient(135deg, var(--accent), var(--accent2))" }} aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12" /></svg>
          </span>
          <span>Pace<span className="grad-text">Cut</span></span>
        </Link>
        <nav aria-label="Main" className="order-3 flex w-full flex-wrap gap-x-4 gap-y-1 text-sm lg:order-2 lg:w-auto">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="py-2 text-muted hover:text-foreground">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="order-2 lg:order-3"><ThemeToggle /></div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-12 border-t border-border bg-card/50">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-muted">
        <p className="font-semibold text-foreground">Your script never leaves your device.</p>
        <p className="mt-1">PaceCut runs entirely in your browser. No accounts, no uploads, no AI.</p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
          {PLATFORM_PAGES.map((p) => (
            <Link key={p.href} href={p.href} className="py-1 hover:text-foreground">{p.label}</Link>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
          <Link href="/about" className="py-1 hover:text-foreground">About</Link>
          <Link href="/privacy" className="py-1 hover:text-foreground">Privacy</Link>
          <Link href="/terms" className="py-1 hover:text-foreground">Terms</Link>
          <Link href="/contact" className="py-1 hover:text-foreground">Contact</Link>
        </div>
      </div>
    </footer>
  );
}

export function RelatedTools({ exclude }: { exclude?: string }) {
  const items = [...NAV, ...PLATFORM_PAGES].filter((n) => n.href !== exclude);
  return (
    <section className="mt-10">
      <h2 className="text-lg font-bold">More free tools</h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {items.map((n) => (
          <li key={n.href}>
            <Link href={n.href} className="card block py-3 text-sm font-medium transition hover:-translate-y-0.5 hover:border-accent">
              {n.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PageShell({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-3 text-lg text-muted">{intro}</p>
      <div className="mt-6">{children}</div>
    </main>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold">Frequently asked questions</h2>
      <div className="mt-3 space-y-2">
        {items.map((i) => (
          <details key={i.q} className="card">
            <summary className="cursor-pointer font-semibold">{i.q}</summary>
            <p className="mt-2 text-muted">{i.a}</p>
          </details>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </section>
  );
}
