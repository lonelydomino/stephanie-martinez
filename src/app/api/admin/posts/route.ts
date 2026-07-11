import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { readPostSources, writePostSources } from "@/lib/postsStore";
import type { WhatsNewPostSource } from "@/lib/whatsNewPosts";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await readPostSources();
  return NextResponse.json({ posts });
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { posts?: WhatsNewPostSource[] };
  const posts = body.posts;

  if (!Array.isArray(posts) || posts.length === 0) {
    return NextResponse.json(
      { error: "Posts must be a non-empty array." },
      { status: 400 },
    );
  }

  for (const post of posts) {
    if (!post.slug?.trim() || !post.excerpt?.trim() || !post.category) {
      return NextResponse.json(
        { error: "Each post needs a slug, description, and category." },
        { status: 400 },
      );
    }
  }

  try {
    const mode = await writePostSources(posts);
    revalidatePath("/");

    return NextResponse.json({
      ok: true,
      mode,
      message:
        mode === "github"
          ? "Saved! Your site will update in about 1–2 minutes after Vercel redeploys."
          : "Saved locally.",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not save posts.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
