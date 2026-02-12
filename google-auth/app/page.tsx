"use client";

import { useEffect, useState } from "react";

type AuthUser = {
  id: string;
  email: string | null;
  displayName: string;
  picture: string | null;
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const fetchAuthUser = async () => {
      try {
        const response = await fetch("/api/auth/me");
        const data = (await response.json()) as {
          authenticated: boolean;
          user: AuthUser | null;
        };
        setUser(data.authenticated ? data.user : null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    void fetchAuthUser();
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  const loginWithGoogle = () => {
    window.location.assign("/api/auth/google");
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-6 px-6 py-10 text-center">
      <h1 className="text-3xl font-semibold">Google Login with Passport.js</h1>

      {loading ? <p>Checking login status...</p> : null}

      {!loading && !user ? (
        <button
          onClick={loginWithGoogle}
          className="rounded-md bg-black px-5 py-3 text-white transition hover:opacity-90"
          type="button"
        >
          Continue with Google
        </button>
      ) : null}

      {!loading && user ? (
        <section className="flex flex-col items-center gap-3 rounded-lg border border-zinc-200 p-6">
          {user.picture ? (
            // Google profile images are external URLs, so a native img keeps setup simple.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.picture}
              alt={user.displayName}
              className="h-16 w-16 rounded-full"
            />
          ) : null}
          <p className="text-lg font-medium">{user.displayName}</p>
          <p className="text-sm text-zinc-600">{user.email ?? "No email"}</p>
          <button
            onClick={logout}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-50"
            type="button"
          >
            Logout
          </button>
        </section>
      ) : null}
    </main>
  );
}
