"use client";

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
  featured?: boolean;
};

function BlogCard({ post, index, reduce, featured = false }: CardProps) {
  const externalLink = post.href && post.href !== "#social";

  return (
    <motion.article
      initial={reduce === false ? { y: featured ? 24 : 20 } : false}
      whileInView={reduce === false ? { y: 0 } : undefined}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: featured ? 0 : index * 0.08, duration: 0.55 }}
      className={`group flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-bg-secondary/75 backdrop-blur-sm transition-colors duration-400 hover:border-accent-purple/30 ${
        featured ? "lg:col-span-2" : ""
      }`}
    >
      <div
        className={`relative overflow-hidden ${
          featured ? "aspect-[16/9] md:aspect-[21/9]" : "aspect-[4/3]"
        }`}
      >
        <Image
          src={post.image}
          alt={post.imageAlt}
          fill
          sizes={
            featured
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

      <div className={`flex flex-1 flex-col ${featured ? "p-6 md:p-8" : "p-5"}`}>
        <h3
          className={`font-display font-semibold text-bone ${
            featured ? "text-2xl md:text-3xl" : "text-lg md:text-xl"
          }`}
        >
          {post.title}
        </h3>
        <p
          className={`mt-3 flex-1 leading-relaxed text-muted ${
            featured ? "text-sm md:text-base" : "text-sm line-clamp-3"
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

export default function WhatsNew({ posts }: WhatsNewProps) {
  const reduce = useReducedMotion();
  const featured = posts.find((post) => post.status === "current");
  const rest = posts.filter((post) => post.status !== "current");

  return (
    <Section
      id="whats-new"
      title="What's New"
      subtitle="A peek at recent adventures, current projects, and what's haunting the calendar next."
      className="bg-gradient-to-b from-transparent via-accent-red/5 to-transparent"
    >
      {featured && (
        <div className="mb-8">
          <BlogCard post={featured} index={0} reduce={reduce} featured />
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((post, i) => (
          <BlogCard key={post.slug} post={post} index={i} reduce={reduce} />
        ))}
      </div>
    </Section>
  );
}
