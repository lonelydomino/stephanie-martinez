"use client";

import { useEffect, useId, useRef, useState } from "react";
import { HelpCircle, X } from "lucide-react";

const GUIDE_SECTIONS = [
  {
    title: "Getting started",
    items: [
      "Add a new post with the purple Add post button, or click a post in the list to edit it.",
      "Fill in the form on the right, then click Save post (or Create post for a new one).",
      "Look for the blue ? bubbles next to fields — they have quick tips for that specific setting.",
    ],
  },
  {
    title: "Adding a post from a link",
    items: [
      "Paste a YouTube, Instagram, TikTok, or Tumblr link and the site fills in the title, date, and thumbnail.",
      "Write a short description — that is the only required field besides the link.",
      "Category defaults to Investigation. Change it only if you want a different label on the card.",
    ],
  },
  {
    title: "Card size and status",
    items: [
      "Large = a wide card on the website. Small = a regular card in the grid.",
      "Right Now = happening now. Just Went = something you already did. Coming Up = on the calendar soon.",
    ],
  },
  {
    title: "Cover image",
    items: [
      "The thumbnail from your link is used automatically — you can leave cover as is.",
      "No link yet? A spooky placeholder shows in the preview until you paste a link or upload a cover.",
      "Upload your own picture if you prefer, or click and drag the preview to reposition it.",
      "Use the zoom slider if you need a tighter crop.",
    ],
  },
  {
    title: "Saving and going live",
    items: [
      "Click Save post when you are done. The live website updates in about 1–2 minutes.",
      "A blue Deploying… badge on a post means it is waiting for the site to finish updating.",
      "An orange dot on a post means you have unsaved changes on that post.",
    ],
  },
  {
    title: "Optional overrides",
    items: [
      "Open Optional overrides only if you want to change the auto-filled title or date text.",
      "You can leave those alone.",
    ],
  },
] as const;

export default function AdminHelpGuide() {
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
        className="inline-flex items-center gap-2 rounded-xl border border-sky-400/40 bg-sky-500/10 px-4 py-2 text-sm text-sky-200 hover:border-sky-400/60 hover:bg-sky-500/20"
      >
        <HelpCircle className="h-4 w-4" />
        Help
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
            className={`max-h-[min(85vh,720px)] w-full max-w-lg overflow-y-auto rounded-2xl border border-sky-500/30 bg-bg-secondary p-6 shadow-[0_0_40px_color-mix(in_srgb,#3b82f6_25%,transparent)] transition-all duration-200 ${
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
                  Notes for Stephanie
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  A quick guide to managing What&apos;s New posts. You can close
                  this anytime and come back with the Help button.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close help"
                className="shrink-0 rounded-lg border border-white/10 p-2 text-muted hover:border-white/20 hover:text-bone"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 space-y-5 border-t border-white/8 pt-5">
              {GUIDE_SECTIONS.map((section) => (
                <section key={section.title}>
                  <h3 className="text-sm font-semibold text-gold">
                    {section.title}
                  </h3>
                  <ul className="mt-2 space-y-2 text-sm leading-relaxed text-bone/90">
                    {section.items.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400"
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
