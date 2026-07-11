"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
} from "lucide-react";
import Logo from "@/components/Logo";
import {
  POST_CATEGORIES,
  POST_SIZE_OPTIONS,
  POST_STATUS_OPTIONS,
  slugify,
  type PostStatus,
  type ResolvedPostPreview,
  type WhatsNewPostSource,
} from "@/lib/whatsNewPosts";

type Props = {
  initialPosts: WhatsNewPostSource[];
  resolvedPreviews: Record<string, ResolvedPostPreview>;
};

function postPreviewImage(
  post: WhatsNewPostSource,
  resolvedPreviews: Record<string, ResolvedPostPreview>,
  livePreview: LinkPreview | null,
): string {
  return (
    post.coverImage?.trim() ||
    post.image?.trim() ||
    (post.slug ? resolvedPreviews[post.slug]?.image : "") ||
    livePreview?.image ||
    ""
  );
}

type LinkPreview = {
  title?: string;
  when?: string;
  image: string;
  imageAlt: string;
};

function emptyPost(): WhatsNewPostSource {
  return {
    slug: "",
    excerpt: "",
    category: "Investigation",
    status: "recent",
    size: "small",
    href: "",
    title: "",
    when: "",
    coverImage: "",
    image: "",
    imageAlt: "",
  };
}

function statusLabel(status: PostStatus): string {
  return POST_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;
}

export default function AdminPostsManager({
  initialPosts,
  resolvedPreviews,
}: Props) {
  const router = useRouter();
  const [posts, setPosts] = useState<WhatsNewPostSource[]>(initialPosts);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    initialPosts[0]?.slug ?? null,
  );
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [preview, setPreview] = useState<LinkPreview | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const previewRequestId = useRef(0);
  const hrefDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedIndex = posts.findIndex((post) => post.slug === selectedSlug);
  const selectedPost = selectedIndex >= 0 ? posts[selectedIndex] : null;

  useEffect(() => {
    previewRequestId.current += 1;
    setPreview(null);
    if (hrefDebounceRef.current) {
      clearTimeout(hrefDebounceRef.current);
      hrefDebounceRef.current = null;
    }
  }, [selectedSlug]);

  useEffect(() => {
    if (!selectedPost) return;

    const existingImage = postPreviewImage(selectedPost, resolvedPreviews, null);
    if (existingImage) return;

    const href = selectedPost.href?.trim();
    if (!href) return;

    void fetchLinkPreview(href);
  }, [selectedSlug]);

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
    selectPost(post.slug || "__new__");
  }

  function deletePost(index: number) {
    const slug = posts[index]?.slug;
    const next = posts.filter((_, postIndex) => postIndex !== index);
    setPosts(next);
    if (selectedSlug === slug || selectedSlug === "__new__") {
      selectPost(next[0]?.slug ?? null);
    }
  }

  function movePost(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= posts.length) return;

    const next = [...posts];
    [next[index], next[target]] = [next[target], next[index]];
    setPosts(next);
  }

  function selectPost(slug: string | null) {
    setSelectedSlug(slug);
    setMessage("");
    setError("");
  }

  async function fetchLinkPreview(href: string) {
    const trimmed = href.trim();
    if (!trimmed) {
      setPreview(null);
      return;
    }

    const requestId = previewRequestId.current + 1;
    previewRequestId.current = requestId;

    setPreviewing(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/link-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });

      if (requestId !== previewRequestId.current) return;

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Could not load link preview.");
        return;
      }

      const data = (await response.json()) as LinkPreview;
      if (requestId !== previewRequestId.current) return;

      setPreview(data);

      if (selectedIndex < 0) return;

      setPosts((current) =>
        current.map((post, index) =>
          index === selectedIndex
            ? {
                ...post,
                title: data.title ?? post.title,
                when: data.when ?? post.when,
                image: data.image,
                imageAlt: data.imageAlt ?? post.imageAlt,
                slug: post.slug || slugify(data.title ?? post.excerpt),
              }
            : post,
        ),
      );
    } finally {
      if (requestId === previewRequestId.current) {
        setPreviewing(false);
      }
    }
  }

  function scheduleLinkPreview(href: string) {
    if (hrefDebounceRef.current) {
      clearTimeout(hrefDebounceRef.current);
    }

    const trimmed = href.trim();
    if (!trimmed) {
      setPreview(null);
      return;
    }

    hrefDebounceRef.current = setTimeout(() => {
      hrefDebounceRef.current = null;
      void fetchLinkPreview(trimmed);
    }, 600);
  }

  function handleHrefChange(href: string) {
    updateSelected({ href });
    setPreview(null);
    scheduleLinkPreview(href);
  }

  async function uploadCover(file: File) {
    if (!selectedPost) return;

    const slug = selectedPost.slug.trim() || slugify(selectedPost.title ?? "post");
    if (!slug) {
      setError("Add a title or slug before uploading a cover.");
      return;
    }

    setUploadingCover(true);
    setError("");
    setMessage("");

    const form = new FormData();
    form.append("file", file);
    form.append("slug", slug);

    const response = await fetch("/api/admin/upload-cover", {
      method: "POST",
      body: form,
    });

    setUploadingCover(false);

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Cover upload failed.");
      return;
    }

    const data = (await response.json()) as { path: string };
    updateSelected({ coverImage: data.path, slug });
    setMessage("Cover uploaded. Click Save changes to publish it.");
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
      coverImage: post.coverImage?.trim() || undefined,
      image: post.image?.trim() || undefined,
      imageAlt: post.imageAlt?.trim() || undefined,
      size: post.size ?? "small",
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

  const selectedDisplayImage = selectedPost
    ? postPreviewImage(selectedPost, resolvedPreviews, preview)
    : "";

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
              Paste a link to preview scraped info, upload a custom cover, or
              pick large vs small card size.
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
                className={`relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 ${
                  active
                    ? "border-accent-orange/80 bg-accent-purple/25 shadow-[0_0_0_1px_color-mix(in_srgb,var(--accent-orange)_35%,transparent),0_0_24px_color-mix(in_srgb,var(--accent-orange)_18%,transparent)]"
                    : "border-white/8 bg-bg-secondary/40 hover:border-white/20 hover:bg-bg-secondary/55"
                }`}
              >
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-accent-orange shadow-[0_0_12px_color-mix(in_srgb,var(--accent-orange)_70%,transparent)]"
                  />
                )}
                <button
                  type="button"
                  onClick={() => selectPost(post.slug || "__new__")}
                  className={`w-full text-left ${active ? "pl-3" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={`font-medium ${
                        active ? "text-bone" : "text-bone/90"
                      }`}
                    >
                      {post.title || post.excerpt || "New post"}
                    </p>
                    {active && (
                      <span className="shrink-0 rounded-full border border-accent-orange/50 bg-accent-orange/15 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-accent-orange">
                        Editing
                      </span>
                    )}
                  </div>
                  <p
                    className={`mt-1 text-xs ${
                      active ? "text-bone/75" : "text-muted"
                    }`}
                  >
                    {statusLabel(post.status)}
                    {post.size === "large" ? " · Large" : " · Small"}
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
              Saved covers and linked posts show their preview right away.
              Paste a new YouTube or Instagram link to update title, date, and
              thumbnail automatically.
            </p>

            <div className="mt-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-bone">
                    Card size
                  </label>
                  <select
                    value={selectedPost.size ?? "small"}
                    onChange={(event) =>
                      updateSelected({
                        size: event.target.value as WhatsNewPostSource["size"],
                      })
                    }
                    className="mt-2 w-full rounded-xl border border-white/10 bg-bg-primary/80 px-4 py-3 text-sm text-bone outline-none focus:border-accent-purple/60"
                  >
                    {POST_SIZE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-bone">Status</label>
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

              <div>
                <label className="text-sm font-medium text-bone">
                  YouTube or Instagram link
                </label>
                <input
                  value={selectedPost.href ?? ""}
                  onChange={(event) => handleHrefChange(event.target.value)}
                  placeholder="https://youtu.be/... or https://instagram.com/..."
                  className="mt-2 w-full rounded-xl border border-white/10 bg-bg-primary/80 px-4 py-3 text-sm text-bone outline-none focus:border-accent-purple/60"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-bone">
                  Cover image
                </label>
                <p className="mt-1 text-xs text-muted">
                  Upload a custom cover, or leave empty to use the scraped
                  thumbnail from the link.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-bone hover:border-accent-purple/40">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) void uploadCover(file);
                        event.target.value = "";
                      }}
                    />
                    {uploadingCover ? "Uploading…" : "Upload cover"}
                  </label>
                  {selectedPost.coverImage && (
                    <button
                      type="button"
                      onClick={() => updateSelected({ coverImage: "" })}
                      className="text-sm text-muted hover:text-accent-orange"
                    >
                      Use scraped image instead
                    </button>
                  )}
                </div>
                {selectedPost.coverImage && (
                  <p className="mt-2 text-xs text-gold">
                    Custom cover: {selectedPost.coverImage}
                  </p>
                )}
              </div>

              {selectedDisplayImage && (
                <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-white/10 md:aspect-[21/9]">
                  <Image
                    key={`${selectedSlug}-${selectedDisplayImage}`}
                    src={selectedDisplayImage}
                    alt={selectedPost.title || "Cover preview"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                  {previewing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-bg-primary/60 text-sm text-bone">
                      Loading preview…
                    </div>
                  )}
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
