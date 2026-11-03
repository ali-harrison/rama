import Image from "next/image";
import type { CSSProperties } from "react";
import type { FloatShot } from "@/lib/content";

export function RegMarks() {
  return (
    <>
      <span aria-hidden="true" className="reg reg-tl" />
      <span aria-hidden="true" className="reg reg-tr" />
      <span aria-hidden="true" className="reg reg-bl" />
      <span aria-hidden="true" className="reg reg-br" />
    </>
  );
}

/**
 * On md+ shots float absolutely, snapped to grid columns, and drift at their own speed.
 * Below md they drop into a staggered two-up row after the chapter's text.
 */
interface FloatFrameProps {
  shots: FloatShot[];
  hideOnMobile?: boolean;
  eager?: boolean;
}

export function FloatFrame({ shots, hideOnMobile = false, eager = false }: FloatFrameProps) {
  const mobile = hideOnMobile
    ? "hidden"
    : "order-last flex flex-wrap items-start justify-center gap-x-[8%] px-6 pb-24";

  return (
    <div className={`${mobile} md:absolute md:inset-y-0 md:left-[var(--margin)] md:right-[var(--margin)] md:block md:p-0`}>
      {shots.map((shot, i) => (
        <figure
          key={shot.src}
          data-speed={shot.speed}
          className={`w-[46%] md:absolute md:mt-0 md:w-[var(--w)] md:px-3 ${i % 2 ? "mt-16" : ""}`}
          style={{ "--w": `${(shot.span / 12) * 100}%`, left: `${(shot.col / 12) * 100}%`, top: shot.top } as CSSProperties}
        >
          <div className="relative">
            <div data-reveal="image" className="relative overflow-hidden" style={{ aspectRatio: shot.ratio ?? "2/3" }}>
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                sizes="(max-width: 768px) 46vw, 25vw"
                loading={eager ? "eager" : "lazy"}
                className="graded object-cover"
              />
            </div>
            <RegMarks />
          </div>
          <figcaption className="mono-label mt-3 flex justify-between gap-3 opacity-60">
            <span className="shrink-0">{shot.fig}</span>
            <span className="text-right">{shot.caption}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
