"use client";

import { useRef, useState } from "react";
import { CHAPTERS } from "@/lib/content";
import { useDayPosition } from "@/lib/motion";

// Multiple of 30 so every chapter label lands on a major tick
const TAPE = 360;
const LAST = CHAPTERS.length - 1;

const MINUTES = CHAPTERS.map((c) => {
  const [h, m] = c.time.split(":").map(Number);
  return h * 60 + m;
});

function timeAt(pos: number) {
  const k = Math.min(Math.floor(pos), LAST);
  const next = MINUTES[Math.min(k + 1, LAST)];
  const mins = Math.round(MINUTES[k] + (next - MINUTES[k]) * (pos - k));
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
}

export function Ruler() {
  const [active, setActive] = useState(0);
  const markerRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);

  useDayPosition((pos) => {
    const k = Math.min(Math.floor(pos), LAST);
    setActive((prev) => (prev === k ? prev : k));
    if (markerRef.current) {
      markerRef.current.style.transform = `translateY(${(Math.min(pos, LAST) / LAST) * TAPE}px)`;
    }
    if (clockRef.current) clockRef.current.textContent = timeAt(pos);
  });

  return (
    <nav
      aria-label="Chapters"
      className="chrome-mid fixed left-4 top-1/2 z-50 hidden -translate-y-1/2 xl:block"
      style={{ height: TAPE }}
    >
      <span
        ref={clockRef}
        className="mono-label absolute -top-10 left-0 tabular-nums opacity-70"
      >
        {CHAPTERS[0].time}
      </span>

      <div className="tape absolute left-0 top-0" style={{ height: TAPE + 1 }} />

      <div ref={markerRef} className="absolute left-0 top-0 h-px w-[22px] bg-amber" />

      {CHAPTERS.map((c, i) => (
        <a
          key={c.id}
          href={`#${c.id}`}
          aria-current={active === i ? "true" : undefined}
          className={`ruler-label mono-label ${active === i ? "is-active" : ""}`}
          style={{ top: (i / LAST) * TAPE }}
        >
          {c.label}
        </a>
      ))}
    </nav>
  );
}
