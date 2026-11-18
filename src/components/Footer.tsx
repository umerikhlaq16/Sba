"use client";

import { useState } from "react";
import Logo from "./Logo";
import { useSection } from "@/contexts/ContentContext";
import { submitSubscriber } from "@/lib/submissions";

const socialIcons = {
  Instagram:
    "M12 2c2.7 0 3 0 4.1.06 1.1.05 1.8.22 2.5.47a5 5 0 0 1 1.8 1.17 5 5 0 0 1 1.17 1.8c.25.7.42 1.4.47 2.5C22 8.9 22 9.3 22 12s0 3-.06 4.1c-.05 1.1-.22 1.8-.47 2.5a5 5 0 0 1-1.17 1.8 5 5 0 0 1-1.8 1.17c-.7.25-1.4.42-2.5.47C15 22 14.7 22 12 22s-3 0-4.1-.06c-1.1-.05-1.8-.22-2.5-.47a5 5 0 0 1-1.8-1.17 5 5 0 0 1-1.17-1.8c-.25-.7-.42-1.4-.47-2.5C2 15.1 2 14.7 2 12s0-3 .06-4.1c.05-1.1.22-1.8.47-2.5a5 5 0 0 1 1.17-1.8A5 5 0 0 1 5.5.43c.7-.25 1.4-.42 2.5-.47C8.9 0 9.3 0 12 0Zm0 5.4A6.6 6.6 0 1 0 12 18.6 6.6 6.6 0 0 0 12 5.4Zm0 2A4.6 4.6 0 1 1 12 16.6 4.6 4.6 0 0 1 12 7.4Zm6.85-2.36a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z",
  X: "M18.9 2h3.3l-7.2 8.2L23.5 22h-6.6l-5.2-6.8L5.7 22H2.4l7.7-8.8L1 2h6.8l4.7 6.2L18.9 2Zm-1.2 18h1.8L7.4 4H5.5l12.2 16Z",
  LinkedIn:
    "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.97V21h-4V9Z",
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const copy = useSection("footer") as {
    description: string;
    newsletterText: string;
    instagramUrl: string;
    xUrl: string;
    linkedinUrl: string;
    companyLinks: { label: string; href: string }[];
    supportLinks: { label: string; href: string }[];
    creditText: string;
    privacyLink: string;
    termsLink: string;
  };
  const socials = [
    { name: "Instagram", url: copy.instagramUrl, path: socialIcons.Instagram },
    { name: "X", url: copy.xUrl, path: socialIcons.X },
    { name: "LinkedIn", url: copy.linkedinUrl, path: socialIcons.LinkedIn },
  ].filter((s) => s.url && s.url !== "#");
  const columns = [
    { title: "Company", links: copy.companyLinks ?? [] },
    { title: "Support", links: copy.supportLinks ?? [] },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setError(false);
    try {
      const saved = await submitSubscriber(email.trim());
      if (saved) setSubmitted(true);
      else setError(true);
    } catch {
      setError(true);
    }
  }

  return (
    <footer className="bg-foreground px-4 pt-16 sm:px-6 sm:pt-20 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="col-span-2 sm:col-span-1">
            <Logo light />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">{copy.description}</p>
            <div className="mt-6 flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.name}
                  className="flex h-9 w-9 items-center justify-center border border-white/15 text-white/60 hover:border-brand hover:text-brand"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-medium uppercase tracking-widest text-white/40">{col.title}</p>
              <ul className="mt-3 flex flex-col gap-1">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="inline-block py-1 text-sm text-white/70 hover:text-brand">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 sm:col-span-1">
            <p className="text-xs font-medium uppercase tracking-widest text-white/40">Stay in the loop</p>
            <p className="mt-4 text-sm leading-relaxed text-white/50">{copy.newsletterText}</p>

            {submitted ? (
              <p className="mt-4 text-sm text-white">You&apos;re on the list.</p>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-4 flex items-center gap-2 border border-white/15 p-1 pl-4"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="flex h-9 w-9 shrink-0 items-center justify-center bg-brand text-white"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 12h16M13 5l7 7-7 7"
                      stroke="#fff"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </form>
            )}
            {error && <p className="mt-2 text-xs text-red-300">Couldn&apos;t subscribe right now. Please try again.</p>}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} {copy.creditText}
          </p>
          <div className="flex items-center gap-6">
            <a href={copy.privacyLink} className="text-xs text-white/40 hover:text-brand">
              Privacy Policy
            </a>
            <a href={copy.termsLink} className="text-xs text-white/40 hover:text-brand">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
