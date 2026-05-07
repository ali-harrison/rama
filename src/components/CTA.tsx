"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
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

      // Phase 5.4: M1 line reveal — set before animate to avoid flash
      gsap.set(".cta-line", { y: "105%" });
      gsap.to(".cta-line", {
        y: "0%",
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 80%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="relative py-32 md:py-48 px-6 bg-offwhite"
    >
      {/* Phase 4.4: left-aligned — authority over sentiment */}
      <div ref={ctaRef} className="max-w-xl mx-auto">
        <span ref={labelRef} className="label-raw text-charcoal block mb-6">
          Contact — lookbook
        </span>

        {/* Phase 4.4: heading enlarged, tracking tightened */}
        <h2
          className="font-display text-5xl md:text-7xl mb-6 leading-[0.95] text-charcoal"
          style={{ fontWeight: 300, letterSpacing: "-0.02em" }}
        >
          <span className="overflow-hidden block">
            <span className="cta-line block">request the</span>
          </span>
          <span className="overflow-hidden block">
            <span className="cta-line block">
              <em className="text-amber">lookbook</em>
            </span>
          </span>
        </h2>

        {/* Phase 4.4: descriptor above the form — state the offer before the ask */}
        <p className="font-utility text-[0.85rem] leading-relaxed mb-10 text-charcoal/70">
          A printed edition, unbound. Mailed in raw muslin.
          <br />
          Leave your address and we&apos;ll send one when the next run is
          ready.
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row gap-4 items-end max-w-md"
        >
          <input
            type="email"
            placeholder="your@email.com"
            className="input-raw flex-1"
          />
          {/* Phase 4.4: text-only button, underline draws in on hover */}
          <button
            type="submit"
            className="btn-underline font-utility text-[0.75rem] tracking-[0.15em] uppercase text-charcoal cursor-pointer whitespace-nowrap"
          >
            Request the lookbook →
          </button>
        </form>
      </div>

      {/* Footer */}
      <div
        className="max-w-6xl mx-auto mt-32 pt-8 border-t border-charcoal/15 flex flex-wrap justify-between gap-4"
      >
        <span className="font-utility text-[0.6rem] tracking-[0.15em] uppercase text-charcoal/30">
          RAMA — Aotearoa, 2025
        </span>
        <span className="font-utility text-[0.6rem] tracking-[0.15em] text-charcoal/30">
          garments made visible
        </span>
      </div>
    </section>
  );
}
