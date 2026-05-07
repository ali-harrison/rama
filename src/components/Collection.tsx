"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GARMENTS, PARALLAX_SPEEDS, PARALLAX_SCRUBS } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger);

// Resting rotations cards land on after scroll entrance
const RESTING_ROTATIONS = [-0.5, 0.8, -0.5, 0.8] as const;

export function Collection() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

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

      cardRefs.current.forEach((card, i) => {
        if (!card) return;

        gsap.fromTo(
          card,
          { opacity: 0, y: 80, rotate: i % 2 === 0 ? -1.5 : 1.5 },
          {
            opacity: 1,
            y: 0,
            rotate: RESTING_ROTATIONS[i],
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "top 55%",
              scrub: 1,
            },
          }
        );
      });

      imageRefs.current.forEach((img, i) => {
        if (!img) return;
        const card = cardRefs.current[i];
        if (!card) return;

        gsap.fromTo(
          img,
          { scale: 1.05 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: PARALLAX_SCRUBS[i],
            },
          }
        );

        gsap.to(img, {
          y: PARALLAX_SPEEDS[i],
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: PARALLAX_SCRUBS[i],
          },
        });
      });
    }, sectionRef);

    // Hover listeners — managed separately from GSAP context
    const eventCleanups: (() => void)[] = [];

    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const resting = RESTING_ROTATIONS[i];
      const fabricLabel = card.querySelector(".fabric-label") as HTMLElement | null;

      if (fabricLabel) gsap.set(fabricLabel, { opacity: 0.4, y: 4 });

      const onEnter = () => {
        gsap.to(card, { rotate: 0, scale: 1.01, duration: 0.6, ease: "power3.out" });
        if (fabricLabel) {
          gsap.to(fabricLabel, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
        }
      };

      const onLeave = () => {
        gsap.to(card, { rotate: resting, scale: 1, duration: 0.8, ease: "power3.out" });
        if (fabricLabel) {
          gsap.to(fabricLabel, { opacity: 0.4, y: 4, duration: 0.5, ease: "power2.out" });
        }
      };

      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mouseleave", onLeave);
      eventCleanups.push(() => {
        card.removeEventListener("mouseenter", onEnter);
        card.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => {
      ctx.revert();
      eventCleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <section
      id="collection"
      ref={sectionRef}
      className="relative py-32 md:py-48 px-6 bg-offwhite"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-baseline justify-between mb-20 flex-wrap gap-4">
          <h2
            className="font-display text-6xl md:text-8xl lg:text-[9rem] leading-none text-charcoal"
            style={{ fontWeight: 300 }}
          >
            collection
          </h2>
          <span ref={labelRef} className="label-raw text-charcoal">
            SS—25 / raw series
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 md:gap-y-24">
          {GARMENTS.map((garment, i) => (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el; }}
              className={`relative ${i % 2 !== 0 ? "md:mt-16" : ""}`}
            >
              <div className="relative overflow-hidden border-raw aspect-[3/4]">
                {/* Wrapper extends 20% beyond the card frame — gives parallax its travel room */}
                <div
                  ref={(el) => { imageRefs.current[i] = el; }}
                  className="absolute w-full will-change-transform"
                  style={{ top: "-10%", height: "120%" }}
                >
                  <Image
                    src={garment.image}
                    alt={garment.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover grayscale-[30%] contrast-[1.1]"
                    loading="lazy"
                  />
                </div>
                <div className="card-grain absolute inset-0 mix-blend-overlay" />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to bottom, transparent 60%, rgba(26,26,26,0.3))",
                  }}
                />
              </div>

              <div
                className="mt-4 pl-1"
                style={{ marginLeft: i % 2 === 0 ? "-2px" : "8px" }}
              >
                <span className="label-raw text-charcoal block mb-1">{garment.label}</span>
                <h3
                  className="font-display text-2xl md:text-3xl text-charcoal"
                  style={{ fontWeight: 400 }}
                >
                  {garment.title}
                </h3>
                <span className="fabric-label font-utility text-[0.65rem] tracking-wider block mt-1 text-amber">
                  {garment.fabric}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
