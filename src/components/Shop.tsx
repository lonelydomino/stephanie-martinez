"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Gift, Heart, ShoppingBag, Sticker } from "lucide-react";
import Section from "./ui/Section";
import GlowButton from "./ui/GlowButton";

const shops = [
  {
    name: "Sticker Shop",
    description: "Cute, creepy, and spooky sticker collections.",
    href: "#",
    Icon: Sticker,
    variant: "purple" as const,
  },
  {
    name: "Merchandise",
    description: "Apparel, accessories, seasonal collections.",
    href: "#",
    Icon: ShoppingBag,
    variant: "orange" as const,
  },
  {
    name: "Amazon Storefront",
    description: "Favorite décor, paranormal gear, fashion, everyday finds.",
    href: "#",
    Icon: Gift,
    variant: "red" as const,
  },
  {
    name: "Wishlist",
    description: "Support future adventures.",
    href: "#",
    Icon: Heart,
    variant: "purple" as const,
  },
];

export default function Shop() {
  const reduce = useReducedMotion();

  return (
    <Section
      id="shop"
      title="Shop My Favorites"
      className="bg-gradient-to-b from-transparent via-bg-secondary/40 to-transparent"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {shops.map((item, i) => (
          <motion.article
            key={item.name}
            initial={reduce ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.08, duration: 0.55 }}
            whileHover={
              reduce
                ? undefined
                : {
                    y: -6,
                    boxShadow:
                      "0 0 40px color-mix(in srgb, #4A245A 35%, transparent)",
                  }
            }
            className="group flex flex-col rounded-2xl border border-white/8 bg-bg-primary/70 p-6 backdrop-blur-sm transition-all duration-500"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-purple/30 text-gold transition-transform duration-500 group-hover:scale-110">
              <item.Icon className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-semibold text-bone">
              {item.name}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
              {item.description}
            </p>
            <GlowButton
              href={item.href}
              external={item.href.startsWith("http")}
              variant={item.variant}
              className="mt-6 w-full"
            >
              {item.name}
            </GlowButton>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
