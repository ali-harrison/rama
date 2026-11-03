"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CHAPTERS } from "./content";

gsap.registerPlugin(ScrollTrigger, SplitText);

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/**
 * Animates every [data-reveal] inside `scope`:
 *   script — written on left to right
 *   lines  — masked line rise
 *   words  — words brighten as they scroll through the viewport
 *   fade   — lift + fade
 *   image  — wipes up from the bottom edge
 * and drifts every [data-speed] element for parallax on wider screens.
 * `onLoad` plays reveals as an entrance sequence instead of on scroll.
 */
export function useReveals(
  scope: RefObject<HTMLElement | null>,
  { onLoad = false }: { onLoad?: boolean } = {}
) {
  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]", root).forEach((el, i) => {
        const delay = onLoad ? 0.35 + i * 0.12 : 0;
        const scrollTrigger = onLoad
          ? undefined
          : { trigger: el, start: "top 88%", once: true };

        switch (el.dataset.reveal) {
          case "script":
            gsap.fromTo(
              el,
              { clipPath: "inset(0% 100% 0% 0%)", autoAlpha: 1 },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 1.8,
                ease: "power2.inOut",
                delay,
                scrollTrigger,
                clearProps: "clipPath",
              }
            );
            break;

          case "lines":
            gsap.set(el, { autoAlpha: 1 });
            SplitText.create(el, {
              type: "lines",
              mask: "lines",
              autoSplit: true,
              onSplit: (self) =>
                gsap.from(self.lines, {
                  yPercent: 110,
                  duration: 1.1,
                  ease: "power3.out",
                  stagger: 0.08,
                  delay,
                  scrollTrigger,
                }),
            });
            break;

          case "words":
            gsap.set(el, { autoAlpha: 1 });
            SplitText.create(el, {
              type: "words",
              autoSplit: true,
              onSplit: (self) =>
                gsap.fromTo(
                  self.words,
                  { opacity: 0.18 },
                  {
                    opacity: 1,
                    stagger: 0.1,
                    ease: "none",
                    scrollTrigger: {
                      trigger: el,
                      start: "top 82%",
                      end: "bottom 50%",
                      scrub: true,
                    },
                  }
                ),
            });
            break;

          case "image": {
            const img = el.querySelector("img");
            gsap.fromTo(
              el,
              { clipPath: "inset(100% 0% 0% 0%)", autoAlpha: 1 },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 1.5,
                ease: "power3.inOut",
                delay,
                scrollTrigger,
              }
            );
            if (img) {
              gsap.fromTo(
                img,
                { scale: 1.25 },
                { scale: 1, duration: 2, ease: "power3.out", delay, scrollTrigger }
              );
            }
            break;
          }

          default:
            gsap.fromTo(
              el,
              { autoAlpha: 0, y: 18 },
              { autoAlpha: 1, y: 0, duration: 1.1, ease: "power2.out", delay, scrollTrigger }
            );
        }
      });
    });

    mm.add(`${MOTION_OK} and (min-width: 768px)`, () => {
      gsap.utils.toArray<HTMLElement>("[data-speed]", root).forEach((el) => {
        const speed = Number(el.dataset.speed);
        gsap.fromTo(
          el,
          { y: -speed },
          {
            y: speed,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    });

    return () => mm.revert();
  }, [scope, onLoad]);
}

/**
 * Continuous position through the day: 0 at the top of the page, k exactly
 * when chapter k's top edge crosses the anchor line (a fraction of viewport height).
 */
export function useDayPosition(onChange: (pos: number) => void, anchor = 0.5) {
  const callback = useRef(onChange);

  useEffect(() => {
    callback.current = onChange;
  });

  useEffect(() => {
    let starts: number[] = [];

    const measure = () => {
      const line = window.innerHeight * anchor;
      starts = CHAPTERS.map((c, i) => {
        if (i === 0) return 0;
        const el = document.getElementById(c.id);
        return el ? el.getBoundingClientRect().top + window.scrollY - line : Infinity;
      });
    };

    const update = (y: number) => {
      let pos = 0;
      for (let i = 0; i < starts.length; i++) {
        if (y < starts[i]) break;
        const next = starts[i + 1];
        pos = next === undefined ? i : i + Math.min(1, (y - starts[i]) / (next - starts[i]));
      }
      callback.current(pos);
    };

    measure();
    update(window.scrollY);

    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => update(self.scroll()),
      onRefresh: (self) => {
        measure();
        update(self.scroll());
      },
    });

    return () => st.kill();
  }, [anchor]);
}
