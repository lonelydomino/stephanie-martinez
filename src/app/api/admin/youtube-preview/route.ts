import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { fetchYouTubeMetadata, formatYouTubeDate } from "@/lib/youtube";
import { isYouTubeUrl } from "@/lib/youtubeUtils";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { url?: string };
  const url = body.url?.trim();

  if (!url || !isYouTubeUrl(url)) {
    return NextResponse.json(
      { error: "Paste a valid YouTube link." },
      { status: 400 },
    );
  }

  try {
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
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not preview YouTube video.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
