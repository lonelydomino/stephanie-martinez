import type { BlogPost, PostSize, WhatsNewPostSource } from "./whatsNewPosts";
import { fetchInstagramThumbnail, isInstagramUrl } from "./instagram";
import { fetchYouTubeMetadata, formatYouTubeDate } from "./youtube";
import { isYouTubeUrl } from "./youtubeUtils";

export async function enrichPost(source: WhatsNewPostSource): Promise<BlogPost> {
  let scrapedImage: string | undefined;
  let title = source.title;
  let when = source.when;
  let imageAlt = source.imageAlt;

  if (source.href && isYouTubeUrl(source.href)) {
    try {
      const youtube = await fetchYouTubeMetadata(source.href);
      if (youtube) {
        title = title ?? youtube.title;
        when = when ?? formatYouTubeDate(youtube.uploadDate);
        scrapedImage = youtube.thumbnailUrl;
        imageAlt = imageAlt ?? youtube.title;
      }
    } catch (error) {
      console.warn(
        `YouTube enrichment failed for "${source.slug}", using saved fields.`,
        error,
      );
    }
  } else if (source.href && isInstagramUrl(source.href)) {
    try {
      scrapedImage = (await fetchInstagramThumbnail(source.href)) ?? undefined;
    } catch (error) {
      console.warn(
        `Instagram enrichment failed for "${source.slug}", using saved fields.`,
        error,
      );
    }
  }

  const image = source.coverImage ?? scrapedImage ?? source.image ?? "";
  const size: PostSize = source.size ?? "small";

  if (!title || !when || !image || !imageAlt) {
    throw new Error(
      `Post "${source.slug}" is missing required display fields after enrichment`,
    );
  }

  return {
    slug: source.slug,
    title,
    excerpt: source.excerpt,
    when,
    category: source.category,
    status: source.status,
    size,
    image,
    imageAlt,
    href: source.href,
  };
}
