"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/components/Logo";

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Login failed.");
      return;
    }

    const from = searchParams.get("from") ?? "/admin/posts";
    router.push(from);
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-16">
      <div className="mb-8 flex flex-col items-center gap-4 text-center">
        <Logo className="h-16 w-16" />
        <div>
          <h1 className="font-display text-2xl font-semibold text-bone">
            Site Admin
          </h1>
          <p className="mt-2 text-sm text-muted">
            Sign in to update What&apos;s New posts for Simply Spooky Stephanie.
          </p>
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-white/8 bg-bg-secondary/70 p-6 backdrop-blur-sm"
      >
        <label htmlFor="admin-password" className="text-sm font-medium text-bone">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded-xl border border-white/10 bg-bg-primary/80 px-4 py-3 text-sm text-bone outline-none transition-shadow focus:border-accent-purple/60"
          autoComplete="current-password"
          required
        />

        {error && (
          <p className="mt-3 text-sm text-accent-orange" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-xl bg-accent-purple px-4 py-3 text-sm font-semibold text-bone transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-muted">
        <Link href="/" className="text-gold hover:text-accent-orange">
          Back to site
        </Link>
      </p>
    </main>
  );
}
