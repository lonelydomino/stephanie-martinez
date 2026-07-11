"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  id?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
};

export default function Section({
  id,
  title,
  subtitle,
  children,
  className = "",
}: Props) {
  const reduce = useReducedMotion();

  return (
    <section
      id={id}
      className={`relative z-10 px-5 py-20 md:px-8 md:py-28 ${className}`}
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-12 text-center md:mb-16"
          initial={reduce === false ? { y: 24 } : false}
          whileInView={reduce === false ? { y: 0 } : undefined}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="font-display text-3xl font-semibold tracking-wide text-bone md:text-5xl">
            <span className="bg-gradient-to-b from-gold via-bone to-bone/80 bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted md:text-lg">
              {subtitle}
            </p>
          )}
          <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-accent-purple to-transparent" />
        </motion.div>
        {children}
      </div>
    </section>
  );
}
