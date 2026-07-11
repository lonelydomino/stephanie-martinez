import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  YoutubeIcon,
} from "./icons/SocialIcons";

import Logo from "./Logo";

const socials = [
  { href: "https://instagram.com", label: "Instagram", Icon: InstagramIcon },
  { href: "https://tiktok.com", label: "TikTok", Icon: TikTokIcon },
  { href: "https://youtube.com", label: "YouTube", Icon: YoutubeIcon },
  { href: "https://facebook.com", label: "Facebook", Icon: FacebookIcon },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-bg-primary/90 px-5 py-14 text-center md:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-5 flex justify-center">
          <Logo size="footer" />
        </div>
        <p className="font-display text-lg font-semibold tracking-wide text-bone">
          © 2026 Simply Spooky Stephanie
        </p>
        <p className="mt-1 text-xs tracking-wide text-muted/80">
          Stephanie Martinez
        </p>
        <p className="mt-2 text-sm italic text-muted">
          Keeping Halloween alive every day of the year.
        </p>

        <div className="mt-6 flex items-center justify-center gap-5">
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

        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-muted">
          <a href="/privacy" className="transition-colors hover:text-bone">
            Privacy Policy
          </a>
          <span className="text-white/20" aria-hidden>
            ·
          </span>
          <a href="/terms" className="transition-colors hover:text-bone">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
