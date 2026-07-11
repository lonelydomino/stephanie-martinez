import { redirect } from "next/navigation";
import AdminPostsManager from "@/components/admin/AdminPostsManager";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { readPostSources } from "@/lib/postsStore";

export default async function AdminPostsPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const posts = await readPostSources();

  return <AdminPostsManager initialPosts={posts} />;
}
