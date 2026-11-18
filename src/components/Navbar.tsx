"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./Logo";

const links = [
  { name: "Home", href: "/" },
  { name: "Who We Are", href: "/#about" },
  { name: "Facility & Process", href: "/#facility" },
  { name: "Catalog", href: "/#products" },
];

function useHashScroll() {
  const pathname = usePathname();
  const router = useRouter();

  return function handleClick(e: React.MouseEvent, href: string) {
    if (!href.includes("#")) return;
    const [path, hash] = href.split("#");
    const targetPath = path || "/";

    if (pathname === targetPath) {
      e.preventDefault();
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
    } else {
      e.preventDefault();
      router.push(href);
    }
  };
}

function NavLink({
  href,
  name,
  onClick,
}: {
  href: string;
  name: string;
  onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="whitespace-nowrap text-[13px] font-medium uppercase tracking-[0.12em] text-foreground/70 hover:text-foreground"
    >
      {name}
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const handleHashClick = useHashScroll();

  return (
    <nav className="site-navbar w-full bg-background px-4 py-2.5 sm:px-6 sm:py-3 lg:px-8">
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-2 items-center lg:grid-cols-[auto_1fr_auto] lg:gap-8">
        <Link href="/" aria-label="SB Alliance home" className="flex items-center gap-2.5">
          <Logo />
        </Link>

        <ul className="hidden items-center justify-center gap-6 lg:flex xl:gap-9">
          {links.map((link) => (
            <li key={link.name}>
              <NavLink
                href={link.href}
                name={link.name}
                onClick={(e) => handleHashClick(e, link.href)}
              />
            </li>
          ))}
        </ul>

        <div className="hidden justify-end lg:flex">
          <Link
            href="/contact"
            className="border border-foreground bg-foreground px-5 py-2.5 text-[13px] font-medium uppercase tracking-[0.1em] text-background hover:bg-foreground/90"
          >
            Start an Inquiry
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="flex flex-col gap-1.5 justify-self-end p-3 lg:hidden"
          aria-label="Toggle menu"
        >
          <span className="h-0.5 w-5 bg-foreground" />
          <span className="h-0.5 w-5 bg-foreground" />
          <span className="h-0.5 w-5 bg-foreground" />
        </button>
      </div>

      {open && (
        <ul className="mt-2 flex flex-col gap-1 border border-foreground/10 bg-background p-3 lg:hidden">
          {links.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                onClick={(e) => {
                  handleHashClick(e, link.href);
                  setOpen(false);
                }}
                className="block px-4 py-3 text-sm font-medium uppercase tracking-[0.1em] text-foreground/70"
              >
                {link.name}
              </a>
            </li>
          ))}
          <li>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-1 block border border-foreground bg-foreground px-4 py-2.5 text-center text-xs font-medium uppercase tracking-[0.1em] text-background"
            >
              Start an Inquiry
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}
