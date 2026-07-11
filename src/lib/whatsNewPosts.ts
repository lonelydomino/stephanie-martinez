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

export const POST_CATEGORIES = [
  "Investigation",
  "Convention",
  "Premiere",
  "Shopping",
  "Travel",
  "Other",
] as const;

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
  { value: "current", label: "Right Now (featured)" },
  { value: "recent", label: "Just Went" },
  { value: "upcoming", label: "Coming Up" },
];
