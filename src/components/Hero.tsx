"use client";

import { motion, useReducedMotion } from "framer-motion";
import GlowButton from "./ui/GlowButton";

export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="home"
      className="relative z-10 flex min-h-[100svh] items-end md:items-center"
    >
      {/* Haunted mansion silhouette — full-bleed atmospheric plane */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <svg
          className="absolute bottom-[12%] left-1/2 h-auto w-[min(90vw,720px)] -translate-x-1/2 opacity-[0.18]"
          viewBox="0 0 600 320"
          fill="none"
        >
          <path
            fill="#000"
            d="M80 300V180l40-30v-40l50-40 50 40v20l60-50 60 50v-30l40-30 40 30v150H80z"
          />
          <path fill="#0a0a0a" d="M280 80l40-50 40 50v40H280V80z" />
          <rect x="300" y="140" width="18" height="28" fill="#D96A16" opacity="0.35" className="animate-candle" />
          <rect x="160" y="200" width="14" height="22" fill="#D96A16" opacity="0.25" className="animate-candle" />
          <rect x="400" y="210" width="14" height="22" fill="#D96A16" opacity="0.3" className="animate-candle" />
          <rect x="220" y="250" width="40" height="50" fill="#111" />
          <rect x="340" y="250" width="28" height="40" fill="#111" />
        </svg>
        <div
          className="absolute inset-x-0 bottom-0 h-1/2"
          style={{
            background:
              "linear-gradient(to top, #090909 10%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-5xl px-5 pb-24 pt-32 md:px-8 md:pb-32 md:pt-28">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="text-center"
        >
          <p className="mb-4 font-sans text-xs font-medium uppercase tracking-[0.35em] text-accent-orange/90 md:text-sm">
            Spooky Creator • Halloween All Year Long
          </p>

          <h1 className="font-display text-5xl font-semibold leading-[1.1] tracking-wide text-bone sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="bg-gradient-to-b from-gold via-bone to-bone/70 bg-clip-text text-transparent">
              Stephanie
            </span>
            <br />
            <span className="bg-gradient-to-b from-bone via-bone to-muted bg-clip-text text-transparent">
              Martinez
            </span>
          </h1>

          <motion.p
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted md:mt-8 md:text-lg"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
          >
            Exploring haunted places, spooky fashion, paranormal adventures,
            conventions, and everything creepy—365 days a year.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <GlowButton href="#social" variant="purple" className="min-w-[200px]">
              Follow the Darkness
            </GlowButton>
            <GlowButton href="#shop" variant="ghost" className="min-w-[200px]">
              Shop the Style
            </GlowButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
