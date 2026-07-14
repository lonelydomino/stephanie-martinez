export type AdminChangelogEntry = {
  version: string;
  date: string;
  items: string[];
};

export const ADMIN_CHANGELOG: AdminChangelogEntry[] = [
  {
    version: "1.4.0",
    date: "2026-07-14",
    items: [
      "New Updates button on this page — open it anytime to see what changed and when.",
    ],
  },
  {
    version: "1.3.0",
    date: "2026-07-11",
    items: [
      "Live / Deploying pill at the top shows when the public site has caught up with your saves.",
      "Rearrange mode — drag posts or use arrows, then Save to update the order on the website.",
      "Save messages and errors sit next to the unsaved-changes notice on phones.",
    ],
  },
  {
    version: "1.2.0",
    date: "2026-07-11",
    items: [
      "Help guide and ? bubbles on fields explain what each setting does.",
      "Blue Publishing… badge on a post while the live site is still catching up.",
      "Spooky placeholder cover when a post has no link thumbnail or upload yet.",
      "Category defaults to Investigation so you can skip it for most posts.",
    ],
  },
  {
    version: "1.1.0",
    date: "2026-07-11",
    items: [
      "Upload a custom cover image and drag the preview to reposition it.",
      "Zoom slider for tighter cover crops.",
      "Choose Large (featured) or Small (grid) card size per post.",
      "Title and date fields moved into the main form — no more overrides dropdown.",
      "Blog grid on the homepage lays out mixed card sizes more cleanly.",
    ],
  },
  {
    version: "1.0.0",
    date: "2026-07-11",
    items: [
      "What's New admin — add, edit, and remove blog posts from /admin/posts.",
      "Paste a YouTube, Instagram, TikTok, or Tumblr link to auto-fill title, date, and thumbnail.",
      "Save one post at a time with warnings when you have unsaved changes.",
      "Password-protected admin area for managing the live site.",
    ],
  },
];

export function getAdminChangelog(): AdminChangelogEntry[] {
  return [...ADMIN_CHANGELOG].sort((a, b) => b.date.localeCompare(a.date));
}

export function formatChangelogDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export const LATEST_ADMIN_VERSION =
  getAdminChangelog()[0]?.version ?? "1.0.0";
