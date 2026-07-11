"use client";

import { Loader2 } from "lucide-react";

export type SiteStatus = "live" | "deploying";

type Props = {
  status: SiteStatus;
};

export default function AdminSiteStatus({ status }: Props) {
  const deploying = status === "deploying";

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors duration-300 ${
        deploying
          ? "border-sky-400/50 bg-sky-500/15 text-sky-200"
          : "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
      }`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {deploying ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
          <span>Deploying</span>
          <span className="hidden text-xs text-sky-300/80 sm:inline">
            Publishing to live site…
          </span>
        </>
      ) : (
        <>
          <span
            className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_color-mix(in_srgb,#34d399_70%,transparent)]"
            aria-hidden
          />
          <span>Live</span>
          <span className="hidden text-xs text-emerald-300/80 sm:inline">
            Site is up to date
          </span>
        </>
      )}
    </div>
  );
}
