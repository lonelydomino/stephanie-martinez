import {
  fetchYouTubeMetadata,
  formatYouTubeUploadDate,
} from "./youtube";
import { isYouTubeUrl } from "./youtubeUtils";
import {
  type BlogPost,
  type WhatsNewPostSource,
  whatsNewPostSources,
} from "./whatsNewPosts";

async function enrichPost(source: WhatsNewPostSource): Promise<BlogPost> {
  if (source.href && isYouTubeUrl(source.href)) {
    try {
      const youtube = await fetchYouTubeMetadata(source.href);

      if (youtube) {
        return {
          slug: source.slug,
          excerpt: source.excerpt,
          category: source.category,
          status: source.status,
          href: source.href,
          title: youtube.title ?? source.title ?? "Untitled",
          when:
            formatYouTubeUploadDate(youtube.uploadDate) ??
            source.when ??
            "",
          image: youtube.thumbnailUrl ?? source.image ?? "",
          imageAlt: youtube.title ?? source.imageAlt ?? "",
        };
      }
    } catch (error) {
      console.warn(
        `YouTube enrichment failed for "${source.slug}", using manual fields.`,
        error,
      );
    }
  }

  if (!source.title || !source.when || !source.image || !source.imageAlt) {
    throw new Error(
      `Post "${source.slug}" is missing required fields for a non-YouTube entry`,
    );
  }

  return {
    slug: source.slug,
    title: source.title,
    excerpt: source.excerpt,
    when: source.when,
    category: source.category,
    status: source.status,
    image: source.image,
    imageAlt: source.imageAlt,
    href: source.href,
  };
}

export async function getWhatsNewPosts(): Promise<BlogPost[]> {
  return Promise.all(whatsNewPostSources.map(enrichPost));
}
