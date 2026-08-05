"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { firebaseEnabled } from "@/lib/firebase";
import Logo from "@/components/Logo";
import Spinner from "@/components/Spinner";

export default function AdminLoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (user) {
    router.replace("/admin");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      router.replace("/admin");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  }

  const fade = `transition-all duration-700 ease-out ${
    mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
  }`;

  if (!firebaseEnabled) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className={`max-w-md rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center ${fade}`}>
          <p className="text-sm font-medium text-gray-900">Firebase is not configured yet.</p>
          <p className="mt-2 text-sm text-gray-500">
            Add your Firebase project keys to <code className="text-gray-700">.env.local</code>{" "}
            (see <code className="text-gray-700">.env.local.example</code>) and restart the dev
            server to enable the admin panel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-8 shadow-sm ${fade}`}
      >
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1 className="mt-6 text-center text-2xl font-normal text-gray-900">Admin sign in</h1>
        <p className="mt-1 text-center text-xs text-gray-400">
          Sign in to manage your site content
        </p>

        <div className="mt-8 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-gray-900 focus:outline-none"
              placeholder="you@sballiance.com"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-gray-900 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 flex items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-105 disabled:opacity-60"
          >
            {submitting && <Spinner size={14} className="border-white/30 border-t-white" />}
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}
