"use client";

import { motion, useReducedMotion } from "framer-motion";
import Section from "./ui/Section";

export default function About() {
  const reduce = useReducedMotion();

  return (
    <Section id="about" title="About">
      <motion.div
        className="mx-auto max-w-3xl text-center"
        initial={reduce === false ? { y: 20 } : false}
        whileInView={reduce === false ? { y: 0 } : undefined}
        viewport={{ once: true }}
        transition={{ duration: 0.65 }}
      >
        <p className="text-base leading-relaxed text-muted md:text-lg">
          Stephanie Martinez is a spooky lifestyle creator who treats Halloween
          as a year-round identity—not a single October night. From haunted
          locations and paranormal investigations to gothic fashion, horror
          conventions, and carefully curated décor, her world is cinematic,
          curious, and unapologetically eerie.
        </p>
        <p className="mt-5 text-base leading-relaxed text-muted md:text-lg">
          This hub is your doorway into that world: socials, shops,
          collaborations, and the latest adventures—all under one elegant roof.
        </p>
      </motion.div>
    </Section>
  );
}
