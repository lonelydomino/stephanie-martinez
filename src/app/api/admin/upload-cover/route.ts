import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { writeRepoFile } from "@/lib/postsStore";
import { slugify } from "@/lib/whatsNewPosts";

const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const slug = String(form.get("slug") ?? "").trim();

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose an image file." }, { status: 400 });
  }

  if (!slug) {
    return NextResponse.json(
      { error: "Save a slug for this post first." },
      { status: 400 },
    );
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Cover must be an image file." },
      { status: 400 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image must be 8 MB or smaller." },
      { status: 400 },
    );
  }

  const extension = file.type.includes("png")
    ? "png"
    : file.type.includes("webp")
      ? "webp"
      : "jpg";
  const repoPath = `public/blog/${slugify(slug)}-cover.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    await writeRepoFile(
      repoPath,
      buffer,
      `Upload blog cover for ${slug}`,
    );
    return NextResponse.json({
      path: `/blog/${slugify(slug)}-cover.${extension}`,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not upload cover image.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
