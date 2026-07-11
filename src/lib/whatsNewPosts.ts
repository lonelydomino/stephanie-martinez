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
    slug: "haunted-at-the-roosevelt",
    excerpt:
      "A haunted look inside The Roosevelt — ghost stories, eerie history, and the spots that still feel unsettling after dark.",
    category: "Investigation",
    status: "recent",
    href: "https://youtu.be/oZv7ngPe0i4",
    title: "Haunted at The Roosevelt",
    when: "June 23, 2026",
    image: "/blog/midsummer-scream.jpg",
    imageAlt: "The Roosevelt hotel",
  },
  {
    slug: "paranormal-this-n-that-ep2",
    excerpt:
      "Episode 2 with SoCal Spirit Seekers — overnight investigating at This n That, EVPs, and the moments that kept us on edge.",
    category: "Investigation",
    status: "recent",
    href: "https://youtu.be/ePDTA_zQKGc",
    title: "Paranormal Investigating at This n That with SoCal Spirit Seekers Ep2",
    when: "May 3, 2026",
    image: "/blog/horror-premiere.jpg",
    imageAlt: "Paranormal investigation at This n That",
  },
  {
    slug: "paranormal-this-n-that-ep1",
    excerpt:
      "Episode 1 with SoCal Spirit Seekers — investigating the antique store and museum at This n That, from first setup to the first unexplainable moments.",
    category: "Investigation",
    status: "recent",
    href: "https://youtu.be/l8ocEidmYWU",
    title:
      "Paranormal Investigating at This n That Antique Store and Museum with SoCal Spirit Seekers Ep1",
    when: "May 3, 2026",
    image: "/blog/anime-expo.jpg",
    imageAlt: "Paranormal investigation at This n That antique store",
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
