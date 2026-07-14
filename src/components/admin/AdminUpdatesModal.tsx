"use client";

import { useEffect, useId, useRef, useState } from "react";
import { History, X } from "lucide-react";
import {
  formatChangelogDate,
  getAdminChangelog,
} from "@/lib/adminChangelog";

const UPDATES = getAdminChangelog();

export default function AdminUpdatesModal() {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (open) {
      setShown(true);
      return;
    }

    if (!shown) return;

    const timer = window.setTimeout(() => setShown(false), 200);
    return () => window.clearTimeout(timer);
  }, [open, shown]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl border border-gold/40 bg-gold/10 px-4 py-2 text-sm text-gold hover:border-gold/60 hover:bg-gold/15"
      >
        <History className="h-4 w-4" />
        Updates
      </button>

      {shown && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/80 px-4 backdrop-blur-sm transition-opacity duration-200 ${
            open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={() => setOpen(false)}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(event) => event.stopPropagation()}
            className={`max-h-[min(85vh,720px)] w-full max-w-lg overflow-y-auto rounded-2xl border border-gold/30 bg-bg-secondary p-6 shadow-[0_0_40px_color-mix(in_srgb,#d4a853_20%,transparent)] transition-all duration-200 ${
              open
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-2 scale-[0.98] opacity-0"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id={titleId}
                  className="font-display text-xl font-semibold text-bone"
                >
                  Site updates
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Everything that&apos;s been added or improved on the admin
                  and public site, newest first.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close updates"
                className="shrink-0 rounded-lg border border-white/10 p-2 text-muted hover:border-white/20 hover:text-bone"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 space-y-5 border-t border-white/8 pt-5">
              {UPDATES.map((entry) => (
                <section
                  key={entry.version}
                  className="rounded-xl border border-white/6 bg-bg-primary/40 p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-gold">
                      v{entry.version}
                    </span>
                    <time
                      dateTime={entry.date}
                      className="text-xs font-medium text-muted"
                    >
                      {formatChangelogDate(entry.date)}
                    </time>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-bone/90">
                    {entry.items.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                          aria-hidden
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
