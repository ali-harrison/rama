"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { CHAPTERS } from "@/lib/content";
import { useDayPosition } from "@/lib/motion";

// Hold each chapter's sky, then blend over the last stretch before the next one arrives
const BLEND_FROM = 0.55;

// Fixed chrome takes the ink of whichever chapter sits beneath it:
// the header near the top edge, the ruler at mid-screen
const HEADER_LINE = 0.05;
const RULER_LINE = 0.5;

const smoothstep = (t: number) => t * t * (3 - 2 * t);

export function Sky() {
  const lastSky = useRef("");
  const lastHeader = useRef(-1);
  const lastRuler = useRef(-1);

  useDayPosition((pos) => {
    const k = Math.min(Math.floor(pos), CHAPTERS.length - 1);
    const from = CHAPTERS[k];
    const to = CHAPTERS[Math.min(k + 1, CHAPTERS.length - 1)];
    const t = smoothstep(gsap.utils.clamp(0, 1, (pos - k - BLEND_FROM) / (1 - BLEND_FROM)));

    // Most of the scroll sits in a held sky — skip the root style write
    const key = `${k}:${t.toFixed(3)}`;
    if (key === lastSky.current) return;
    lastSky.current = key;

    const root = document.documentElement.style;
    root.setProperty("--sky-top", gsap.utils.interpolate(from.skyTop, to.skyTop, t));
    root.setProperty("--sky-bottom", gsap.utils.interpolate(from.skyBottom, to.skyBottom, t));
  });

  useDayPosition((pos) => {
    const k = Math.min(Math.floor(pos), CHAPTERS.length - 1);
    if (k === lastHeader.current) return;
    lastHeader.current = k;
    const root = document.documentElement;
    root.style.setProperty("--chrome", CHAPTERS[k].ink);
    root.dataset.chapter = CHAPTERS[k].id;
  }, HEADER_LINE);

  useDayPosition((pos) => {
    const k = Math.min(Math.floor(pos), CHAPTERS.length - 1);
    if (k === lastRuler.current) return;
    lastRuler.current = k;
    document.documentElement.style.setProperty("--chrome-mid", CHAPTERS[k].ink);
  }, RULER_LINE);

  return <div className="sky" aria-hidden="true" />;
}
