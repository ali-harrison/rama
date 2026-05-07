"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  HERO_LETTERS,
  PROXIMITY_RADIUS,
  MAX_FREQUENCY,
  MAX_SCALE,
} from "@/lib/content";

gsap.registerPlugin(ScrollTrigger);

const MAX_CHROMA = 3; // px — max feOffset dx at full proximity

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
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

  const handleMouseMove = useCallback((e: MouseEvent) => {
    HERO_LETTERS.forEach((_, i) => {
      const span = letterRefs.current[i];
      const turb = turbulenceRefs.current[i];
      const disp = displacementRefs.current[i];
      const chromaRed = chromaRedRefs.current[i];
      const chromaBlue = chromaBlueRefs.current[i];
      const proxy = letterProxies.current[i];
      if (!span || !turb || !disp) return;

      const rect = span.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const proximity = Math.max(0, 1 - dist / PROXIMITY_RADIUS);

      gsap.killTweensOf(proxy);

      if (proximity > 0) {
        gsap.to(proxy, {
          frequency: proximity * MAX_FREQUENCY,
          scale: proximity * MAX_SCALE,
          chroma: proximity * MAX_CHROMA,
          duration: 0.3,
          ease: "power2.out",
          onUpdate: () => {
            turb.setAttribute(
              "baseFrequency",
              `${proxy.frequency} ${proxy.frequency * 1.5}`
            );
            disp.setAttribute("scale", String(proxy.scale));
            chromaRed?.setAttribute("dx", String(-proxy.chroma));
            chromaBlue?.setAttribute("dx", String(proxy.chroma));
          },
        });
      } else {
        gsap.to(proxy, {
          frequency: 0,
          scale: 0,
          chroma: 0,
          duration: 1.8,
          ease: "elastic.out(0.4, 0.3)",
          onUpdate: () => {
            turb.setAttribute(
              "baseFrequency",
              `${proxy.frequency} ${proxy.frequency * 1.5}`
            );
            disp.setAttribute("scale", String(proxy.scale));
            chromaRed?.setAttribute("dx", String(-proxy.chroma));
            chromaBlue?.setAttribute("dx", String(proxy.chroma));
          },
        });
      }
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    HERO_LETTERS.forEach((_, i) => {
      const turb = turbulenceRefs.current[i];
      const disp = displacementRefs.current[i];
      const chromaRed = chromaRedRefs.current[i];
      const chromaBlue = chromaBlueRefs.current[i];
      const proxy = letterProxies.current[i];
      if (!turb || !disp) return;

      gsap.killTweensOf(proxy);
      gsap.to(proxy, {
        frequency: 0,
        scale: 0,
        chroma: 0,
        duration: 2.2,
        ease: "power2.inOut",
        onUpdate: () => {
          turb.setAttribute(
            "baseFrequency",
            `${proxy.frequency} ${proxy.frequency * 1.5}`
          );
          disp.setAttribute("scale", String(proxy.scale));
          chromaRed?.setAttribute("dx", String(-proxy.chroma));
          chromaBlue?.setAttribute("dx", String(proxy.chroma));
        },
      });
    });
  }, []);

  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;
    heroEl.addEventListener("mousemove", handleMouseMove);
    heroEl.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      heroEl.removeEventListener("mousemove", handleMouseMove);
      heroEl.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      heroTl
        .fromTo(
          ".hero-title",
          { opacity: 0, y: 60, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 2 }
        )
        .fromTo(
          ".hero-bleed-1",
          { opacity: 0, scale: 0.5 },
          { opacity: 1, scale: 1, duration: 3 },
          "-=1.5"
        )
        .fromTo(
          ".hero-bleed-2",
          { opacity: 0, scale: 0.3 },
          { opacity: 0.7, scale: 1, duration: 3.5 },
          "-=2.5"
        )
        .fromTo(
          ".hero-subtitle",
          { opacity: 0, y: 20 },
          { opacity: 0.6, y: 0, duration: 1.5 },
          "-=2"
        )
        .fromTo(
          ".hero-scroll-hint",
          { opacity: 0 },
          { opacity: 0.4, duration: 1 },
          "-=1"
        );

      gsap.to(".hero-title", {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
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
        delay: 2,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative h-screen flex items-center justify-center overflow-hidden bg-offwhite"
    >
      {/* Light bleeds */}
      <div
        className="hero-bleed-1 light-bleed"
        style={{ width: "60vw", height: "60vw", top: "-10%", right: "-15%" }}
      />
      <div
        className="hero-bleed-2 light-bleed"
        style={{
          width: "40vw",
          height: "40vw",
          bottom: "5%",
          left: "-10%",
          background:
            "radial-gradient(circle, rgba(232,224,208,0.5) 0%, transparent 70%)",
        }}
      />

      {/* Texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='t'%3E%3CfeTurbulence baseFrequency='0.65' numOctaves='3' type='fractalNoise'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23t)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* SVG filter defs — displacement + chromatic aberration, one of each per letter */}
      <svg
        aria-hidden="true"
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      >
        <defs>
          {/* Displacement filters */}
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

          {/* Chromatic aberration filters — R and B channels offset in opposite directions,
              G stays fixed. At rest all offsets are 0 so the filter is a visual no-op. */}
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
              {/* Red channel — isolated, shifted left */}
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

              {/* Blue channel — isolated, shifted right */}
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

              {/* Green channel — unshifted */}
              <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="green"
              />

              {/* Composite */}
              <feMerge>
                <feMergeNode in="redShift" />
                <feMergeNode in="green" />
                <feMergeNode in="blueShift" />
              </feMerge>
            </filter>
          ))}
        </defs>
      </svg>

      <div className="relative z-10 text-center px-4">
        <h1
          className="hero-title font-display leading-[0.85] tracking-[-0.04em] text-charcoal"
          style={{ fontSize: "clamp(6rem, 22vw, 20rem)", fontWeight: 300 }}
        >
          {HERO_LETTERS.map((letter, i) => (
            <span
              key={i}
              ref={(el) => { letterRefs.current[i] = el; }}
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
        <p className="hero-subtitle font-utility text-xs tracking-[0.3em] uppercase mt-8 text-charcoal">
          garments made visible
        </p>
      </div>

      {/* Corner labels */}
      <div className="absolute top-8 left-8">
        <span className="font-utility text-[0.6rem] tracking-[0.2em] uppercase text-charcoal/40">
          RAMA — 2025
        </span>
      </div>
      <div className="absolute top-8 right-8">
        <span className="font-utility text-[0.6rem] tracking-[0.2em] uppercase text-charcoal/40">
          Aotearoa
        </span>
      </div>

      {/* Scroll hint — line drains, chevron below orients without competing */}
      <div className="hero-scroll-hint absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div ref={scrollLineRef} className="w-[1px] h-12 bg-charcoal/30" />
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          overflow="visible"
          aria-hidden="true"
          className="opacity-[0.3]"
        >
          <path
            d="M1 1L5 5L9 1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}
