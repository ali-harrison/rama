"use client";

import { useEffect, useState } from "react";
import { CHAPTERS } from "@/lib/content";

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="chrome fixed inset-x-0 top-0 z-50">
        <div className="relative mx-[var(--margin)] flex h-16 items-center justify-between md:h-20">
          <span className="mono-label opacity-70">
            Raw series 07<span className="hidden md:inline"> · Aotearoa</span>
          </span>

          <a href="#first-light" className="wordmark absolute left-1/2 -translate-x-1/2">
            RAMA
          </a>

          <div className="flex items-center gap-6">
            <a href="#lookbook" className="lookbook-link link-dot mono-label hidden md:inline-flex">
              Lookbook
              <span className="dot" />
            </a>
            <button
              type="button"
              className="mono-label cursor-pointer xl:hidden"
              aria-expanded={open}
              aria-controls="chapter-index"
              onClick={() => setOpen(true)}
            >
              Index
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div
          id="chapter-index"
          role="dialog"
          aria-modal="true"
          aria-label="Chapters"
          className="fade-in fixed inset-0 z-[90] flex flex-col bg-[#EDE6DB] px-[var(--margin)] text-[#1F1E1C]"
        >
          <div className="flex h-16 items-center justify-between md:h-20">
            <span className="mono-label opacity-70">Index</span>
            <button
              type="button"
              className="mono-label cursor-pointer"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
          <nav className="my-auto pb-16">
            <ol className="border-t border-[#1F1E1C]/15">
              {CHAPTERS.map((c, i) => (
                <li key={c.id} className="border-b border-[#1F1E1C]/15">
                  <a
                    href={`#${c.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between gap-4 py-5"
                  >
                    <span className="caps-heading">{c.label}</span>
                    <span className="mono-label opacity-60">
                      {String(i + 1).padStart(2, "0")} — {c.time}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      )}
    </>
  );
}
