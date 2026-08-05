"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { ContentProvider } from "@/contexts/ContentContext";
import { contentSchema } from "@/lib/schema";
import { firebaseEnabled } from "@/lib/firebase";
import Logo from "@/components/Logo";
import { LoadingScreen } from "@/components/Spinner";

const pages = Array.from(new Set(contentSchema.map((s) => s.page)));

const icons = {
  dashboard: (
    <path d="M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6V11h-6v9Zm0-16v5h6V4h-6Z" strokeWidth="1.6" strokeLinejoin="round" />
  ),
  products: (
    <path
      d="M21 8 12 3 3 8l9 5 9-5Zm0 0v8l-9 5-9-5V8m18 4-9 5-9-5"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  policies: (
    <path
      d="M9 4h9a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V8l3-4Zm0 0v4H5"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  page: (
    <path
      d="M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm8 0v5h5M8 12h8M8 16h8M8 8h3"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
};

function NavIcon({ path }: { path: React.ReactNode }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="shrink-0">
      {path}
    </svg>
  );
}

function NavLink({
  href,
  label,
  icon,
  active,
  onClick,
}: {
  href: string;
  label: string;
  icon?: React.ReactNode;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors duration-200 ${
        active ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
      }`}
    >
      {active && (
        <motion.span
          layoutId="admin-nav-active"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
          className="absolute inset-0 rounded-lg bg-gray-100"
        />
      )}
      {!active && (
        <span className="absolute inset-0 scale-95 rounded-lg bg-gray-100 opacity-0 transition-all duration-200 ease-out group-hover:scale-100 group-hover:opacity-60" />
      )}
      {icon && (
        <span className={`relative transition-colors duration-200 ${active ? "text-gray-900" : "text-gray-400 group-hover:text-gray-700"}`}>
          {icon}
        </span>
      )}
      <span className="relative font-medium">{label}</span>
    </Link>
  );
}

function NavContent({ pathname, onNavigate }: { pathname: string | null; onNavigate?: () => void }) {
  return (
    <LayoutGroup id="admin-nav">
      <nav className="flex flex-col gap-7">
        <div className="flex flex-col gap-1">
          <NavLink
            href="/admin"
            label="Dashboard"
            icon={<NavIcon path={icons.dashboard} />}
            active={pathname === "/admin"}
            onClick={onNavigate}
          />
          <NavLink
            href="/admin/products"
            label="Products"
            icon={<NavIcon path={icons.products} />}
            active={!!pathname?.startsWith("/admin/products")}
            onClick={onNavigate}
          />
          <NavLink
            href="/admin/policies"
            label="Policy Pages"
            icon={<NavIcon path={icons.policies} />}
            active={!!pathname?.startsWith("/admin/policies")}
            onClick={onNavigate}
          />
        </div>

        {pages.map((page) => (
          <div key={page}>
            <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              {page}
            </p>
            <div className="mt-2 flex flex-col gap-1">
              {contentSchema
                .filter((s) => s.page === page)
                .map((s) => (
                  <NavLink
                    key={s.key}
                    href={`/admin/content/${s.key}`}
                    label={s.label}
                    icon={<NavIcon path={icons.page} />}
                    active={pathname === `/admin/content/${s.key}`}
                    onClick={onNavigate}
                  />
                ))}
            </div>
          </div>
        ))}
      </nav>
    </LayoutGroup>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!loading && !user && firebaseEnabled) {
      router.replace("/admin/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (!firebaseEnabled) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="max-w-md rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-sm font-medium text-gray-900">Firebase is not configured yet.</p>
          <p className="mt-2 text-sm text-gray-500">
            Add your Firebase project keys to .env.local and restart the dev server.
          </p>
        </div>
      </div>
    );
  }

  if (loading || !user) {
    return <LoadingScreen />;
  }

  return (
    <ContentProvider>
      <div className="min-h-screen bg-[#fafafa]">
        <header className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3 sm:hidden">
          <div className="flex items-center gap-2">
            <Logo />
          </div>
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-700"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="fixed inset-0 z-50 sm:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute inset-0 bg-black/30"
                onClick={() => setMobileOpen(false)}
              />
              <motion.aside
                className="absolute left-0 top-0 flex h-full w-72 flex-col bg-white p-6 shadow-xl"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="flex items-center justify-between">
                  <Logo />
                  <button
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close menu"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:text-gray-900"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
                <p className="mt-2 text-lg text-gray-900">Admin</p>

                <div className="mt-6 flex-1 overflow-y-auto">
                  <NavContent pathname={pathname} onNavigate={() => setMobileOpen(false)} />
                </div>

                <div className="flex flex-col gap-2 pt-6">
                  <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-gray-200 px-3 py-2 text-center text-sm text-gray-600 transition-colors hover:border-gray-900 hover:text-gray-900"
                  >
                    View live site
                  </a>
                  <button
                    onClick={() => logout()}
                    className="rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:text-gray-900"
                  >
                    Sign out
                  </button>
                </div>
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>

        <aside
          className={`no-scrollbar fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col overflow-y-auto border-r border-gray-100 bg-white/95 p-6 shadow-[1px_0_0_0_rgba(0,0,0,0.02)] backdrop-blur-sm transition-all duration-500 ease-out sm:flex ${
            mounted ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
          }`}
        >
          <div className="flex items-center gap-2 pb-5">
            <Logo />
          </div>
          <div className="border-b border-gray-100 pb-5">
            <p className="text-[15px] font-medium text-gray-900">Admin panel</p>
            <p className="mt-0.5 text-xs text-gray-400">Manage your site content</p>
          </div>

          <div className="mt-6 flex-1">
            <NavContent pathname={pathname} />
          </div>

          <div className="mt-6 flex flex-col gap-2 border-t border-gray-100 pt-5">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:border-gray-900 hover:text-gray-900"
            >
              View live site
            </a>
            <button
              onClick={() => logout()}
              className="rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors duration-200 hover:text-gray-900"
            >
              Sign out
            </button>
          </div>
        </aside>

        <main
          className={`overflow-x-hidden px-4 pb-16 pt-6 transition-all duration-500 ease-out sm:ml-64 sm:px-10 sm:pb-16 sm:pt-10 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          {children}
        </main>

        <footer className="fixed bottom-0 left-0 z-20 w-full border-t border-gray-100 bg-white/95 px-4 py-2.5 text-center text-xs text-gray-400 backdrop-blur-sm sm:left-64 sm:w-[calc(100%-16rem)]">
          Developed by <span className="font-medium text-gray-600">Webaurix</span>
        </footer>
      </div>
    </ContentProvider>
  );
}
