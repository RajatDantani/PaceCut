"use client";
import { useSyncExternalStore } from "react";

// Only the light/dark choice is saved (localStorage key "pacecut-theme"). Never script content.
function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}
const getTheme = (): "light" | "dark" =>
  document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => null);

  function set(next: "light" | "dark") {
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("pacecut-theme", next); } catch {}
  }

  const btn = (mode: "light" | "dark", label: string, icon: React.ReactNode) => (
    <button
      type="button"
      onClick={() => set(mode)}
      aria-label={label}
      aria-pressed={theme === mode}
      title={label}
      className={`flex h-9 w-9 items-center justify-center rounded-full ${theme === mode ? "bg-accent text-accent-fg" : "text-muted hover:text-foreground"}`}
    >
      {icon}
    </button>
  );

  return (
    <div role="group" aria-label="Color theme" className="flex items-center gap-1 rounded-full border border-border p-0.5">
      {btn("light", "Light mode", (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ))}
      {btn("dark", "Dark mode", (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      ))}
    </div>
  );
}
