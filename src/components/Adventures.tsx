"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Castle,
  Clapperboard,
  Ghost,
  MapPin,
  Shirt,
  ShoppingBasket,
} from "lucide-react";
import Section from "./ui/Section";

const adventures = [
  {
    title: "Haunted Locations",
    description:
      "Exploring historic asylums, abandoned estates, and legendary haunted grounds.",
    Icon: Castle,
  },
  {
    title: "Horror & Anime Conventions",
    description:
      "Cosplay, panels, meetups, and the best spooky community energy.",
    Icon: Ghost,
  },
  {
    title: "Horror Movie Premieres",
    description:
      "Red carpets, early screenings, and first reactions from the darkness.",
    Icon: Clapperboard,
  },
  {
    title: "Paranormal Investigations",
    description:
      "Late-night sessions, EVP hunts, and stories from the other side.",
    Icon: MapPin,
  },
  {
    title: "Halloween Shopping Hauls",
    description:
      "Seasonal finds, décor treasures, and year-round spooky staples.",
    Icon: ShoppingBasket,
  },
  {
    title: "Spooky Fashion",
    description:
      "Gothic looks, witchy layers, and everyday Halloween style.",
    Icon: Shirt,
  },
];

export default function Adventures() {
  const reduce = useReducedMotion();

  return (
    <Section id="adventures" title="Latest Adventures">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {adventures.map((item, i) => (
          <motion.article
            key={item.title}
            initial={reduce === false ? { y: 24 } : false}
            whileInView={reduce === false ? { y: 0 } : undefined}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.06, duration: 0.5 }}
            whileHover={
              reduce
                ? undefined
                : {
                    y: -5,
                    borderColor: "color-mix(in srgb, #D96A16 40%, transparent)",
                  }
            }
            className="group relative overflow-hidden rounded-2xl border border-white/8 bg-bg-secondary/60 p-6 transition-colors duration-400"
          >
            <div
              className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in srgb, #4A245A 50%, transparent), transparent)",
              }}
            />
            <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-accent-orange/20 bg-bg-primary/50 text-accent-orange transition-transform duration-500 group-hover:scale-110 group-hover:text-gold">
              <item.Icon className="h-7 w-7" strokeWidth={1.5} />
            </div>
            <h3 className="relative font-display text-lg font-semibold text-bone md:text-xl">
              {item.title}
            </h3>
            <p className="relative mt-2 text-sm leading-relaxed text-muted">
              {item.description}
            </p>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
