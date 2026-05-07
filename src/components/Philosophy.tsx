"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MANIFESTO_LINES } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger);

export function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        labelRef.current,
        { opacity: 0, x: -20 },
        {
          opacity: 0.7,
          x: 0,
          duration: 0.6,
          scrollTrigger: {
            trigger: labelRef.current,
            start: "top 90%",
            once: true,
          },
        }
      );

      lineRefs.current.forEach((line) => {
        if (!line) return;
        gsap.fromTo(
          line,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: line,
              start: "top 85%",
              end: "top 60%",
              scrub: 1,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="philosophy"
      ref={sectionRef}
      className="relative py-32 md:py-48 px-6 bg-shadow"
    >
      <div className="max-w-3xl mx-auto">
        <span
          ref={labelRef}
          className="label-raw text-linen block mb-16"
        >
          Philosophy — what we believe
        </span>

        <div className="space-y-1">
          {MANIFESTO_LINES.map((line, i) =>
            line === "" ? (
              <div key={i} className="h-8" />
            ) : (
              <p
                key={i}
                ref={(el) => { lineRefs.current[i] = el; }}
                className={getLineClass(line)}
                style={getLineStyle(line)}
              >
                {line}
              </p>
            )
          )}
        </div>
      </div>

      {/* Decorative rule */}
      <div className="absolute bottom-0 left-[15%] right-[15%] h-[1px] bg-linen/10" />
    </section>
  );
}

function getLineClass(line: string): string {
  if (line.startsWith("RAMA")) {
    // Phase 4.1: keep weight 600 + italic, amber removed
    return "font-display leading-relaxed text-3xl md:text-5xl italic";
  }
  if (line.startsWith("Not ")) {
    // Phase 4.2: quiet interruption — small, faded, Space Mono margin note
    return "font-utility leading-relaxed";
  }
  if (
    line === "Every thread-end a small refusal" ||
    line === "to pretend this was born finished."
  ) {
    // Phase 4.1: give the strong prose lines more room
    return "font-display leading-relaxed text-2xl md:text-4xl lg:text-6xl";
  }
  return "font-display leading-relaxed text-xl md:text-3xl";
}

function getLineStyle(line: string): React.CSSProperties {
  if (line.startsWith("RAMA")) {
    // Phase 4.1: linen only — colour emphasis removed
    return { color: "#E8E0D0", fontWeight: 600 };
  }
  if (line.startsWith("Not ")) {
    // Phase 4.2: tiny, faded, Space Mono — margin note register
    return {
      color: "#E8E0D0",
      opacity: 0.6,
      fontSize: "0.7rem",
      letterSpacing: "0.2em",
    };
  }
  return { color: "#E8E0D0", fontWeight: 300 };
}
