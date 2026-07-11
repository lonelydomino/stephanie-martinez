"use client";

import { Fragment, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Calendar } from "lucide-react";
import Image from "next/image";
import type { BlogPost, PostStatus } from "@/lib/whatsNewPosts";
import { isYouTubeUrl } from "@/lib/youtubeUtils";
import Section from "./ui/Section";

const statusLabels: Record<PostStatus, string> = {
  current: "Right Now",
  upcoming: "Coming Up",
  recent: "Just Went",
};

const statusStyles: Record<PostStatus, string> = {
  current:
    "border-accent-orange/50 bg-accent-orange/10 text-accent-orange",
  upcoming:
    "border-accent-purple/40 bg-accent-purple/10 text-gold",
  recent: "border-white/10 bg-bg-primary/60 text-muted",
};

function PostMeta({ when }: { when: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted md:text-sm">
      <Calendar className="h-3.5 w-3.5 shrink-0 text-accent-orange" />
      {when}
    </span>
  );
}

function StatusBadge({ status }: { status: PostStatus }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}

type CardProps = {
  post: BlogPost;
  index: number;
  reduce: boolean | null;
  large?: boolean;
  wide?: boolean;
};

function BlogCard({ post, index, reduce, large = false, wide = false }: CardProps) {
  const externalLink = post.href && post.href !== "#social";
  const isHero = large || wide;

  return (
    <motion.article
      initial={reduce === false ? { y: isHero ? 24 : 20 } : false}
      whileInView={reduce === false ? { y: 0 } : undefined}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: isHero ? 0 : index * 0.08, duration: 0.55 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-bg-secondary/75 backdrop-blur-sm transition-colors duration-400 hover:border-accent-purple/30"
    >
      <div
        className={`relative overflow-hidden ${
          isHero ? "aspect-[16/9] md:aspect-[21/9]" : "aspect-[16/9]"
        }`}
      >
        <Image
          src={post.image}
          alt={post.imageAlt}
          fill
          sizes={
            isHero
              ? "(max-width: 1024px) 100vw, 66vw"
              : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          }
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/20 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <StatusBadge status={post.status} />
          <span className="rounded-full border border-white/10 bg-bg-primary/70 px-2.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-widest text-bone/80 backdrop-blur-sm">
            {post.category}
          </span>
        </div>
      </div>

      <div
        className={`flex flex-1 flex-col ${
          large ? "p-6 md:p-8" : wide ? "p-6" : "p-5"
        }`}
      >
        <h3
          className={`font-display font-semibold text-bone ${
            large
              ? "text-2xl md:text-3xl"
              : wide
                ? "text-xl md:text-2xl"
                : "text-lg md:text-xl"
          }`}
        >
          {post.title}
        </h3>
        <p
          className={`mt-3 flex-1 leading-relaxed text-muted ${
            large || wide ? "text-sm md:text-base" : "text-sm line-clamp-3"
          }`}
        >
          {post.excerpt}
        </p>
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <PostMeta when={post.when} />
          <a
            href={post.href ?? "#social"}
            {...(externalLink
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold transition-colors hover:text-accent-orange"
          >
            {post.href && isYouTubeUrl(post.href)
              ? "Watch on YouTube"
              : post.href?.includes("instagram.com")
                ? "View on Instagram"
                : "View recap"}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

type WhatsNewProps = {
  posts: BlogPost[];
};

function smallGridClass(count: number): string {
  if (count === 1) return "";
  if (count === 2) return "grid gap-6 sm:grid-cols-2";
  return "grid gap-6 sm:grid-cols-2 lg:grid-cols-3";
}

/** Split small posts so no row ends with a lone card in a 3-column grid. */
function chunkSmallPosts(posts: BlogPost[]): BlogPost[][] {
  const chunks: BlogPost[][] = [];
  let i = 0;

  while (i < posts.length) {
    const remaining = posts.length - i;

    if (remaining === 1) {
      chunks.push([posts[i++]]);
    } else if (remaining === 4) {
      chunks.push(posts.slice(i, i + 2), posts.slice(i + 2, i + 4));
      i += 4;
    } else if (remaining === 2) {
      chunks.push(posts.slice(i, i + 2));
      i += 2;
    } else if (remaining === 5) {
      chunks.push(posts.slice(i, i + 3), posts.slice(i + 3, i + 5));
      i += 5;
    } else if (remaining % 3 === 1) {
      chunks.push(posts.slice(i, i + 2));
      i += 2;
    } else {
      chunks.push(posts.slice(i, i + 3));
      i += 3;
    }
  }

  return chunks;
}

function renderOrderedPosts(
  posts: BlogPost[],
  reduce: boolean | null,
) {
  const blocks: ReactNode[] = [];
  let smallBatch: BlogPost[] = [];
  let smallIndex = 0;

  const flushSmall = () => {
    if (smallBatch.length === 0) return;

    chunkSmallPosts(smallBatch).forEach((chunk, chunkIndex) => {
      if (chunk.length === 1) {
        const post = chunk[0];
        blocks.push(
          <BlogCard
            key={post.slug}
            post={post}
            index={smallIndex}
            reduce={reduce}
            wide
          />,
        );
        smallIndex += 1;
      } else {
        blocks.push(
          <div
            key={`grid-${chunk[0]?.slug}-${blocks.length}-${chunkIndex}`}
            className={smallGridClass(chunk.length)}
          >
            {chunk.map((post) => {
              const card = (
                <BlogCard
                  key={post.slug}
                  post={post}
                  index={smallIndex}
                  reduce={reduce}
                />
              );
              smallIndex += 1;
              return card;
            })}
          </div>,
        );
      }
    });

    smallBatch = [];
  };

  posts.forEach((post, index) => {
    if (post.size === "large") {
      flushSmall();
      blocks.push(
        <div key={post.slug} className={index < posts.length - 1 ? "mb-8" : ""}>
          <BlogCard post={post} index={index} reduce={reduce} large />
        </div>,
      );
    } else {
      smallBatch.push(post);
    }
  });

  flushSmall();

  return blocks.map((block, index) => (
    <Fragment key={`block-${index}`}>
      {block}
      {index < blocks.length - 1 ? <div className="mb-8" /> : null}
    </Fragment>
  ));
}

export default function WhatsNew({ posts }: WhatsNewProps) {
  const reduce = useReducedMotion();

  return (
    <Section
      id="whats-new"
      title="What's New"
      subtitle="A peek at recent adventures, current projects, and what's haunting the calendar next."
      className="bg-gradient-to-b from-transparent via-accent-red/5 to-transparent"
    >
      {renderOrderedPosts(posts, reduce)}
    </Section>
  );
}
