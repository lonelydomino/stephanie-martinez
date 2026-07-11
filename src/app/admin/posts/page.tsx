import { redirect } from "next/navigation";
import AdminPostsManager from "@/components/admin/AdminPostsManager";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { enrichPost } from "@/lib/enrichPost";
import { readPostSources } from "@/lib/postsStore";
import type { ResolvedPostPreview } from "@/lib/whatsNewPosts";

export default async function AdminPostsPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const posts = await readPostSources();
  const resolvedPreviews: Record<string, ResolvedPostPreview> = {};

  await Promise.all(
    posts.map(async (source) => {
      if (!source.slug) return;

      try {
        const enriched = await enrichPost(source);
        resolvedPreviews[source.slug] = {
          image: enriched.image,
          imageAlt: enriched.imageAlt,
          title: enriched.title,
          when: enriched.when,
        };
      } catch (error) {
        console.warn(
          `Admin preview enrichment failed for "${source.slug}".`,
          error,
        );
      }
    }),
  );

  return (
    <AdminPostsManager
      initialPosts={posts}
      resolvedPreviews={resolvedPreviews}
    />
  );
}
