"use client";

import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Section from "./ui/Section";
import GlowButton from "./ui/GlowButton";

function Candle() {
  return (
    <div className="relative flex h-28 w-16 flex-col items-center justify-end" aria-hidden>
      <div className="animate-candle absolute bottom-16 h-10 w-4 rounded-full bg-gradient-to-t from-accent-orange via-[#ffcc66] to-bone/90 blur-[1px]" />
      <div className="animate-candle absolute bottom-[4.25rem] h-3 w-3 rounded-full bg-[#ffe8a8] blur-[2px] opacity-80" />
      <div className="h-16 w-7 rounded-sm bg-gradient-to-b from-bone/90 to-bone/60 shadow-[0_0_20px_color-mix(in_srgb,#D96A16_30%,transparent)]" />
      <div className="h-1.5 w-9 rounded-full bg-bg-secondary" />
    </div>
  );
}

export default function Newsletter() {
  const reduce = useReducedMotion();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      setStatus("error");
      return;
    }
    // Wire to Formspree / Resend later — optimistic local confirm for now
    setStatus("ok");
    setEmail("");
  }

  return (
    <Section
      id="newsletter"
      title="Join the Coven"
      subtitle="Never miss new adventures, spooky finds, product reviews, and Halloween inspiration."
    >
      <motion.div
        className="mx-auto flex max-w-2xl flex-col items-center gap-8 sm:flex-row sm:items-end sm:justify-center"
        initial={reduce === false ? { y: 20 } : false}
        whileInView={reduce === false ? { y: 0 } : undefined}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Candle />

        <form
          onSubmit={onSubmit}
          className="w-full flex-1 rounded-2xl border border-white/8 bg-bg-secondary/70 p-6 backdrop-blur-sm"
        >
          <label htmlFor="coven-email" className="sr-only">
            Email address
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="coven-email"
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setStatus("idle");
              }}
              placeholder="your@email.com"
              className="w-full flex-1 rounded-xl border border-white/10 bg-bg-primary/80 px-4 py-3 text-sm text-bone placeholder:text-muted/60 outline-none transition-shadow focus:border-accent-purple/60 focus:shadow-[0_0_20px_color-mix(in_srgb,#4A245A_35%,transparent)]"
              autoComplete="email"
            />
            <GlowButton type="submit" variant="purple" className="shrink-0 sm:px-8">
              Subscribe
            </GlowButton>
          </div>
          {status === "ok" && (
            <p className="mt-3 text-sm text-accent-orange" role="status">
              Welcome to the coven. Check your inbox soon.
            </p>
          )}
          {status === "error" && (
            <p className="mt-3 text-sm text-accent-red" role="alert">
              Enter a valid email to join.
            </p>
          )}
        </form>
      </motion.div>
    </Section>
  );
}
