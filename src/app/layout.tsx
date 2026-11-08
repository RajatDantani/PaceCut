import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header, Footer } from "@/components/Shell";
import { Analytics } from "@/components/Analytics";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "PaceCut: Free Script Timer & Teleprompter", template: "%s | PaceCut" },
  description:
    "Paste your script and see exactly how long it takes to say. Free script timer with exact cut-off view, platform presets and a teleprompter. Your script never leaves your device.",
  openGraph: {
    type: "website",
    siteName: "PaceCut",
    title: "PaceCut: Free Script Timer & Teleprompter",
    description: "See the exact word where your time runs out. Private, free, no AI.",
    url: "/",
  },
  twitter: { card: "summary", title: "PaceCut", description: "Free script timer and teleprompter. Private by design." },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("pacecut-theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){}`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:p-3">Skip to content</a>
        <Header />
        <div id="main" className="flex flex-1 flex-col">{children}</div>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
