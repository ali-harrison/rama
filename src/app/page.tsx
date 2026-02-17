"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const HERO_LETTERS = ["R", "A", "M", "A"] as const;
const PROXIMITY_RADIUS = 250;
const MAX_FREQUENCY = 0.035;
const MAX_SCALE = 30;

const MARQUEE_TEXT =
  "RAW SERIES — 06.25 — AOTEAROA — GARMENTS MADE VISIBLE — RAMA — ";
// Parallax speeds per card: subtle depth, max ±30px
const PARALLAX_SPEEDS = [-15, -28, -20, -30]; // px travel (not percent)
const PARALLAX_SCRUBS = [1.6, 1.0, 1.3, 0.8]; // scrub values

gsap.registerPlugin(ScrollTrigger);

const GARMENTS = [
  {
    title: "unfinished Jacket",
    label: "01 — outerwear",
    fabric: "raw linen / exposed selvedge",
    image:
      "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&q=80",
  },
  {
    title: "seam Trouser",
    label: "02 — bottoms",
    fabric: "undyed cotton twill",
    image:
      "https://images.unsplash.com/photo-1528459105426-b9548367069b?w=600&q=80",
  },
  {
    title: "WARP shirt",
    label: "03 — shirting",
    fabric: "handwoven khadi",
    image:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80",
  },
  {
    title: "fold Coat",
    label: "04 — layering",
    fabric: "washed hemp canvas",
    image:
      "https://images.unsplash.com/photo-1649937408746-4d2f603f91c8?q=80&w=926&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const MANIFESTO_LINES = [
  "We don't hide the making.",
  "Every seam is a decision left visible.",
  "Every thread-end a small refusal",
  "to pretend this was born finished.",
  "",
  "RAMA is light —",
  "the kind that shows what's really there.",
  "Not perfection. presence.",
  "",
  "These garments carry the workshop",
  "in their bones. They age.",
  "They soften. They remember",
  "every wear.",
];

const PROCESS_STEPS = [
  {
    number: "i",
    title: "Source",
    text: "Fibres chosen before they're refined. We work with what the earth offers — unbleached, undyed, unapologetic. Each bolt carries the memory of its field.",
  },
  {
    number: "ii",
    title: "Cut",
    text: "Patterns laid by hand on studio floors. No digital nesting, no optimization. The fabric decides where the scissors go. Waste becomes pocket linings.",
  },
  {
    number: "iii",
    title: "Construct",
    text: "Seams left open where tradition says to close them. Thread tension kept slightly loose — deliberate slack that lets the garment breathe and move with the body, not against it.",
  },
  {
    number: "iv",
    title: "Finish",
    text: "There is no finish. Each garment leaves the workshop in a state of becoming. The wearer completes it. Creases, fades, repairs — these are not damage. They are authorship.",
  },
];

export default function Home() {
  const grainCanvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const philosophyRef = useRef<HTMLDivElement>(null);
  const collectionRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const processCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const marqueeRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  // Per-letter distortion refs
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const turbulenceRefs = useRef<(SVGFETurbulenceElement | null)[]>([]);
  const displacementRefs = useRef<(SVGFEDisplacementMapElement | null)[]>([]);
  const letterProxies = useRef(
    HERO_LETTERS.map(() => ({ frequency: 0, scale: 0 }))
  );

  useEffect(() => {
    // --- FILM GRAIN ---
    const canvas = grainCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const resize = () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        let animFrame: number;
        const renderGrain = () => {
          const w = canvas.width;
          const h = canvas.height;
          const imageData = ctx.createImageData(w, h);
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            const v = Math.random() * 255;
            data[i] = v;
            data[i + 1] = v;
            data[i + 2] = v;
            data[i + 3] = 255;
          }
          ctx.putImageData(imageData, 0, 0);
          animFrame = requestAnimationFrame(renderGrain);
        };
        renderGrain();

        return () => {
          cancelAnimationFrame(animFrame);
          window.removeEventListener("resize", resize);
        };
      }
    }
  }, []);

  // --- CURSOR PROXIMITY DISTORTION ---
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    HERO_LETTERS.forEach((_, i) => {
      const span = letterRefs.current[i];
      const turb = turbulenceRefs.current[i];
      const disp = displacementRefs.current[i];
      const proxy = letterProxies.current[i];
      if (!span || !turb || !disp) return;

      const rect = span.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Normalise: 1 at center, 0 at radius edge
      const proximity = Math.max(0, 1 - dist / PROXIMITY_RADIUS);
      const targetFreq = proximity * MAX_FREQUENCY;
      const targetScale = proximity * MAX_SCALE;

      // Kill any existing tween on this proxy to avoid fights
      gsap.killTweensOf(proxy);

      if (proximity > 0) {
        // Snap toward target quickly when cursor is close
        gsap.to(proxy, {
          frequency: targetFreq,
          scale: targetScale,
          duration: 0.3,
          ease: "power2.out",
          onUpdate: () => {
            turb.setAttribute(
              "baseFrequency",
              `${proxy.frequency} ${proxy.frequency * 1.5}`
            );
            disp.setAttribute("scale", String(proxy.scale));
          },
        });
      } else {
        // Slow elastic ease back to rest
        gsap.to(proxy, {
          frequency: 0,
          scale: 0,
          duration: 1.8,
          ease: "elastic.out(0.4, 0.3)",
          onUpdate: () => {
            turb.setAttribute(
              "baseFrequency",
              `${proxy.frequency} ${proxy.frequency * 1.5}`
            );
            disp.setAttribute("scale", String(proxy.scale));
          },
        });
      }
    });
  }, []);

  // Mouse leave — ease everything back to 0
  const handleMouseLeave = useCallback(() => {
    HERO_LETTERS.forEach((_, i) => {
      const turb = turbulenceRefs.current[i];
      const disp = displacementRefs.current[i];
      const proxy = letterProxies.current[i];
      if (!turb || !disp) return;

      gsap.killTweensOf(proxy);
      gsap.to(proxy, {
        frequency: 0,
        scale: 0,
        duration: 2.2,
        ease: "power2.inOut",
        onUpdate: () => {
          turb.setAttribute(
            "baseFrequency",
            `${proxy.frequency} ${proxy.frequency * 1.5}`
          );
          disp.setAttribute("scale", String(proxy.scale));
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
      // --- HERO ANIMATIONS ---
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

      // Parallax on hero
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

      // --- PHILOSOPHY: line-by-line reveal ---
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

      // Section label reveals
      gsap.utils.toArray<HTMLElement>(".section-label").forEach((label) => {
        gsap.fromTo(
          label,
          { opacity: 0, x: -20 },
          {
            opacity: 0.7,
            x: 0,
            duration: 0.6,
            scrollTrigger: {
              trigger: label,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // --- MARQUEE ---
      if (marqueeRef.current) {
        const track = marqueeRef.current.querySelector(
          ".marquee-track"
        ) as HTMLElement;
        if (track) {
          // Set will-change for GPU compositing
          gsap.set(track, { willChange: "transform" });
          gsap.to(track, {
            xPercent: -50, // slide the first half out, second half takes its place
            duration: 40,
            ease: "none",
            repeat: -1,
          });
        }
      }

      // --- COLLECTION CARDS ---
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 80,
            rotate: i % 2 === 0 ? -1.5 : 1.5,
          },
          {
            opacity: 1,
            y: 0,
            rotate: i % 2 === 0 ? -0.5 : 0.8,
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

      // --- COLLECTION IMAGE PARALLAX ---
      imageRefs.current.forEach((img, i) => {
        if (!img) return;
        const card = cardRefs.current[i];
        if (!card) return;
        // Scale: breathe into view from 1.05 → 1
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
        // Y-shift: subtle depth in pixels, not percent
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

      // --- PROCESS STEPS ---
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

      // --- CTA ---
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <canvas ref={grainCanvasRef} id="grain-canvas" />

      {/* ======================== HERO ======================== */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: "#F5F0E8" }}
      >
        {/* Light bleeds */}
        <div
          className="hero-bleed-1 light-bleed"
          style={{
            width: "60vw",
            height: "60vw",
            top: "-10%",
            right: "-15%",
          }}
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

        {/* SVG filter definitions — one per letter */}
        <svg
          aria-hidden="true"
          style={{
            position: "absolute",
            width: 0,
            height: 0,
            overflow: "hidden",
          }}
        >
          <defs>
            {HERO_LETTERS.map((_, i) => (
              <filter
                key={i}
                id={`warp-${i}`}
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
                colorInterpolationFilters="sRGB"
              >
                <feTurbulence
                  ref={(el) => {
                    turbulenceRefs.current[i] = el;
                  }}
                  type="turbulence"
                  baseFrequency="0 0"
                  numOctaves="3"
                  seed={i * 42 + 7}
                  result="noise"
                />
                <feDisplacementMap
                  ref={(el) => {
                    displacementRefs.current[i] = el;
                  }}
                  in="SourceGraphic"
                  in2="noise"
                  scale="0"
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </filter>
            ))}
          </defs>
        </svg>

        <div className="relative z-10 text-center px-4">
          <h1
            className="hero-title font-display leading-[0.85] tracking-[-0.04em]"
            style={{
              fontSize: "clamp(6rem, 22vw, 20rem)",
              color: "#2C2C2C",
              fontWeight: 300,
            }}
          >
            {HERO_LETTERS.map((letter, i) => (
              <span
                key={i}
                ref={(el) => {
                  letterRefs.current[i] = el;
                }}
                style={{
                  display: "inline-block",
                  filter: `url(#warp-${i})`,
                  willChange: "filter",
                }}
              >
                {letter}
              </span>
            ))}
          </h1>
          <p
            className="hero-subtitle font-utility text-xs tracking-[0.3em] uppercase mt-8"
            style={{ color: "#2C2C2C" }}
          >
            garments made visible
          </p>
        </div>

        {/* Nav hint */}
        <div className="absolute top-8 left-8">
          <span
            className="font-utility text-[0.6rem] tracking-[0.2em] uppercase"
            style={{ color: "#2C2C2C", opacity: 0.4 }}
          >
            RAMA — 2025
          </span>
        </div>
        <div className="absolute top-8 right-8">
          <span
            className="font-utility text-[0.6rem] tracking-[0.2em] uppercase"
            style={{ color: "#2C2C2C", opacity: 0.4 }}
          >
            Aotearoa
          </span>
        </div>

        {/* Scroll hint */}
        <div className="hero-scroll-hint absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div
            className="w-[1px] h-12"
            style={{ backgroundColor: "#2C2C2C", opacity: 0.3 }}
          />
          <span
            className="font-utility text-[0.55rem] tracking-[0.25em] uppercase"
            style={{ color: "#2C2C2C" }}
          >
            scroll
          </span>
        </div>
      </section>

      {/* ======================== MARQUEE ======================== */}
      <div
        ref={marqueeRef}
        className="overflow-hidden py-4"
        style={{ backgroundColor: "#DDD5C3" }}
      >
        <div className="marquee-track flex whitespace-nowrap">
          {/* Repeat text enough times for seamless loop (2 copies, each long) */}
          {[0, 1].map((half) => (
            <span
              key={half}
              className="font-utility text-[0.65rem] tracking-[0.25em] uppercase shrink-0"
              style={{ color: "#2C2C2C", opacity: 0.55 }}
            >
              {Array.from({ length: 8 })
                .map(() => MARQUEE_TEXT)
                .join("")}
            </span>
          ))}
        </div>
      </div>

      {/* ======================== PHILOSOPHY ======================== */}
      <section
        ref={philosophyRef}
        className="relative py-32 md:py-48 px-6"
        style={{ backgroundColor: "#1A1A1A" }}
      >
        <div className="max-w-3xl mx-auto">
          <span
            className="section-label label-raw block mb-16"
            style={{ color: "#E8E0D0" }}
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
                  ref={(el) => {
                    lineRefs.current[i] = el;
                  }}
                  className={`font-display leading-relaxed ${
                    line.startsWith("RAMA")
                      ? "text-3xl md:text-5xl italic"
                      : line.startsWith("Not ")
                        ? "text-lg md:text-2xl font-utility tracking-wide"
                        : "text-xl md:text-3xl"
                  }`}
                  style={{
                    color: line.startsWith("RAMA") ? "#C4863A" : "#E8E0D0",
                    fontWeight: line.startsWith("RAMA") ? 600 : 300,
                  }}
                >
                  {line}
                </p>
              )
            )}
          </div>
        </div>

        {/* Decorative line */}
        <div
          className="absolute bottom-0 left-[15%] right-[15%] h-[1px]"
          style={{ backgroundColor: "#E8E0D0", opacity: 0.1 }}
        />
      </section>

      {/* ======================== COLLECTION ======================== */}
      <section
        ref={collectionRef}
        className="relative py-32 md:py-48 px-6"
        style={{ backgroundColor: "#F5F0E8" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-baseline justify-between mb-20 flex-wrap gap-4">
            <h2
              className="section-label font-display text-6xl md:text-8xl lg:text-[9rem] leading-none"
              style={{ color: "#2C2C2C", fontWeight: 300 }}
            >
              collection
            </h2>
            <span className="label-raw section-label">SS—25 / raw series</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 md:gap-y-24">
            {GARMENTS.map((garment, i) => (
              <div
                key={i}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className={`relative ${i % 2 !== 0 ? "md:mt-16" : ""}`}
              >
                {/* Image with grain overlay + parallax */}
                <div className="relative overflow-hidden border-raw aspect-[3/4]">
                  <img
                    ref={(el) => {
                      imageRefs.current[i] = el;
                    }}
                    src={garment.image}
                    alt={garment.title}
                    className="absolute inset-0 w-full h-[120%] object-cover grayscale-[30%] contrast-[1.1] will-change-transform"
                    style={{ top: "-10%" }}
                    loading="lazy"
                  />
                  <div className="card-grain absolute inset-0 mix-blend-overlay" />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to bottom, transparent 60%, rgba(26,26,26,0.3))",
                    }}
                  />
                </div>

                {/* Label block — intentionally offset */}
                <div
                  className="mt-4 pl-1"
                  style={{ marginLeft: i % 2 === 0 ? "-2px" : "8px" }}
                >
                  <span className="label-raw block mb-1">{garment.label}</span>
                  <h3
                    className="font-display text-2xl md:text-3xl"
                    style={{ color: "#2C2C2C", fontWeight: 400 }}
                  >
                    {garment.title}
                  </h3>
                  <span
                    className="font-utility text-[0.65rem] tracking-wider block mt-1"
                    style={{ color: "#C4863A" }}
                  >
                    {garment.fabric}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== PROCESS ======================== */}
      <section
        ref={processRef}
        className="relative py-32 md:py-48 px-6"
        style={{ backgroundColor: "#2C2C2C" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-6">
            <div>
              <span
                className="section-label label-raw block mb-4"
                style={{ color: "#E8E0D0" }}
              >
                Process — the workshop
              </span>
              <h2
                className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9]"
                style={{ color: "#E8E0D0", fontWeight: 300 }}
              >
                how it&apos;s
                <br />
                <span style={{ color: "#C4863A" }}>unmade</span>
              </h2>
            </div>
            <p
              className="font-utility text-[0.7rem] leading-relaxed max-w-xs"
              style={{ color: "#E8E0D0", opacity: 0.5 }}
            >
              We show the labour. Not as performance, but as truth. Every
              garment carries the marks of the hands that shaped it.
            </p>
          </div>

          <div className="space-y-16 md:space-y-24">
            {PROCESS_STEPS.map((step, i) => (
              <div
                key={i}
                ref={(el) => {
                  processCardRefs.current[i] = el;
                }}
                className="grid grid-cols-[auto_1fr] gap-6 md:gap-12 items-start"
              >
                <span
                  className="font-display text-4xl md:text-6xl italic"
                  style={{ color: "#C4863A", opacity: 0.4, fontWeight: 300 }}
                >
                  {step.number}
                </span>
                <div
                  className="pt-2 border-t"
                  style={{ borderColor: "rgba(232,224,208,0.15)" }}
                >
                  <h3
                    className="font-display text-2xl md:text-4xl mb-4"
                    style={{ color: "#E8E0D0", fontWeight: 400 }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="font-utility text-xs md:text-sm leading-relaxed max-w-lg"
                    style={{ color: "#E8E0D0", opacity: 0.6 }}
                  >
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== CTA ======================== */}
      <section
        className="relative py-32 md:py-48 px-6"
        style={{ backgroundColor: "#F5F0E8" }}
      >
        <div ref={ctaRef} className="max-w-xl mx-auto text-center">
          <span className="label-raw block mb-6">Contact — lookbook</span>
          <h2
            className="font-display text-4xl md:text-6xl mb-4 leading-[0.95]"
            style={{ color: "#2C2C2C", fontWeight: 300 }}
          >
            request the
            <br />
            <em style={{ color: "#C4863A" }}>lookbook</em>
          </h2>
          <p
            className="font-utility text-[0.7rem] leading-relaxed mb-12"
            style={{ color: "#2C2C2C", opacity: 0.5 }}
          >
            A printed edition, unbound. Mailed in raw muslin.
            <br />
            Leave your address and we&apos;ll send one when the next run is
            ready.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-4 items-end max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="your@email.com"
              className="input-raw flex-1"
            />
            <button
              type="submit"
              className="font-utility text-[0.7rem] tracking-[0.2em] uppercase px-6 py-3 border-raw transition-colors duration-500 hover:bg-charcoal hover:text-offwhite cursor-pointer whitespace-nowrap"
              style={{ color: "#2C2C2C" }}
            >
              Request
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="max-w-6xl mx-auto mt-32 pt-8 border-t flex flex-wrap justify-between gap-4"
          style={{ borderColor: "rgba(44,44,44,0.15)" }}
        >
          <span
            className="font-utility text-[0.6rem] tracking-[0.15em] uppercase"
            style={{ color: "#2C2C2C", opacity: 0.3 }}
          >
            RAMA — Aotearoa, 2025
          </span>
          <span
            className="font-utility text-[0.6rem] tracking-[0.15em]"
            style={{ color: "#2C2C2C", opacity: 0.3 }}
          >
            garments made visible
          </span>
        </div>
      </section>
    </>
  );
}
