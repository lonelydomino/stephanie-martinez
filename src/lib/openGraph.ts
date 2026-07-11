const USER_AGENT =
  "Mozilla/5.0 (compatible; SimplySpookyStephanie/1.0; +https://stephanie-martinez.vercel.app)";

export type OpenGraphData = {
  title?: string;
  image?: string;
  description?: string;
  publishedTime?: string;
};

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function readMetaContent(html: string, patterns: RegExp[]): string | undefined {
  for (const pattern of patterns) {
    const match = html.match(pattern)?.[1];
    if (match) return decodeHtmlEntities(match);
  }
  return undefined;
}

export async function fetchOpenGraphData(
  url: string,
): Promise<OpenGraphData | null> {
  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    redirect: "follow",
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return null;
  }

  const html = await response.text();

  return {
    title: readMetaContent(html, [
      /property="og:title" content="([^"]+)"/,
      /name="twitter:title" content="([^"]+)"/,
    ]),
    image: readMetaContent(html, [
      /property="og:image" content="([^"]+)"/,
      /name="twitter:image" content="([^"]+)"/,
    ]),
    description: readMetaContent(html, [
      /property="og:description" content="([^"]+)"/,
      /name="description" content="([^"]+)"/,
    ]),
    publishedTime: readMetaContent(html, [
      /property="article:published_time" content="([^"]+)"/,
      /property="og:updated_time" content="([^"]+)"/,
    ]),
  };
}

export function formatOpenGraphDate(value: string): string {
  if (!value.includes("T")) return value;

  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
