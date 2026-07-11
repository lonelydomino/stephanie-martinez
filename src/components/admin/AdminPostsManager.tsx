"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  LogOut,
  Plus,
  Save,
  Trash2,
  Play,
} from "lucide-react";
import Logo from "@/components/Logo";
import {
  POST_CATEGORIES,
  POST_STATUS_OPTIONS,
  type PostStatus,
  type WhatsNewPostSource,
} from "@/lib/whatsNewPosts";
import { isYouTubeUrl } from "@/lib/youtubeUtils";
import { slugify } from "@/lib/whatsNewPosts";

type Props = {
  initialPosts: WhatsNewPostSource[];
};

type YouTubePreview = {
  title: string;
  when: string;
  image: string;
  imageAlt: string;
};

function emptyPost(): WhatsNewPostSource {
  return {
    slug: "",
    excerpt: "",
    category: "Investigation",
    status: "recent",
    href: "",
    title: "",
    when: "",
    image: "",
    imageAlt: "",
  };
}

function statusLabel(status: PostStatus): string {
  return POST_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;
}

export default function AdminPostsManager({ initialPosts }: Props) {
  const router = useRouter();
  const [posts, setPosts] = useState<WhatsNewPostSource[]>(initialPosts);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    initialPosts[0]?.slug ?? null,
  );
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [preview, setPreview] = useState<YouTubePreview | null>(null);

  const selectedIndex = posts.findIndex((post) => post.slug === selectedSlug);
  const selectedPost = selectedIndex >= 0 ? posts[selectedIndex] : null;

  const dirty = useMemo(
    () => JSON.stringify(posts) !== JSON.stringify(initialPosts),
    [posts, initialPosts],
  );

  function updateSelected(patch: Partial<WhatsNewPostSource>) {
    if (selectedIndex < 0) return;
    setPosts((current) =>
      current.map((post, index) =>
        index === selectedIndex ? { ...post, ...patch } : post,
      ),
    );
    setMessage("");
    setError("");
  }

  function addPost() {
    const post = emptyPost();
    setPosts((current) => [post, ...current]);
    setSelectedSlug(post.slug || "__new__");
    setPreview(null);
  }

  function deletePost(index: number) {
    const slug = posts[index]?.slug;
    const next = posts.filter((_, postIndex) => postIndex !== index);
    setPosts(next);
    if (selectedSlug === slug || selectedSlug === "__new__") {
      setSelectedSlug(next[0]?.slug ?? null);
    }
  }

  function movePost(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= posts.length) return;

    const next = [...posts];
    [next[index], next[target]] = [next[target], next[index]];
    setPosts(next);
  }

  async function previewYouTube() {
    if (!selectedPost?.href || !isYouTubeUrl(selectedPost.href)) {
      setError("Paste a YouTube link first.");
      return;
    }

    setPreviewing(true);
    setError("");
    setMessage("");

    const response = await fetch("/api/admin/youtube-preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: selectedPost.href }),
    });

    setPreviewing(false);

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Could not load YouTube preview.");
      return;
    }

    const data = (await response.json()) as YouTubePreview;
    setPreview(data);

    updateSelected({
      title: data.title,
      when: data.when,
      image: data.image,
      imageAlt: data.imageAlt,
      slug: selectedPost.slug || slugify(data.title),
    });
  }

  async function savePosts() {
    setSaving(true);
    setMessage("");
    setError("");

    const normalized = posts.map((post) => ({
      ...post,
      slug: post.slug.trim() || slugify(post.title ?? post.excerpt),
      excerpt: post.excerpt.trim(),
      href: post.href?.trim() || undefined,
      title: post.title?.trim() || undefined,
      when: post.when?.trim() || undefined,
      image: post.image?.trim() || undefined,
      imageAlt: post.imageAlt?.trim() || undefined,
    }));

    const response = await fetch("/api/admin/posts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ posts: normalized }),
    });

    setSaving(false);

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Save failed.");
      return;
    }

    const data = (await response.json()) as { message?: string };
    setMessage(data.message ?? "Saved!");
    router.refresh();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 md:px-8">
      <header className="mb-8 flex flex-col gap-4 border-b border-white/8 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Logo className="h-12 w-12" />
          <div>
            <h1 className="font-display text-2xl font-semibold text-bone">
              What&apos;s New Manager
            </h1>
            <p className="text-sm text-muted">
              Add YouTube links, descriptions, and pick which post is featured.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-bone hover:border-accent-purple/40"
          >
            View site
            <ExternalLink className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-muted hover:text-bone"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={addPost}
          className="inline-flex items-center gap-2 rounded-xl bg-accent-purple px-4 py-2.5 text-sm font-semibold text-bone hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add post
        </button>
        <button
          type="button"
          onClick={savePosts}
          disabled={saving || !dirty}
          className="inline-flex items-center gap-2 rounded-xl bg-accent-orange px-4 py-2.5 text-sm font-semibold text-bone hover:opacity-90 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving…" : "Save changes"}
        </button>
        {dirty && !saving && (
          <span className="text-sm text-gold">You have unsaved changes</span>
        )}
      </div>

      {message && (
        <p className="mb-4 rounded-xl border border-accent-orange/30 bg-accent-orange/10 px-4 py-3 text-sm text-accent-orange">
          {message}
        </p>
      )}
      {error && (
        <p className="mb-4 rounded-xl border border-accent-red/30 bg-accent-red/10 px-4 py-3 text-sm text-bone">
          {error}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-3">
          {posts.map((post, index) => {
            const key = post.slug || `draft-${index}`;
            const active =
              selectedSlug === post.slug ||
              (selectedSlug === "__new__" && !post.slug && index === selectedIndex);

            return (
              <div
                key={key}
                className={`rounded-2xl border p-4 transition-colors ${
                  active
                    ? "border-accent-purple/50 bg-bg-secondary/80"
                    : "border-white/8 bg-bg-secondary/40 hover:border-white/15"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedSlug(post.slug || "__new__")}
                  className="w-full text-left"
                >
                  <p className="font-medium text-bone">
                    {post.title || post.excerpt || "New post"}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {statusLabel(post.status)}
                    {post.when ? ` · ${post.when}` : ""}
                  </p>
                </button>

                <div className="mt-3 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => movePost(index, -1)}
                    disabled={index === 0}
                    className="rounded-lg border border-white/10 p-1.5 text-muted hover:text-bone disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => movePost(index, 1)}
                    disabled={index === posts.length - 1}
                    className="rounded-lg border border-white/10 p-1.5 text-muted hover:text-bone disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePost(index)}
                    className="ml-auto rounded-lg border border-white/10 p-1.5 text-muted hover:text-accent-orange"
                    aria-label="Delete post"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </aside>

        {selectedPost ? (
          <section className="rounded-2xl border border-white/8 bg-bg-secondary/60 p-6">
            <h2 className="font-display text-xl font-semibold text-bone">
              Edit post
            </h2>
            <p className="mt-1 text-sm text-muted">
              For YouTube videos, paste the link and click Preview — title, date,
              and thumbnail fill in automatically.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label className="text-sm font-medium text-bone">
                  YouTube link
                </label>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                  <input
                    value={selectedPost.href ?? ""}
                    onChange={(event) =>
                      updateSelected({ href: event.target.value })
                    }
                    placeholder="https://youtu.be/..."
                    className="w-full flex-1 rounded-xl border border-white/10 bg-bg-primary/80 px-4 py-3 text-sm text-bone outline-none focus:border-accent-purple/60"
                  />
                  <button
                    type="button"
                    onClick={previewYouTube}
                    disabled={previewing}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-bone hover:border-accent-purple/40 disabled:opacity-50"
                  >
                    <Play className="h-4 w-4 text-accent-orange" />
                    {previewing ? "Loading…" : "Preview"}
                  </button>
                </div>
              </div>

              {(preview?.image || selectedPost.image) && (
                <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10">
                  <Image
                    src={preview?.image || selectedPost.image || ""}
                    alt={preview?.title || selectedPost.title || "Preview"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-bone">
                  Short description
                </label>
                <textarea
                  value={selectedPost.excerpt}
                  onChange={(event) =>
                    updateSelected({ excerpt: event.target.value })
                  }
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-bg-primary/80 px-4 py-3 text-sm text-bone outline-none focus:border-accent-purple/60"
                  placeholder="What is this post about?"
                  required
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-bone">
                    Category
                  </label>
                  <select
                    value={selectedPost.category}
                    onChange={(event) =>
                      updateSelected({ category: event.target.value })
                    }
                    className="mt-2 w-full rounded-xl border border-white/10 bg-bg-primary/80 px-4 py-3 text-sm text-bone outline-none focus:border-accent-purple/60"
                  >
                    {POST_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-bone">When</label>
                  <select
                    value={selectedPost.status}
                    onChange={(event) =>
                      updateSelected({
                        status: event.target.value as PostStatus,
                      })
                    }
                    className="mt-2 w-full rounded-xl border border-white/10 bg-bg-primary/80 px-4 py-3 text-sm text-bone outline-none focus:border-accent-purple/60"
                  >
                    {POST_STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <details className="rounded-xl border border-white/8 bg-bg-primary/40 p-4">
                <summary className="cursor-pointer text-sm font-medium text-gold">
                  Optional overrides
                </summary>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="text-sm text-muted">Title</label>
                    <input
                      value={selectedPost.title ?? ""}
                      onChange={(event) =>
                        updateSelected({ title: event.target.value })
                      }
                      className="mt-2 w-full rounded-xl border border-white/10 bg-bg-primary/80 px-4 py-3 text-sm text-bone outline-none focus:border-accent-purple/60"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted">Date label</label>
                    <input
                      value={selectedPost.when ?? ""}
                      onChange={(event) =>
                        updateSelected({ when: event.target.value })
                      }
                      className="mt-2 w-full rounded-xl border border-white/10 bg-bg-primary/80 px-4 py-3 text-sm text-bone outline-none focus:border-accent-purple/60"
                    />
                  </div>
                </div>
              </details>
            </div>
          </section>
        ) : (
          <section className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-muted">
            Select a post or add a new one.
          </section>
        )}
      </div>
    </div>
  );
}
