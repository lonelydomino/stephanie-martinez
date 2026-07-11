import { normalizeCoverZoom } from "@/lib/coverFraming";
import { slugify, type WhatsNewPostSource } from "@/lib/whatsNewPosts";

export function normalizePost(post: WhatsNewPostSource): WhatsNewPostSource {
  return {
    ...post,
    slug: post.slug.trim() || slugify(post.title ?? post.excerpt),
    excerpt: post.excerpt.trim(),
    href: post.href?.trim() || undefined,
    title: post.title?.trim() || undefined,
    when: post.when?.trim() || undefined,
    coverImage: post.coverImage?.trim() || undefined,
    coverPosition: post.coverPosition?.trim() || undefined,
    coverZoom: normalizeCoverZoom(post.coverZoom),
    image: post.image?.trim() || undefined,
    imageAlt: post.imageAlt?.trim() || undefined,
    size: post.size ?? "small",
    category: post.category?.trim() || "Investigation",
  };
}

export function postsSnapshot(posts: WhatsNewPostSource[]): string {
  return JSON.stringify(posts.map(normalizePost));
}
