"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Download, Mail } from "lucide-react";
import Section from "./ui/Section";
import GlowButton from "./ui/GlowButton";

const industries = [
  "Halloween",
  "Horror",
  "Anime",
  "Travel",
  "Fashion",
  "Home Décor",
  "Paranormal",
  "Entertainment",
];

const services = [
  "Product Reviews",
  "Sponsored Posts",
  "Event Coverage",
  "Brand Ambassadorships",
  "Giveaways",
  "Social Media Campaigns",
];

export default function Collaborate() {
  const reduce = useReducedMotion();

  return (
    <Section
      id="collaborate"
      title="Work With Me"
      subtitle="Interested in collaborating?"
      className="bg-gradient-to-b from-transparent via-accent-purple/5 to-transparent"
    >
      <div className="grid gap-10 lg:grid-cols-2">
        <motion.div
          initial={reduce === false ? { x: -20 } : false}
          whileInView={reduce === false ? { x: 0 } : undefined}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="font-display text-xl font-semibold text-gold">
            Industries
          </h3>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-2">
            {industries.map((name) => (
              <div
                key={name}
                className="rounded-xl border border-white/8 bg-bg-secondary/70 px-4 py-3 text-center text-sm font-medium text-bone transition-all duration-300 hover:border-accent-purple/50 hover:shadow-[0_0_24px_color-mix(in_srgb,#4A245A_30%,transparent)]"
              >
                {name}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={reduce === false ? { x: 20 } : false}
          whileInView={reduce === false ? { x: 0 } : undefined}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="font-display text-xl font-semibold text-gold">
            Services
          </h3>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {services.map((name) => (
              <div
                key={name}
                className="rounded-xl border border-white/8 bg-bg-secondary/70 px-4 py-3 text-center text-sm font-medium text-bone transition-all duration-300 hover:border-accent-orange/40 hover:shadow-[0_0_24px_color-mix(in_srgb,#D96A16_25%,transparent)]"
              >
                {name}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        id="contact"
        className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row"
        initial={reduce === false ? { y: 16 } : false}
        whileInView={reduce === false ? { y: 0 } : undefined}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
      >
        <GlowButton
          href="mailto:business@stephaniemartinez.com"
          variant="orange"
          className="min-w-[220px]"
        >
          <Mail className="h-4 w-4" />
          Business Email
        </GlowButton>
        <GlowButton
          href="/media-kit.pdf"
          variant="ghost"
          className="min-w-[220px]"
          ariaLabel="Download media kit"
        >
          <Download className="h-4 w-4" />
          Media Kit
        </GlowButton>
      </motion.div>
    </Section>
  );
}
