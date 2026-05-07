"use client";

import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Collection", href: "#collection" },
  { label: "Process", href: "#process" },
  { label: "Lookbook", href: "#cta" },
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const darkSet = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) darkSet.add(entry.target);
          else darkSet.delete(entry.target);
        });
        setIsDark(darkSet.size > 0);
      },
      { threshold: 0 }
    );

    document.querySelectorAll("#philosophy, #process").forEach((el) =>
      observer.observe(el)
    );

    return () => observer.disconnect();
  }, []);

  const borderStyle = scrolled
    ? isDark
      ? "1px solid rgba(232,224,208,0.1)"
      : "1px solid rgba(44,44,44,0.15)"
    : "none";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[10000] px-8 py-6 flex items-center justify-between transition-colors duration-300 ${
        isDark ? "text-linen" : "text-charcoal"
      }`}
      style={{ borderBottom: borderStyle, transition: "border-color 0.3s ease, color 0.3s ease" }}
    >
      <a
        href="#"
        className="font-display no-underline"
        style={{ fontSize: "0.9rem", fontWeight: 300, letterSpacing: "-0.02em" }}
      >
        RAMA
      </a>

      <div className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="nav-link font-utility text-[0.65rem] tracking-[0.15em] uppercase no-underline"
          >
            <span className="nav-link-top">{label}</span>
            <span className="nav-link-bottom" aria-hidden="true">
              {label}
            </span>
          </a>
        ))}
      </div>
    </nav>
  );
}
