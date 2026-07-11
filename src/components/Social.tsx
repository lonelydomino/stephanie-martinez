"use client";

import { motion, useReducedMotion } from "framer-motion";
import Section from "./ui/Section";
import GlowButton from "./ui/GlowButton";
import {
  FacebookIcon,
  InstagramIcon,
  SnapchatIcon,
  ThreadsIcon,
  TikTokIcon,
  TumblrIcon,
  XIcon,
  YoutubeIcon,
} from "./icons/SocialIcons";

const platforms = [
  {
    name: "Instagram",
    description: "Outfits, haunted locations, décor, exclusive content",
    href: "https://www.instagram.com/simplyspookystephanie",
    Icon: InstagramIcon,
    variant: "purple" as const,
    glow: "#4A245A",
  },
  {
    name: "TikTok",
    description: "Behind-the-scenes videos, investigations, spooky finds",
    href: "https://www.tiktok.com/@simplyspookystephanie",
    Icon: TikTokIcon,
    variant: "red" as const,
    glow: "#7D1111",
  },
  {
    name: "YouTube",
    description: "Travel, investigations, conventions, longer videos",
    href: "https://www.youtube.com/@simplyspookystephanie",
    Icon: YoutubeIcon,
    variant: "orange" as const,
    glow: "#D96A16",
  },
  {
    name: "Facebook",
    description: "Community, announcements, events",
    href: "https://www.facebook.com/stephanie.martinez.37266",
    Icon: FacebookIcon,
    variant: "purple" as const,
    glow: "#4A245A",
  },
  {
    name: "Snapchat",
    description: "Daily spooky snaps, BTS moments, and quick updates",
    href: "https://www.snapchat.com/t/cLyAhQuI",
    Icon: SnapchatIcon,
    variant: "orange" as const,
    glow: "#D96A16",
  },
  {
    name: "Tumblr",
    description: "Spooky mood boards, edits, and longer-form fandom posts",
    href: "https://www.tumblr.com/simply-stephanie93",
    Icon: TumblrIcon,
    variant: "red" as const,
    glow: "#7D1111",
  },
  {
    name: "Threads",
    description: "Quick spooky updates, thoughts, and community chatter",
    href: "https://www.threads.com/@simplyspookystephanie",
    Icon: ThreadsIcon,
    variant: "purple" as const,
    glow: "#4A245A",
  },
  {
    name: "X",
    description: "Spooky updates, event news, and quick takes",
    href: "https://x.com/spookystephiee",
    Icon: XIcon,
    variant: "ghost" as const,
    glow: "#F5F2EA",
  },
];

export default function Social() {
  const reduce = useReducedMotion();

  return (
    <Section id="social" title="Follow Me">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        {platforms.map((p, i) => (
          <motion.article
            key={p.name}
            initial={reduce === false ? { y: 28 } : false}
            whileInView={reduce === false ? { y: 0 } : undefined}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.08, duration: 0.55 }}
            whileHover={reduce ? undefined : { y: -6 }}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-bg-secondary/80 p-6 backdrop-blur-sm transition-shadow duration-500"
            style={{
              ["--glow-color" as string]: p.glow,
              boxShadow: `0 0 0 0 transparent`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 0 40px color-mix(in srgb, ${p.glow} 40%, transparent)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = `0 0 0 0 transparent`;
            }}
          >
            <div
              className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-bg-primary/60 text-bone transition-colors group-hover:text-gold"
              style={{
                boxShadow: `inset 0 0 24px color-mix(in srgb, ${p.glow} 25%, transparent)`,
              }}
            >
              <p.Icon className="h-7 w-7" />
            </div>
            <h3 className="font-display text-xl font-semibold text-bone">
              {p.name}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
              {p.description}
            </p>
            <GlowButton
              href={p.href}
              external
              variant={p.variant}
              className="mt-6 w-full"
              ariaLabel={`Follow on ${p.name}`}
            >
              {p.name}
            </GlowButton>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
