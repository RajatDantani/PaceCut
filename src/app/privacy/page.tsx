import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/Shell";
export const metadata: Metadata = { title: "Privacy Policy", description: "PaceCut never collects, stores or transmits your script. Read our short privacy policy.", alternates: { canonical: "/privacy" } };
export default function Page() {
  return (
    <PageShell title="Privacy Policy" intro="Short version: your script never leaves your device.">
      <div className="prose-pc">
        <h2>Your scripts</h2>
        <p>All script processing runs locally in your browser. PaceCut does not send script text to any server, does not log it and does not store it in cookies, localStorage or anywhere else. Closing or refreshing the page clears it.</p>
        <h2>Recordings</h2>
        <p>If you use the optional recording feature, video is captured in your browser and saved directly to your device. It is never uploaded.</p>
        <h2>Analytics, ads and affiliates</h2>
        <p>PaceCut does not currently run any tracker. If we add privacy-friendly analytics, it will never include script content. If advertising such as Google AdSense is enabled in future, the ad provider may use cookies as described in its own policy, and we will update this page and add any required consent controls first. Affiliate links, if added, will be labeled.</p>
        <h2>Contact</h2>
        <p>Questions? See the <Link href="/contact">contact page</Link>.</p>
        <p className="text-sm">Last updated: November 2026.</p>
      </div>
    </PageShell>
  );
}
