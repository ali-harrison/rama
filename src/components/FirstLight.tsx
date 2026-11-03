"use client";

import { useCallback, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FIRST_LIGHT_SHOTS,
  HERO_LETTERS,
  PROXIMITY_RADIUS,
  MAX_FREQUENCY,
  MAX_SCALE,
} from "@/lib/content";
import { MOTION_OK } from "@/lib/motion";
import { Chapter } from "./Chapter";
import { FloatFrame } from "./FloatImage";

gsap.registerPlugin(ScrollTrigger);

const MAX_CHROMA = 3; // px — max feOffset dx at full proximity

export function FirstLight() {
  const stageRef = useRef<HTMLDivElement>(null);
  const scrollLineRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Displacement filter refs
  const turbulenceRefs = useRef<(SVGFETurbulenceElement | null)[]>([]);
  const displacementRefs = useRef<(SVGFEDisplacementMapElement | null)[]>([]);

  // Chromatic aberration filter refs — one red offset and one blue offset per letter
  const chromaRedRefs = useRef<(SVGFEOffsetElement | null)[]>([]);
  const chromaBlueRefs = useRef<(SVGFEOffsetElement | null)[]>([]);

  // Proxy objects drive both effects from a single tween per letter
  const letterProxies = useRef(
    HERO_LETTERS.map(() => ({ frequency: 0, scale: 0, chroma: 0 }))
  );

  const applyFilters = useCallback((i: number) => {
    const proxy = letterProxies.current[i];
    turbulenceRefs.current[i]?.setAttribute(
      "baseFrequency",
      `${proxy.frequency} ${proxy.frequency * 1.5}`
    );
    displacementRefs.current[i]?.setAttribute("scale", String(proxy.scale));
    chromaRedRefs.current[i]?.setAttribute("dx", String(-proxy.chroma));
    chromaBlueRefs.current[i]?.setAttribute("dx", String(proxy.chroma));
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      HERO_LETTERS.forEach((_, i) => {
        const span = letterRefs.current[i];
        if (!span) return;
        const proxy = letterProxies.current[i];

        const rect = span.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        const proximity = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / PROXIMITY_RADIUS);

        gsap.killTweensOf(proxy);
        gsap.to(proxy, {
          frequency: proximity * MAX_FREQUENCY,
          scale: proximity * MAX_SCALE,
          chroma: proximity * MAX_CHROMA,
          ...(proximity > 0
            ? { duration: 0.3, ease: "power2.out" }
            : { duration: 1.8, ease: "elastic.out(0.4, 0.3)" }),
          onUpdate: () => applyFilters(i),
        });
      });
    },
    [applyFilters]
  );

  const handleMouseLeave = useCallback(() => {
    HERO_LETTERS.forEach((_, i) => {
      const proxy = letterProxies.current[i];
      gsap.killTweensOf(proxy);
      gsap.to(proxy, {
        frequency: 0,
        scale: 0,
        chroma: 0,
        duration: 2.2,
        ease: "power2.inOut",
        onUpdate: () => applyFilters(i),
      });
    });
  }, [applyFilters]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.addEventListener("mousemove", handleMouseMove);
    stage.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      stage.removeEventListener("mousemove", handleMouseMove);
      stage.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      MOTION_OK,
      () => {
        gsap.fromTo(
          ".hero-letter",
          { yPercent: 35, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 1.8, ease: "power3.out", stagger: 0.09, delay: 0.1 }
        );

        gsap.to(".hero-title", {
          yPercent: -22,
          ease: "none",
          scrollTrigger: {
            trigger: stageRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        // Scroll hint pulse — line drains downward repeatedly
        gsap.to(scrollLineRef.current, {
          scaleY: 0,
          transformOrigin: "top center",
          duration: 1.2,
          ease: "power2.in",
          repeat: -1,
          repeatDelay: 0.8,
          delay: 2.4,
        });
      },
      stageRef
    );

    return () => mm.revert();
  }, []);

  return (
    <Chapter id="first-light" revealOnLoad className="h-[100svh] min-h-[640px]">
      <div ref={stageRef} className="absolute inset-0">
        <FloatFrame shots={FIRST_LIGHT_SHOTS} hideOnMobile eager />

        {/* SVG filter defs — displacement + chromatic aberration, one of each per letter */}
        <svg
          aria-hidden="true"
          style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
        >
          <defs>
            {HERO_LETTERS.map((_, i) => (
              <filter
                key={`warp-${i}`}
                id={`warp-${i}`}
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
                colorInterpolationFilters="sRGB"
              >
                <feTurbulence
                  ref={(el) => { turbulenceRefs.current[i] = el; }}
                  type="turbulence"
                  baseFrequency="0 0"
                  numOctaves={3}
                  seed={i * 42 + 7}
                  result="noise"
                />
                <feDisplacementMap
                  ref={(el) => { displacementRefs.current[i] = el; }}
                  in="SourceGraphic"
                  in2="noise"
                  scale="0"
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </filter>
            ))}

            {/* R and B channels offset in opposite directions, G fixed.
                At rest all offsets are 0 so the filter is a visual no-op. */}
            {HERO_LETTERS.map((_, i) => (
              <filter
                key={`chroma-${i}`}
                id={`chroma-${i}`}
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
                colorInterpolationFilters="sRGB"
              >
                <feColorMatrix
                  type="matrix"
                  values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                  result="red"
                />
                <feOffset
                  ref={(el) => { chromaRedRefs.current[i] = el; }}
                  in="red"
                  dx="0"
                  dy="0"
                  result="redShift"
                />
                <feColorMatrix
                  in="SourceGraphic"
                  type="matrix"
                  values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
                  result="blue"
                />
                <feOffset
                  ref={(el) => { chromaBlueRefs.current[i] = el; }}
                  in="blue"
                  dx="0"
                  dy="0"
                  result="blueShift"
                />
                <feColorMatrix
                  in="SourceGraphic"
                  type="matrix"
                  values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
                  result="green"
                />
                {/* Screen recombines the channels — a plain merge would let blue cover the rest */}
                <feBlend in="redShift" in2="green" mode="screen" result="redGreen" />
                <feBlend in="redGreen" in2="blueShift" mode="screen" />
              </filter>
            ))}
          </defs>
        </svg>

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 pt-10 text-center">
          <div className="hero-title relative">
            {/* Signed across the top-left of the wordmark */}
            <p data-reveal="script" className="script -left-[12%] -rotate-[8deg] md:-left-[16%]">
              first light
            </p>
            <h1
              className="font-light uppercase leading-[0.82] tracking-[0.01em]"
              style={{ fontSize: "clamp(5.5rem, 17vw, 16rem)" }}
            >
              {HERO_LETTERS.map((letter, i) => (
                <span
                  key={i}
                  ref={(el) => { letterRefs.current[i] = el; }}
                  className="hero-letter"
                  style={{
                    display: "inline-block",
                    filter: `url(#warp-${i}) url(#chroma-${i})`,
                    willChange: "filter",
                  }}
                >
                  {letter}
                </span>
              ))}
            </h1>
          </div>

          <p data-reveal="fade" className="caps-heading mt-6 text-[clamp(1.2rem,1.9vw,1.65rem)]">
            Garments made visible.
          </p>
          <p data-reveal="fade" className="caps-body mt-4 max-w-[21rem] opacity-80">
            Raw construction. Exposed seams. Natural fabrics that age with wear.
          </p>
          <a data-reveal="fade" href="#lookbook" className="btn-dot mt-9">
            Request the lookbook
            <span className="dot" />
          </a>
        </div>

        <div className="mono-label absolute inset-x-[var(--margin)] bottom-6 z-10 flex items-end justify-between opacity-60">
          <span>36°51′S 174°46′E</span>
          <div className="flex flex-col items-center gap-2" aria-hidden="true">
            <div ref={scrollLineRef} className="h-10 w-px bg-ink" />
          </div>
          <span className="w-[7.5rem]" />
        </div>
      </div>
    </Chapter>
  );
}
