import { put } from "@vercel/blob";
import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { slugify } from "@/lib/whatsNewPosts";

const MAX_BYTES = 8 * 1024 * 1024;

function coverExtension(file: File): "png" | "webp" | "jpg" {
  if (file.type.includes("png")) return "png";
  if (file.type.includes("webp")) return "webp";
  return "jpg";
}

async function uploadCoverLocal(
  repoPath: string,
  buffer: Buffer,
): Promise<string> {
  const fullPath = path.join(process.cwd(), repoPath);
  await writeFile(fullPath, buffer);
  return `/${repoPath.replace(/^public\//, "")}`;
}

async function uploadCoverBlob(
  pathname: string,
  buffer: Buffer,
  contentType: string,
): Promise<string> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not configured. Create a Blob store in Vercel and connect it to this project.",
    );
  }

  const blob = await put(pathname, buffer, {
    access: "public",
    token,
    contentType,
    addRandomSuffix: false,
    allowOverwrite: true,
  });

  return blob.url;
}

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

  const extension = coverExtension(file);
  const safeSlug = slugify(slug);
  const repoPath = `public/blog/${safeSlug}-cover.${extension}`;
  const blobPath = `blog/${safeSlug}-cover.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const pathOrUrl =
      process.env.NODE_ENV === "development"
        ? await uploadCoverLocal(repoPath, buffer)
        : await uploadCoverBlob(blobPath, buffer, file.type);

    return NextResponse.json({ path: pathOrUrl });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not upload cover image.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
