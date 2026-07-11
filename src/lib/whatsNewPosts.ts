export type PostStatus = "current" | "upcoming" | "recent";
export type PostSize = "large" | "small";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  when: string;
  category: string;
  status: PostStatus;
  size: PostSize;
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
  size?: PostSize;
  href?: string;
  title?: string;
  when?: string;
  /** Custom cover image path (overrides scraped thumbnail). */
  coverImage?: string;
  /** Scraped or legacy fallback image when no cover is set. */
  image?: string;
  imageAlt?: string;
};

export const POST_CATEGORIES = [
  "Investigation",
  "Convention",
  "Premiere",
  "Shopping",
  "Travel",
  "Other",
] as const;

export const POST_SIZE_OPTIONS: { value: PostSize; label: string }[] = [
  { value: "large", label: "Large (featured width)" },
  { value: "small", label: "Small (grid card)" },
];

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export const POST_STATUS_OPTIONS: {
  value: PostStatus;
  label: string;
}[] = [
  { value: "current", label: "Right Now" },
  { value: "recent", label: "Just Went" },
  { value: "upcoming", label: "Coming Up" },
];
