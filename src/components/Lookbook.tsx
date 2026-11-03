"use client";

import { useState } from "react";
import Image from "next/image";
import { LOOKBOOK_BACKDROP } from "@/lib/content";
import { Chapter } from "./Chapter";

export function Lookbook() {
  const [sent, setSent] = useState(false);

  return (
    <Chapter id="lookbook" className="flex min-h-[100svh] flex-col overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0">
        <Image
          src={LOOKBOOK_BACKDROP.src}
          alt=""
          fill
          sizes="100vw"
          className="graded object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(24,22,30,0.6),rgba(24,22,30,0.35)_45%,rgba(24,22,30,0.85))]" />
      </div>

      <div className="relative z-10 m-auto flex w-full max-w-[40rem] flex-col items-center px-6 py-40 text-center">
        <p data-reveal="script" className="script">after dark</p>
        <h2 data-reveal="lines" className="caps-heading">
          Request the lookbook
        </h2>
        <p data-reveal="fade" className="caps-body mt-6 max-w-[24rem] opacity-85">
          A printed edition, unbound. Mailed in raw muslin when the next run is ready.
        </p>

        {sent ? (
          <p role="status" className="fade-in mono-label mt-12 max-w-[20rem] leading-relaxed">
            Noted. A copy is yours when the next run is bound.
          </p>
        ) : (
          <form
            data-reveal="fade"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="mt-10 flex w-full max-w-[22rem] flex-col items-center gap-7"
          >
            <label htmlFor="lookbook-email" className="sr-only">
              Email
            </label>
            <input
              id="lookbook-email"
              type="email"
              required
              autoComplete="email"
              placeholder="Email"
              className="input-line"
            />
            <button type="submit" className="btn-dot">
              Request a copy
              <span className="dot" />
            </button>
          </form>
        )}
      </div>

      <footer className="mono-label relative z-10 mx-[var(--margin)] flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-ink/20 py-6 opacity-80">
        <span>RAMA — Aotearoa, 2026</span>
        <span>A concept by Te Wairama Digital</span>
        <a href="#first-light" className="link-dot">
          Back to first light
          <span className="dot" />
        </a>
      </footer>
    </Chapter>
  );
}
