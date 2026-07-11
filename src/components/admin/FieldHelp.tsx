"use client";

import { useId, useState } from "react";
import { HelpCircle } from "lucide-react";

type FieldHelpProps = {
  text: string;
};

export function FieldHelp({ text }: FieldHelpProps) {
  const [open, setOpen] = useState(false);
  const helpId = useId();

  return (
    <span className="relative inline-flex shrink-0">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-describedby={open ? helpId : undefined}
        aria-label={open ? "Hide help" : "Show help"}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-sky-400/50 bg-sky-500/15 text-sky-300 transition-colors hover:border-sky-400 hover:bg-sky-500/25"
      >
        <HelpCircle className="h-3.5 w-3.5" />
      </button>
      {open && (
        <span
          id={helpId}
          role="tooltip"
          className="absolute left-0 top-full z-20 mt-2 w-64 max-w-[calc(100vw-3rem)] rounded-xl border border-sky-500/35 bg-bg-primary px-3 py-2.5 text-left text-xs leading-relaxed text-sky-200 shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
        >
          {text}
        </span>
      )}
    </span>
  );
}

type FieldLabelProps = {
  label: string;
  help: string;
  htmlFor?: string;
  muted?: boolean;
};

export function FieldLabel({ label, help, htmlFor, muted = false }: FieldLabelProps) {
  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor={htmlFor}
        className={`text-sm font-medium ${muted ? "text-muted" : "text-bone"}`}
      >
        {label}
      </label>
      <FieldHelp text={help} />
    </div>
  );
}
