export function getYouTubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);

    if (parsed.hostname === "youtu.be") {
      const id = parsed.pathname.slice(1).split("/")[0];
      return id.length === 11 ? id : null;
    }

    if (parsed.hostname.replace("www.", "").includes("youtube.com")) {
      const fromQuery = parsed.searchParams.get("v");
      if (fromQuery?.length === 11) return fromQuery;

      const fromPath = parsed.pathname.match(/\/(?:embed|v|shorts)\/([\w-]{11})/);
      if (fromPath) return fromPath[1];
    }
  } catch {
    return null;
  }

  return null;
}

export function isYouTubeUrl(url: string): boolean {
  return getYouTubeVideoId(url) !== null;
}

export function formatYouTubeUploadDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
