"use client";

import { Fragment, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Calendar } from "lucide-react";
import Image from "next/image";
import type { BlogPost, PostStatus } from "@/lib/whatsNewPosts";
import { getLinkPlatformLabel } from "@/lib/linkPlatforms";
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
            {post.href ? getLinkPlatformLabel(post.href) : "View recap"}
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
  // 2 or 4 cards: balanced rows without a lone orphan in a 3-column grid
  if (count === 2 || count === 4) return "grid gap-6 sm:grid-cols-2";
  return "grid gap-6 sm:grid-cols-2 lg:grid-cols-3";
}

function renderSmallBatch(
  batch: BlogPost[],
  blocks: ReactNode[],
  reduce: boolean | null,
  smallIndex: { current: number },
) {
  const count = batch.length;
  if (count === 0) return;

  if (count === 1) {
    const post = batch[0];
    blocks.push(
      <BlogCard
        key={post.slug}
        post={post}
        index={smallIndex.current}
        reduce={reduce}
        wide
      />,
    );
    smallIndex.current += 1;
    return;
  }

  // 7, 10, … in a 3-col grid would leave one orphan — pull it into a wide card
  const needsWideOrphan = count > 4 && count % 3 === 1;
  const gridPosts = needsWideOrphan ? batch.slice(0, -1) : batch;
  const orphan = needsWideOrphan ? batch[batch.length - 1] : null;

  blocks.push(
    <div
      key={`grid-${gridPosts[0]?.slug}-${blocks.length}`}
      className={smallGridClass(gridPosts.length)}
    >
      {gridPosts.map((post) => {
        const card = (
          <BlogCard
            key={post.slug}
            post={post}
            index={smallIndex.current}
            reduce={reduce}
          />
        );
        smallIndex.current += 1;
        return card;
      })}
    </div>,
  );

  if (orphan) {
    blocks.push(
      <BlogCard
        key={orphan.slug}
        post={orphan}
        index={smallIndex.current}
        reduce={reduce}
        wide
      />,
    );
    smallIndex.current += 1;
  }
}

function renderOrderedPosts(
  posts: BlogPost[],
  reduce: boolean | null,
) {
  const blocks: ReactNode[] = [];
  let smallBatch: BlogPost[] = [];
  const smallIndex = { current: 0 };

  const flushSmall = () => {
    renderSmallBatch(smallBatch, blocks, reduce, smallIndex);
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
