export function isInstagramUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace("www.", "").includes("instagram.com");
  } catch {
    return false;
  }
}

export async function fetchInstagramThumbnail(
  url: string,
): Promise<string | null> {
  const response = await fetch(url, {
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
  const match = html.match(/property="og:image" content="([^"]+)"/);
  return match?.[1]?.replace(/&amp;/g, "&") ?? null;
}
