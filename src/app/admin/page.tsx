import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/adminAuth";

export default async function AdminIndexPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin/posts");
  }

  redirect("/admin/login");
}
