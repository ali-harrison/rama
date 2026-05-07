"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROCESS_STEPS } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger);

export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const processCardRefs = useRef<(HTMLDivElement | null)[]>([]);

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

      processCardRefs.current.forEach((card) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              end: "top 55%",
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
      id="process"
      ref={sectionRef}
      className="relative py-32 md:py-48 px-6 bg-charcoal"
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-6">
          <div>
            <span
              ref={labelRef}
              className="label-raw text-linen block mb-4"
            >
              Process — the workshop
            </span>
            <h2
              className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] text-linen"
              style={{ fontWeight: 300 }}
            >
              how it&apos;s
              <br />
              <span className="text-amber">unmade</span>
            </h2>
          </div>
          <p className="font-utility text-[0.7rem] leading-relaxed max-w-xs text-linen/50">
            We show the labour. Not as performance, but as truth. Every
            garment carries the marks of the hands that shaped it.
          </p>
        </div>

        <div className="space-y-16 md:space-y-24">
          {PROCESS_STEPS.map((step, i) => (
            <div
              key={i}
              ref={(el) => { processCardRefs.current[i] = el; }}
              className="grid grid-cols-[auto_1fr] gap-6 md:gap-12 items-start"
            >
              <span
                className="font-display text-4xl md:text-6xl italic text-amber/40"
                style={{ fontWeight: 300 }}
              >
                {step.number}
              </span>
              <div
                className="pt-2 border-t"
                style={{ borderColor: "rgba(232,224,208,0.15)" }}
              >
                <h3
                  className="font-display text-2xl md:text-4xl mb-4 text-linen"
                  style={{ fontWeight: 400 }}
                >
                  {step.title}
                </h3>
                {/* Phase 4.3: opacity raised from 0.6 to 0.75 — the writing earns legibility */}
                <p className="font-utility text-xs md:text-sm leading-relaxed max-w-lg text-linen/75">
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
