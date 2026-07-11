export type PostStatus = "current" | "upcoming" | "recent";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  when: string;
  category: string;
  status: PostStatus;
  image: string;
  imageAlt: string;
  href?: string;
};

/** Manual post fields. YouTube `href` values are enriched at build time. */
export type WhatsNewPostSource = {
  slug: string;
  excerpt: string;
  category: string;
  status: PostStatus;
  href?: string;
  title?: string;
  when?: string;
  image?: string;
  imageAlt?: string;
};

export const whatsNewPostSources: WhatsNewPostSource[] = [
  {
    slug: "new-orleans-most-haunted",
    excerpt:
      "A tour through New Orleans' most haunted locations — legends, lore, and the spots that still give us chills.",
    category: "Investigation",
    status: "current",
    href: "https://youtu.be/3UlpjWwiyJM",
    title: "New Orleans Most Haunted Locations",
    when: "June 24, 2026",
    image: "/blog/paranormal-series.jpg",
    imageAlt: "New Orleans haunted locations",
  },
  {
    slug: "midsummer-scream-2026",
    title: "Midsummer Scream Horror Convention",
    excerpt:
      "Panels, cosplay, vendor hall treasures, and meetups with the spooky community. A full weekend of horror energy—recap posts and haul videos are live on socials.",
    when: "July 2026",
    category: "Convention",
    status: "recent",
    image: "/blog/midsummer-scream.jpg",
    imageAlt: "Crowd and booths at a horror convention",
  },
  {
    slug: "horror-film-premiere",
    title: "Horror Film Premiere Night",
    excerpt:
      "Red carpet looks, an early screening, and first reactions from one of the summer's most anticipated slashers. Watch the premiere vlog for the full night out.",
    when: "June 2026",
    category: "Premiere",
    status: "recent",
    image: "/blog/horror-premiere.jpg",
    imageAlt: "Movie theater seats before a horror film screening",
  },
  {
    slug: "anime-expo-2026",
    title: "Anime Expo — Spooky Cosplay & Panels",
    excerpt:
      "Horror-anime panels, convention floor content, and spooky cosplay all weekend. Daily vlogs and outfit breakdowns are coming to TikTok.",
    when: "July 2026",
    category: "Convention",
    status: "upcoming",
    image: "/blog/anime-expo.jpg",
    imageAlt: "Convention attendees in cosplay",
  },
  {
    slug: "halloween-in-july-haul",
    title: "Halloween in July Pop-Up Haul",
    excerpt:
      "Year-round décor finds, limited-run merch, and a full review of the best spooky staples from the pop-up. Every piece styled and ranked for the haunt-at-home crowd.",
    when: "June 2026",
    category: "Shopping",
    status: "recent",
    image: "/blog/halloween-haul.jpg",
    imageAlt: "Halloween decorations and seasonal merchandise on display",
  },
];
