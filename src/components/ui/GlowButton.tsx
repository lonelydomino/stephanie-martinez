"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Variant = "purple" | "orange" | "red" | "ghost" | "bone";

const variants: Record<Variant, string> = {
  purple:
    "bg-accent-purple text-bone shadow-[0_0_24px_color-mix(in_srgb,#4A245A_50%,transparent)] hover:shadow-[0_0_36px_color-mix(in_srgb,#4A245A_70%,transparent)] hover:brightness-110",
  orange:
    "bg-accent-orange text-bg-primary shadow-[0_0_24px_color-mix(in_srgb,#D96A16_45%,transparent)] hover:shadow-[0_0_36px_color-mix(in_srgb,#D96A16_65%,transparent)] hover:brightness-110",
  red: "bg-accent-red text-bone shadow-[0_0_24px_color-mix(in_srgb,#7D1111_50%,transparent)] hover:shadow-[0_0_36px_color-mix(in_srgb,#7D1111_70%,transparent)] hover:brightness-110",
  ghost:
    "bg-transparent text-bone border border-bone/25 hover:border-bone/50 hover:bg-bone/5 shadow-[0_0_16px_transparent] hover:shadow-[0_0_24px_color-mix(in_srgb,#F5F2EA_15%,transparent)]",
  bone: "bg-bone text-bg-primary shadow-[0_0_20px_color-mix(in_srgb,#F5F2EA_25%,transparent)] hover:shadow-[0_0_32px_color-mix(in_srgb,#F5F2EA_40%,transparent)] hover:brightness-105",
};

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit";
  external?: boolean;
  ariaLabel?: string;
};

export default function GlowButton({
  children,
  href,
  onClick,
  variant = "purple",
  className = "",
  type = "button",
  external = false,
  ariaLabel,
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-sans text-sm font-bold tracking-wide transition-all duration-300 ease-out hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        aria-label={ariaLabel}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={classes}
      aria-label={ariaLabel}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
}
