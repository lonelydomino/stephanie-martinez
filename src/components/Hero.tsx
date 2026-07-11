"use client";

import { motion, useReducedMotion } from "framer-motion";
import GlowButton from "./ui/GlowButton";
import Logo from "./Logo";

export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="home"
      className="relative z-10 flex min-h-[100svh] items-end md:items-center"
    >
      <div className="relative mx-auto w-full max-w-5xl px-5 pb-24 pt-32 md:px-8 md:pb-32 md:pt-28">
        <motion.div
          initial={reduce === false ? { y: 32 } : false}
          animate={{ y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="text-center"
        >
          <motion.div
            className="mx-auto mb-6 flex justify-center md:mb-8"
            initial={reduce === false ? { y: 16 } : false}
            animate={{ y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
          >
            <Logo size="hero" priority />
          </motion.div>

          <h1 className="sr-only">
            Stephanie Martinez — Spooky Creator, Halloween All Year Long
          </h1>

          <p className="mb-4 font-sans text-xs font-medium uppercase tracking-[0.35em] text-accent-orange/90 md:text-sm">
            Spooky Creator • Halloween All Year Long
          </p>

          <p className="font-display text-2xl font-semibold tracking-wide text-bone sm:text-3xl md:text-4xl">
            @SimplySpookyStephanie
          </p>

          <motion.p
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted md:mt-8 md:text-lg"
            initial={reduce === false ? { y: 16 } : false}
            animate={{ y: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
          >
            Exploring haunted places, spooky fashion, paranormal adventures,
            conventions, and everything creepy—365 days a year.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={reduce === false ? { y: 16 } : false}
            animate={{ y: 0 }}
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
