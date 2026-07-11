import {
  formatYouTubeDate,
  formatYouTubeUploadDate,
  getYouTubeVideoId,
} from "./youtubeUtils";

export type YouTubeMetadata = {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  uploadDate: string;
};

const OEMBED_URL = "https://www.youtube.com/oembed";
const WATCH_URL = "https://www.youtube.com/watch";
const THUMBNAIL_BASE = "https://i.ytimg.com/vi";

const THUMBNAIL_CANDIDATES = [
  "maxresdefault.jpg",
  "sddefault.jpg",
  "hqdefault.jpg",
] as const;

async function fetchOEmbed(videoId: string) {
  const watchUrl = `${WATCH_URL}?v=${videoId}`;
  const response = await fetch(
    `${OEMBED_URL}?url=${encodeURIComponent(watchUrl)}&format=json`,
    { next: { revalidate: 3600 } },
  );

  if (!response.ok) {
    throw new Error(`YouTube oEmbed failed (${response.status})`);
  }

  return response.json() as Promise<{
    title: string;
    thumbnail_url: string;
  }>;
}

async function fetchWatchPageData(videoId: string): Promise<{
  uploadDate: string | null;
  thumbnailUrl: string | null;
}> {
  const response = await fetch(`${WATCH_URL}?v=${videoId}`, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; SimplySpookyStephanie/1.0; +https://stephanie-martinez.vercel.app)",
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return { uploadDate: null, thumbnailUrl: null };
  }

  const html = await response.text();
  const uploadDate = parseUploadDateFromHtml(html);
  const ogImage = html.match(/property="og:image" content="([^"]+)"/)?.[1];

  const thumbnailUrl =
    ogImage?.includes(`/vi/${videoId}/`) ? ogImage : null;

  return { uploadDate, thumbnailUrl };
}

async function resolveThumbnailUrl(videoId: string): Promise<string> {
  for (const file of THUMBNAIL_CANDIDATES) {
    const url = `${THUMBNAIL_BASE}/${videoId}/${file}`;
    const response = await fetch(url, {
      method: "HEAD",
      next: { revalidate: 3600 },
    });

    if (!response.ok) continue;

    const bytes = Number(response.headers.get("content-length") ?? 0);
    // maxresdefault returns a tiny placeholder for some videos despite 200 OK.
    if (file === "maxresdefault.jpg" && bytes < 5000) continue;

    return url;
  }

  return `${THUMBNAIL_BASE}/${videoId}/hqdefault.jpg`;
}

function parseUploadDateFromHtml(html: string): string | null {
  const isoDate = html.match(/"uploadDate":"([^"]+)"/)?.[1];
  if (isoDate) return isoDate;

  const publishDate = html.match(
    /publishDate":\{"simpleText":"([^"]+)"/,
  )?.[1];
  if (publishDate) return publishDate;

  return null;
}

export async function fetchYouTubeMetadata(
  url: string,
): Promise<YouTubeMetadata | null> {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;

  const [oembed, watchPage, thumbnailUrl] = await Promise.all([
    fetchOEmbed(videoId),
    fetchWatchPageData(videoId),
    resolveThumbnailUrl(videoId),
  ]);

  if (!watchPage.uploadDate) {
    throw new Error(`Could not read upload date for YouTube video ${videoId}`);
  }

  return {
    videoId,
    title: oembed.title,
    thumbnailUrl: watchPage.thumbnailUrl ?? thumbnailUrl,
    uploadDate: watchPage.uploadDate,
  };
}

export { formatYouTubeDate, formatYouTubeUploadDate, getYouTubeVideoId };
