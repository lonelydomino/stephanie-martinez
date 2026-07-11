"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  FacebookIcon,
  InstagramIcon,
  SnapchatIcon,
  TikTokIcon,
  TumblrIcon,
  YoutubeIcon,
} from "./icons/SocialIcons";

const links = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#whats-new", label: "What's New" },
  { href: "#adventures", label: "Latest Adventures" },
  { href: "#shop", label: "Shop" },
  { href: "#collaborate", label: "Collaborate" },
  { href: "#newsletter", label: "Newsletter" },
  { href: "#contact", label: "Contact" },
];

const socials = [
  { href: "https://www.instagram.com/simplyspookystephanie", label: "Instagram", Icon: InstagramIcon },
  { href: "https://www.tiktok.com/@simplyspookystephanie", label: "TikTok", Icon: TikTokIcon },
  { href: "https://www.youtube.com/@simplyspookystephanie", label: "YouTube", Icon: YoutubeIcon },
  { href: "https://www.facebook.com/stephanie.martinez.37266", label: "Facebook", Icon: FacebookIcon },
  { href: "https://www.snapchat.com/t/cLyAhQuI", label: "Snapchat", Icon: SnapchatIcon },
  { href: "https://www.tumblr.com/simply-stephanie93", label: "Tumblr", Icon: TumblrIcon },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? "bg-bg-primary/85 backdrop-blur-md border-b border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <a
          href="#home"
          className="group flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          <Image
            src="/logo.png"
            alt="Simply Spooky Stephanie"
            width={44}
            height={44}
            priority
            className="h-10 w-10 rounded-full object-cover shadow-[0_0_16px_color-mix(in_srgb,#7D1111_30%,transparent)] transition-transform duration-300 group-hover:scale-105 md:h-11 md:w-11"
          />
          <span className="hidden font-display text-base font-semibold tracking-wide text-bone sm:inline md:text-lg">
            Simply Spooky Stephanie
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-bone"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          {socials.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-muted transition-colors hover:text-accent-orange"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-bone transition-colors hover:bg-white/5 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/5 bg-bg-primary/95 backdrop-blur-md lg:hidden"
          >
            <ul className="flex flex-col px-5 py-4">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-3 font-medium text-bone transition-colors hover:bg-white/5"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-5 border-t border-white/5 px-8 py-4">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-muted transition-colors hover:text-accent-orange"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
