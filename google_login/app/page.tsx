"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type SessionUser = {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
  exp?: number;
};

export default function Home() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!res.ok) {
          setUser(null);
          return;
        }
        const data = (await res.json()) as { user?: SessionUser };
        if (!cancelled) {
          setUser(data.user ?? null);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const signOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-10 px-8 py-16">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/next.svg" alt="Next.js" width={90} height={24} />
            <span className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
              Google OAuth Demo
            </span>
          </div>
        </header>

        <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold tracking-tight">
            Sign in with Google
          </h1>
          <p className="mt-3 max-w-xl text-base text-zinc-600">
            This example uses the OAuth 2.0 authorization code flow. New users
            are recorded as sign ups, returning users are logged as logins in{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 text-[0.9em]">
              data.json
            </code>
            .
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {loading ? (
              <span className="text-sm text-zinc-500">Checking session...</span>
            ) : user ? (
              <button
                onClick={signOut}
                className="rounded-full border border-zinc-300 px-5 py-2 text-sm font-medium transition hover:border-zinc-400"
              >
                Sign out
              </button>
            ) : (
              <a
                className="inline-flex items-center gap-3 rounded-full bg-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
                href="/api/auth/google"
              >
                <span>Continue with Google</span>
              </a>
            )}
          </div>

          <div className="mt-8 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-6">
            {user ? (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {user.picture ? (
                  <Image
                    src={user.picture}
                    alt={user.name ?? "Google user"}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                ) : null}
                <div>
                  <div className="text-lg font-semibold">
                    {user.name ?? "Google User"}
                  </div>
                  <div className="text-sm text-zinc-600">{user.email}</div>
                  <div className="mt-2 text-xs text-zinc-500">
                    Session expires:{" "}
                    {user.exp ? new Date(user.exp * 1000).toLocaleString() : "-"}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-zinc-500">
                No active session. Click the button above to authenticate.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-zinc-200 bg-white p-8 text-sm text-zinc-600">
          <h2 className="text-base font-semibold text-zinc-800">
            Environment variables
          </h2>
          <ul className="mt-3 list-disc pl-5">
            <li>
              <code className="rounded bg-zinc-100 px-1 py-0.5 text-[0.9em]">
                GOOGLE_CLIENT_ID
              </code>
            </li>
            <li>
              <code className="rounded bg-zinc-100 px-1 py-0.5 text-[0.9em]">
                GOOGLE_CLIENT_SECRET
              </code>
            </li>
            <li>
              <code className="rounded bg-zinc-100 px-1 py-0.5 text-[0.9em]">
                GOOGLE_CALLBACK_URL
              </code>
            </li>
            <li>
              <code className="rounded bg-zinc-100 px-1 py-0.5 text-[0.9em]">
                JWT_SECRET
              </code>
            </li>
          </ul>
          <p className="mt-3">
            Ensure{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 text-[0.9em]">
              GOOGLE_CALLBACK_URL
            </code>{" "}
            matches the OAuth redirect URI configured in Google Cloud (for
            example,{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 text-[0.9em]">
              http://localhost:3000/api/auth/google/callback
            </code>
            ).
          </p>
        </section>
      </main>
    </div>
  );
}
