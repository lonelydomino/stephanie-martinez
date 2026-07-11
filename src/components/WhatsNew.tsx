"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Calendar,
  Clapperboard,
  Ghost,
  MapPin,
  Radio,
  ShoppingBag,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Section from "./ui/Section";

type ActivityStatus = "current" | "upcoming" | "recent";

type Activity = {
  title: string;
  description: string;
  when: string;
  location?: string;
  category: string;
  status: ActivityStatus;
  Icon: LucideIcon;
};

const statusLabels: Record<ActivityStatus, string> = {
  current: "Right Now",
  upcoming: "Coming Up",
  recent: "Just Went",
};

const statusStyles: Record<ActivityStatus, string> = {
  current:
    "border-accent-orange/50 bg-accent-orange/10 text-accent-orange shadow-[0_0_20px_color-mix(in_srgb,#D96A16_25%,transparent)]",
  upcoming:
    "border-accent-purple/40 bg-accent-purple/10 text-gold shadow-[0_0_16px_color-mix(in_srgb,#4A245A_20%,transparent)]",
  recent: "border-white/10 bg-bg-primary/60 text-muted",
};

const activities: Activity[] = [
  {
    title: "Paranormal Investigation Series",
    description:
      "Filming overnight sessions, EVPs, and behind-the-scenes footage for a multi-part haunted location series dropping this fall.",
    when: "Summer 2026",
    location: "West Virginia",
    category: "Investigation",
    status: "current",
    Icon: Radio,
  },
  {
    title: "Midsummer Scream Horror Convention",
    description:
      "Panels, cosplay, vendor hall finds, and meetups with the spooky community—full recap on socials.",
    when: "July 2026",
    location: "Long Beach, CA",
    category: "Convention",
    status: "recent",
    Icon: Ghost,
  },
  {
    title: "Horror Film Premiere Night",
    description:
      "Red carpet, early screening, and first reactions from one of the summer's most anticipated slashers.",
    when: "June 2026",
    location: "Los Angeles, CA",
    category: "Premiere",
    status: "recent",
    Icon: Clapperboard,
  },
  {
    title: "Anime Expo",
    description:
      "Spooky cosplay, horror-anime panels, and convention floor content—catch the daily vlogs on TikTok.",
    when: "July 2026",
    location: "Los Angeles, CA",
    category: "Convention",
    status: "upcoming",
    Icon: Ghost,
  },
  {
    title: "Halloween in July Pop-Up Haul",
    description:
      "Year-round décor finds, limited-run merch, and a full review of the best spooky staples from the pop-up.",
    when: "June 2026",
    location: "Orange County, CA",
    category: "Shopping",
    status: "recent",
    Icon: ShoppingBag,
  },
];

export default function WhatsNew() {
  const reduce = useReducedMotion();
  const featured = activities.find((item) => item.status === "current");
  const rest = activities.filter((item) => item.status !== "current");

  return (
    <Section
      id="whats-new"
      title="What's New"
      subtitle="What Stephanie's working on, events she's been to, and what's haunting the calendar next."
      className="bg-gradient-to-b from-transparent via-accent-red/5 to-transparent"
    >
      {featured && (
        <motion.article
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mb-10 overflow-hidden rounded-2xl border border-accent-orange/30 bg-gradient-to-br from-bg-secondary/80 via-bg-primary/60 to-accent-purple/10 p-6 md:p-8"
        >
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, color-mix(in srgb, #D96A16 35%, transparent), transparent)",
            }}
            aria-hidden
          />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-start">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-accent-orange/30 bg-bg-primary/70 text-accent-orange">
              <featured.Icon className="h-8 w-8" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${statusStyles.current}`}
                >
                  {statusLabels.current}
                </span>
                <span className="text-xs font-medium uppercase tracking-widest text-muted">
                  {featured.category}
                </span>
              </div>
              <h3 className="mt-4 font-display text-2xl font-semibold text-bone md:text-3xl">
                {featured.title}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
                {featured.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-4 text-sm text-muted">
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-accent-orange" />
                  {featured.when}
                </span>
                {featured.location && (
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-accent-orange" />
                    {featured.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.article>
      )}

      <div className="relative">
        <div
          className="pointer-events-none absolute bottom-0 left-[1.15rem] top-0 hidden w-px bg-gradient-to-b from-accent-purple/60 via-accent-orange/30 to-transparent md:block"
          aria-hidden
        />

        <ul className="flex flex-col gap-5">
          {rest.map((item, i) => (
            <motion.li
              key={item.title}
              initial={reduce ? false : { opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
            >
              <article className="group relative rounded-2xl border border-white/8 bg-bg-secondary/50 p-5 transition-colors duration-400 hover:border-accent-purple/30 md:pl-14">
                <div
                  className="absolute left-5 top-8 hidden h-3 w-3 rounded-full border-2 border-accent-purple bg-bg-primary shadow-[0_0_12px_color-mix(in_srgb,#4A245A_60%,transparent)] md:block"
                  aria-hidden
                />

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-bg-primary/50 text-gold transition-transform duration-500 group-hover:scale-105">
                    <item.Icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${statusStyles[item.status]}`}
                      >
                        {statusLabels[item.status]}
                      </span>
                      <span className="text-[0.65rem] font-medium uppercase tracking-widest text-muted/80">
                        {item.category}
                      </span>
                    </div>

                    <h3 className="mt-2 font-display text-lg font-semibold text-bone md:text-xl">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {item.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {item.when}
                      </span>
                      {item.location && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          {item.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            </motion.li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
