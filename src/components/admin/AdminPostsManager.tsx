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
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import Logo from "@/components/Logo";
import { FieldHelp, FieldLabel } from "@/components/admin/FieldHelp";
import {
  clearPendingDeploy,
  loadPendingDeploy,
  savePendingDeploy,
} from "@/lib/adminPendingDeploy";
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

function normalizePost(post: WhatsNewPostSource): WhatsNewPostSource {
  return {
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
  };
}

function postsSnapshot(posts: WhatsNewPostSource[]): string {
  return JSON.stringify(posts.map(normalizePost));
}

function findSavedIndex(
  post: WhatsNewPostSource,
  savedPosts: WhatsNewPostSource[],
): number {
  const slug = post.slug?.trim();
  if (!slug) return -1;
  return savedPosts.findIndex((saved) => saved.slug === slug);
}

function isPostDirty(
  post: WhatsNewPostSource,
  savedPosts: WhatsNewPostSource[],
): boolean {
  if (!post.slug?.trim()) {
    return Boolean(
      post.excerpt.trim() ||
        post.href?.trim() ||
        post.title?.trim() ||
        post.coverImage?.trim() ||
        post.image?.trim(),
    );
  }

  const savedIndex = findSavedIndex(post, savedPosts);
  if (savedIndex < 0) return true;

  return (
    JSON.stringify(normalizePost(post)) !==
    JSON.stringify(normalizePost(savedPosts[savedIndex]))
  );
}

type PendingNavigation = {
  slug: string | null;
};

function isNewDraft(
  post: WhatsNewPostSource,
  savedPosts: WhatsNewPostSource[],
): boolean {
  return findSavedIndex(post, savedPosts) < 0;
}

function getDeployingSlugs(
  pending: WhatsNewPostSource[],
  server: WhatsNewPostSource[],
): Set<string> {
  const serverSlugs = new Set(server.map((post) => post.slug));
  return new Set(
    pending.filter((post) => post.slug && !serverSlugs.has(post.slug)).map(
      (post) => post.slug!,
    ),
  );
}

function hydrateAdminState(serverPosts: WhatsNewPostSource[]) {
  const pending = loadPendingDeploy();
  if (!pending) {
    return {
      posts: serverPosts,
      savedPosts: serverPosts,
      deployingSlugs: new Set<string>(),
    };
  }

  if (postsSnapshot(pending.posts) === postsSnapshot(serverPosts)) {
    clearPendingDeploy();
    return {
      posts: serverPosts,
      savedPosts: serverPosts,
      deployingSlugs: new Set<string>(),
    };
  }

  return {
    posts: pending.posts,
    savedPosts: pending.posts,
    deployingSlugs: getDeployingSlugs(pending.posts, serverPosts),
  };
}

export default function AdminPostsManager({
  initialPosts,
  resolvedPreviews,
}: Props) {
  const router = useRouter();
  const hydrated = useMemo(() => hydrateAdminState(initialPosts), []);
  const [posts, setPosts] = useState<WhatsNewPostSource[]>(hydrated.posts);
  const [savedPosts, setSavedPosts] = useState<WhatsNewPostSource[]>(
    hydrated.savedPosts,
  );
  const [deployingSlugs, setDeployingSlugs] = useState<Set<string>>(
    hydrated.deployingSlugs,
  );
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [preview, setPreview] = useState<LinkPreview | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [pendingNavigation, setPendingNavigation] =
    useState<PendingNavigation | null>(null);
  const previewRequestId = useRef(0);
  const hrefDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedIndex = useMemo(() => {
    if (!selectedSlug) return -1;
    if (selectedSlug === "__new__") {
      return posts.findIndex((post) => !post.slug?.trim());
    }
    return posts.findIndex((post) => post.slug === selectedSlug);
  }, [posts, selectedSlug]);
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

  const hasUnsavedChanges = useMemo(
    () => postsSnapshot(posts) !== postsSnapshot(savedPosts),
    [posts, savedPosts],
  );

  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    const pending = loadPendingDeploy();
    if (!pending) return;

    if (postsSnapshot(pending.posts) === postsSnapshot(initialPosts)) {
      clearPendingDeploy();
      setDeployingSlugs(new Set());
      if (!hasUnsavedChanges) {
        setPosts(initialPosts);
        setSavedPosts(initialPosts);
      }
      return;
    }

    setDeployingSlugs(getDeployingSlugs(pending.posts, initialPosts));

    if (!hasUnsavedChanges) {
      setPosts(pending.posts);
      setSavedPosts(pending.posts);
    }
  }, [initialPosts, hasUnsavedChanges]);

  useEffect(() => {
    if (deployingSlugs.size === 0) return;

    const interval = window.setInterval(() => {
      router.refresh();
    }, 15000);

    return () => window.clearInterval(interval);
  }, [deployingSlugs, router]);

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
    if (hasUnsavedChanges) {
      setPendingNavigation({ slug: "__new__" });
      return;
    }

    const post = emptyPost();
    setPosts((current) => [post, ...current]);
    selectPost("__new__");
  }

  function deletePost(index: number) {
    const slug = posts[index]?.slug;
    const next = posts.filter((_, postIndex) => postIndex !== index);
    setPosts(next);
    if (selectedSlug === slug || selectedSlug === "__new__") {
      requestSelectPost(next[0]?.slug ?? null, { skipUnsavedCheck: true });
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

  function requestSelectPost(
    slug: string | null,
    options?: { skipUnsavedCheck?: boolean },
  ) {
    if (slug === selectedSlug) return;

    if (!options?.skipUnsavedCheck && hasUnsavedChanges) {
      setPendingNavigation({ slug });
      return;
    }

    selectPost(slug);
  }

  function discardUnsavedChanges() {
    setPosts(savedPosts.map((post) => ({ ...post })));
    setMessage("");
    setError("");
  }

  function handleLeaveWithoutSaving() {
    if (!pendingNavigation) return;

    const nextSlug = pendingNavigation.slug;
    discardUnsavedChanges();
    setPendingNavigation(null);
    selectPost(nextSlug);
  }

  async function savePosts(): Promise<boolean> {
    setSaving(true);
    setMessage("");
    setError("");

    const normalized = posts.map(normalizePost);

    for (const post of normalized) {
      if (!post.slug || !post.excerpt || !post.category) {
        setSaving(false);
        setError("Each post needs a description and category before saving.");
        return false;
      }
    }

    const response = await fetch("/api/admin/posts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ posts: normalized }),
    });

    setSaving(false);

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Save failed.");
      return false;
    }

    const data = (await response.json()) as {
      message?: string;
      mode?: "local" | "github";
    };
    setSavedPosts(normalized);
    setPosts(normalized);
    setMessage(data.message ?? "Saved!");

    if (data.mode === "github") {
      savePendingDeploy(normalized);
      setDeployingSlugs(getDeployingSlugs(normalized, initialPosts));
    } else {
      clearPendingDeploy();
      setDeployingSlugs(new Set());
    }

    router.refresh();
    return true;
  }

  async function handleSaveAndLeave() {
    if (!pendingNavigation) return;

    const nextSlug = pendingNavigation.slug;
    const saved = await savePosts();
    if (!saved) return;

    setPendingNavigation(null);

    if (nextSlug === "__new__") {
      const post = emptyPost();
      setPosts((current) => [post, ...current]);
      selectPost("__new__");
      return;
    }

    selectPost(nextSlug);
  }

  async function saveCurrentPost() {
    await savePosts();
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

      const draftIndex =
        selectedSlug === "__new__"
          ? posts.findIndex((post) => !post.slug?.trim())
          : posts.findIndex((post) => post.slug === selectedSlug);

      if (draftIndex < 0) return;

      const currentPost = posts[draftIndex];
      const newSlug =
        currentPost.slug ||
        slugify(data.title ?? currentPost.excerpt) ||
        `draft-${Date.now()}`;

      setPosts((current) =>
        current.map((post, index) =>
          index === draftIndex
            ? {
                ...post,
                title: data.title ?? post.title,
                when: data.when ?? post.when,
                image: data.image,
                imageAlt: data.imageAlt ?? post.imageAlt,
                slug: newSlug,
              }
            : post,
        ),
      );

      if (selectedSlug === "__new__") {
        setSelectedSlug(newSlug);
      }
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
    setMessage(
      isNewDraft(selectedPost, savedPosts)
        ? "Cover uploaded. Click Create post to publish it."
        : "Cover uploaded. Click Save post to publish it.",
    );
  }

  const selectedDisplayImage = selectedPost
    ? postPreviewImage(selectedPost, resolvedPreviews, preview)
    : "";
  const isCreating =
    selectedPost != null && isNewDraft(selectedPost, savedPosts);

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
        <FieldHelp text="Start a new blog card for the What's New section. Pick it from the list on the left to fill in the link, description, and image." />
      </div>

      {deployingSlugs.size > 0 && (
        <p className="mb-4 rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-sm text-sky-200">
          Waiting for Vercel to redeploy — new or updated posts show a blue
          &ldquo;Deploying…&rdquo; badge until the live admin list catches up.
        </p>
      )}

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
            const postDirty = isPostDirty(post, savedPosts);
            const isDeploying = Boolean(post.slug && deployingSlugs.has(post.slug));
            const postIsNew = isNewDraft(post, savedPosts);

            return (
              <div
                key={key}
                className={`relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 ${
                  isDeploying
                    ? "border-sky-500/60 bg-sky-950/35 shadow-[0_0_0_1px_color-mix(in_srgb,#3b82f6_30%,transparent),0_0_20px_color-mix(in_srgb,#3b82f6_12%,transparent)]"
                    : active
                      ? "border-accent-orange/80 bg-accent-purple/25 shadow-[0_0_0_1px_color-mix(in_srgb,var(--accent-orange)_35%,transparent),0_0_24px_color-mix(in_srgb,var(--accent-orange)_18%,transparent)]"
                      : "border-white/8 bg-bg-secondary/40 hover:border-white/20 hover:bg-bg-secondary/55"
                }`}
              >
                {isDeploying && (
                  <span
                    aria-hidden
                    className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-sky-400 shadow-[0_0_12px_color-mix(in_srgb,#38bdf8_70%,transparent)]"
                  />
                )}
                {active && !isDeploying && (
                  <span
                    aria-hidden
                    className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-accent-orange shadow-[0_0_12px_color-mix(in_srgb,var(--accent-orange)_70%,transparent)]"
                  />
                )}
                <button
                  type="button"
                  onClick={() => requestSelectPost(post.slug || "__new__")}
                  className={`w-full text-left ${active || isDeploying ? "pl-3" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={`font-medium ${
                        active || isDeploying ? "text-bone" : "text-bone/90"
                      }`}
                    >
                      {post.title || post.excerpt || "New post"}
                    </p>
                    <div className="flex shrink-0 items-center gap-1.5">
                      {isDeploying && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-sky-400/50 bg-sky-500/15 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-sky-200">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Deploying…
                        </span>
                      )}
                      {postDirty && !active && !isDeploying && (
                        <span
                          className="h-2 w-2 rounded-full bg-accent-orange shadow-[0_0_8px_color-mix(in_srgb,var(--accent-orange)_60%,transparent)]"
                          title="Unsaved edits on this post"
                        />
                      )}
                      {active && !isDeploying && (
                        <span className="rounded-full border border-accent-orange/50 bg-accent-orange/15 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-accent-orange">
                          {postIsNew ? "Creating" : "Editing"}
                        </span>
                      )}
                    </div>
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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold text-bone">
                  {isCreating ? "Create new post" : "Edit post"}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {isCreating
                    ? "Paste a YouTube or Instagram link to pull in the title, date, and thumbnail. Add a short description, then create the post when you are ready."
                    : "Saved covers and linked posts show their preview right away. Paste a new YouTube or Instagram link to update title, date, and thumbnail automatically."}
                </p>
              </div>
              <div className="flex flex-col items-stretch gap-2 sm:items-end">
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={saveCurrentPost}
                    disabled={saving || !hasUnsavedChanges}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-accent-orange px-4 py-2.5 text-sm font-semibold text-bone hover:opacity-90 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {saving
                      ? isCreating
                        ? "Creating…"
                        : "Saving…"
                      : isCreating
                        ? "Create post"
                        : "Save post"}
                  </button>
                  <FieldHelp
                    text={
                      isCreating
                        ? "Creates this new post on the website. After saving, allow 1–2 minutes for the live site to update."
                        : "Saves your changes to this post. After saving, allow 1–2 minutes for the live site to update."
                    }
                  />
                </div>
              </div>
            </div>

            {hasUnsavedChanges && !saving && (
              <p className="rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-gold">
                {isCreating
                  ? "This new post has unsaved changes."
                  : "This post has unsaved changes."}
              </p>
            )}

            <div className="mt-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <FieldLabel
                    htmlFor="post-card-size"
                    label="Card size"
                    help="Controls how wide this card looks on the website. Large makes a wide card. Small makes a regular-sized card in the grid next to your other posts."
                  />
                  <select
                    id="post-card-size"
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
                  <FieldLabel
                    htmlFor="post-status"
                    label="Status"
                    help="Right Now = something happening now. Just Went = an event you already went to. Coming Up = something on the calendar soon. This shows as a small colored tag on the card."
                  />
                  <select
                    id="post-status"
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
                <FieldLabel
                  htmlFor="post-link"
                  label="YouTube or Instagram link"
                  help="Paste the full web address from YouTube or Instagram. The site will automatically fill in the title, date, and thumbnail image."
                />
                <input
                  id="post-link"
                  value={selectedPost.href ?? ""}
                  onChange={(event) => handleHrefChange(event.target.value)}
                  placeholder="https://youtu.be/... or https://instagram.com/..."
                  className="mt-2 w-full rounded-xl border border-white/10 bg-bg-primary/80 px-4 py-3 text-sm text-bone outline-none focus:border-accent-purple/60"
                />
              </div>

              <div>
                <FieldLabel
                  label="Cover image (optional)"
                  help="Upload your own picture if you do not want the automatic thumbnail from the link. This is optional — you can leave it blank."
                />
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
                <FieldLabel
                  htmlFor="post-excerpt"
                  label="Short description"
                  help="Write a few sentences about this post. Visitors see this text on the website. You need a description before you can save."
                />
                <textarea
                  id="post-excerpt"
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
                  <FieldLabel
                    htmlFor="post-category"
                    label="Category"
                    help="Choose the type that fits best, like Investigation or Convention. This appears as a small label on the card."
                  />
                  <select
                    id="post-category"
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
                <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-gold [&::-webkit-details-marker]:hidden">
                  <span>Optional overrides</span>
                  <FieldHelp text="Only use these if you want to change the title or date text from what was pulled in automatically. Most people can leave these alone." />
                </summary>
                <div className="mt-4 space-y-4">
                  <div>
                    <FieldLabel
                      htmlFor="post-title-override"
                      label="Title"
                      help="Change the headline shown on the website. Leave blank to keep the title from YouTube or Instagram."
                      muted
                    />
                    <input
                      id="post-title-override"
                      value={selectedPost.title ?? ""}
                      onChange={(event) =>
                        updateSelected({ title: event.target.value })
                      }
                      className="mt-2 w-full rounded-xl border border-white/10 bg-bg-primary/80 px-4 py-3 text-sm text-bone outline-none focus:border-accent-purple/60"
                    />
                  </div>
                  <div>
                    <FieldLabel
                      htmlFor="post-date-override"
                      label="Date label"
                      help="The date text shown on the card, like 'July 2026'. Edit this only if you want different wording."
                      muted
                    />
                    <input
                      id="post-date-override"
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
            Select a post to edit it here.
          </section>
        )}
      </div>

      {pendingNavigation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/80 px-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="unsaved-dialog-title"
            className="w-full max-w-md rounded-2xl border border-white/10 bg-bg-secondary p-6 shadow-[0_0_40px_color-mix(in_srgb,var(--accent-purple)_35%,transparent)]"
          >
            <h3
              id="unsaved-dialog-title"
              className="font-display text-xl font-semibold text-bone"
            >
              Unsaved changes
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {isCreating
                ? "This new post has changes that haven\u2019t been saved yet. Create it before switching, or leave without saving and discard the draft."
                : "This post has changes that haven\u2019t been saved yet. Save before switching, or leave without saving and discard those changes."}
            </p>
            <div className="mt-6 space-y-3 border-t border-white/8 pt-5">
              <button
                type="button"
                onClick={handleSaveAndLeave}
                disabled={saving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent-orange px-4 py-3 text-sm font-semibold text-bone hover:opacity-90 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving
                  ? isCreating
                    ? "Creating…"
                    : "Saving…"
                  : isCreating
                    ? "Create and leave"
                    : "Save and leave"}
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPendingNavigation(null)}
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-bg-primary/50 px-4 py-3 text-sm font-medium text-bone hover:border-accent-purple/40 disabled:opacity-50"
                >
                  Keep editing
                </button>
                <button
                  type="button"
                  onClick={handleLeaveWithoutSaving}
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-xl border border-accent-red/25 bg-accent-red/10 px-4 py-3 text-sm font-medium text-bone hover:border-accent-red/45 hover:bg-accent-red/15 disabled:opacity-50"
                >
                  Discard changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
