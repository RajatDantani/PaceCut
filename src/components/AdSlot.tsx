// Placeholder only. No real ad code. Replace the inner div with an AdSense <ins> unit later.
export function AdSlot({ id, className = "" }: { id: string; className?: string }) {
  return (
    <div
      data-ad-slot={id}
      aria-hidden="true"
      className={`my-6 flex min-h-[90px] items-center justify-center rounded-xl border border-dashed border-border text-xs text-muted ${className}`}
    >
      {/* AD SLOT: {id}. Paste Google AdSense unit here (see TODO.md) */}
      Ad slot: {id}
    </div>
  );
}

// Placeholder only. No fake affiliate links.
export function AffiliateSlot({ id }: { id: string }) {
  return (
    <div
      data-affiliate-slot={id}
      className="my-6 rounded-xl border border-dashed border-border p-4 text-sm text-muted"
    >
      {/* AFFILIATE SLOT: {id}. Add a real affiliate link here (see TODO.md) */}
      Affiliate slot: {id}. Recommended gear (microphones, ring lights, teleprompter tools) will go here.
    </div>
  );
}
