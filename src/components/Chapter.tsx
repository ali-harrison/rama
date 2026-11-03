"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { CHAPTERS, INK_DARK, INK_LIGHT, chapter } from "@/lib/content";
import { useReveals } from "@/lib/motion";

const PAPER = "#F3EEE4";
const pad = (n: number) => String(n).padStart(2, "0");

interface ChapterProps {
  id: string;
  className?: string;
  revealOnLoad?: boolean;
  children: ReactNode;
}

/** A full-bleed chapter of the day. Pins its own ink so text never fades mid-blend. */
export function Chapter({ id, className = "", revealOnLoad = false, children }: ChapterProps) {
  const ref = useRef<HTMLElement>(null);
  useReveals(ref, { onLoad: revealOnLoad });

  const c = chapter(id);
  const index = CHAPTERS.indexOf(c);

  return (
    <section
      id={id}
      ref={ref}
      className={`relative text-ink ${className}`}
      style={{ "--ink": c.ink, "--paper": c.ink === INK_LIGHT ? INK_DARK : PAPER } as CSSProperties}
    >
      {index > 0 && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-[3]">
          <div className="h-px bg-ink/15" />
          <div className="absolute inset-x-[var(--margin)] top-0">
            {[0, 3, 6, 9, 12].map((col) => (
              <span key={col} className="crosshair" style={{ left: `${(col / 12) * 100}%` }} />
            ))}
            <span className="mono-label absolute left-3 top-3 opacity-60">
              {pad(index + 1)} / {pad(CHAPTERS.length)} — {c.time}
            </span>
            <span className="mono-label absolute right-3 top-3 opacity-60">{c.label}</span>
          </div>
        </div>
      )}
      {children}
    </section>
  );
}
