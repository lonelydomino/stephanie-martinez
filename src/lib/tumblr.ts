import {
  fetchOpenGraphData,
  formatOpenGraphDate,
  type OpenGraphData,
} from "./openGraph";

export type SocialLinkMetadata = {
  title: string;
  image: string;
  imageAlt: string;
  when?: string;
};

export function isTumblrUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.replace("www.", "");
    return host === "tumblr.com" || host.endsWith(".tumblr.com");
  } catch {
    return false;
  }
}

function metadataFromOpenGraph(openGraph: OpenGraphData): SocialLinkMetadata | null {
  if (!openGraph.image) {
    return null;
  }

  const title = openGraph.title ?? "Tumblr post";

  return {
    title,
    image: openGraph.image,
    imageAlt: title,
    when: openGraph.publishedTime
      ? formatOpenGraphDate(openGraph.publishedTime)
      : undefined,
  };
}

export async function fetchTumblrMetadata(
  url: string,
): Promise<SocialLinkMetadata | null> {
  const openGraph = await fetchOpenGraphData(url);
  if (!openGraph) {
    return null;
  }

  return metadataFromOpenGraph(openGraph);
}
