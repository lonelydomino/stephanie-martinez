import { Suspense } from "react";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="px-5 py-16 text-center text-muted">Loading…</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}
