import { fetchOpenGraphData } from "./openGraph";

export type SocialLinkMetadata = {
  title: string;
  image: string;
  imageAlt: string;
  when?: string;
};

export function isTikTokUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.replace("www.", "");
    return (
      host === "tiktok.com" ||
      host === "vm.tiktok.com" ||
      host === "vt.tiktok.com"
    );
  } catch {
    return false;
  }
}

export async function fetchTikTokMetadata(
  url: string,
): Promise<SocialLinkMetadata | null> {
  const oembedResponse = await fetch(
    `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`,
    { next: { revalidate: 3600 } },
  );

  if (oembedResponse.ok) {
    const data = (await oembedResponse.json()) as {
      title?: string;
      thumbnail_url?: string;
      author_name?: string;
    };

    if (data.thumbnail_url && data.title) {
      return {
        title: data.title,
        image: data.thumbnail_url,
        imageAlt: data.title,
      };
    }
  }

  const openGraph = await fetchOpenGraphData(url);
  if (!openGraph?.image) {
    return null;
  }

  const title = openGraph.title ?? "TikTok post";
  return {
    title,
    image: openGraph.image,
    imageAlt: title,
  };
}
