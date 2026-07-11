import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { fetchInstagramThumbnail, isInstagramUrl } from "@/lib/instagram";
import { fetchYouTubeMetadata, formatYouTubeDate } from "@/lib/youtube";
import { isYouTubeUrl } from "@/lib/youtubeUtils";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { url?: string };
  const url = body.url?.trim();

  if (!url) {
    return NextResponse.json({ error: "Paste a link first." }, { status: 400 });
  }

  try {
    if (isYouTubeUrl(url)) {
      const metadata = await fetchYouTubeMetadata(url);
      if (!metadata) {
        return NextResponse.json(
          { error: "Could not load that YouTube video." },
          { status: 404 },
        );
      }

      return NextResponse.json({
        title: metadata.title,
        when: formatYouTubeDate(metadata.uploadDate),
        image: metadata.thumbnailUrl,
        imageAlt: metadata.title,
      });
    }

    if (isInstagramUrl(url)) {
      const image = await fetchInstagramThumbnail(url);
      if (!image) {
        return NextResponse.json(
          { error: "Could not load that Instagram post." },
          { status: 404 },
        );
      }

      return NextResponse.json({
        image,
        imageAlt: "Instagram post",
      });
    }

    return NextResponse.json(
      { error: "Only YouTube and Instagram links can be previewed." },
      { status: 400 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not preview link.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
