import {
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

async function fetchUploadDate(videoId: string): Promise<string | null> {
  const response = await fetch(`${WATCH_URL}?v=${videoId}`, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; SimplySpookyStephanie/1.0; +https://stephanie-martinez.vercel.app)",
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return null;
  }

  const html = await response.text();
  const match = html.match(/"uploadDate":"([^"]+)"/);
  return match?.[1] ?? null;
}

export async function fetchYouTubeMetadata(
  url: string,
): Promise<YouTubeMetadata | null> {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;

  const [oembed, uploadDate] = await Promise.all([
    fetchOEmbed(videoId),
    fetchUploadDate(videoId),
  ]);

  if (!uploadDate) {
    throw new Error(`Could not read upload date for YouTube video ${videoId}`);
  }

  return {
    videoId,
    title: oembed.title,
    thumbnailUrl: oembed.thumbnail_url,
    uploadDate,
  };
}

export { formatYouTubeUploadDate, getYouTubeVideoId };
