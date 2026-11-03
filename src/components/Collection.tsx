import Image from "next/image";
import { GARMENTS } from "@/lib/content";
import { Chapter } from "./Chapter";
import { RegMarks } from "./FloatImage";

// Each card spans three grid columns; offsets and drift keep the row from reading as a shelf
const OFFSETS = ["md:mt-0", "mt-16 md:mt-36", "md:mt-14", "mt-16 md:mt-48"] as const;
const SPEEDS = [-24, -56, -36, -70] as const;

export function Collection() {
  return (
    <Chapter id="collection" className="px-[var(--margin)] pb-40 pt-36 md:pb-56 md:pt-44">
      <header className="relative z-10 mx-auto flex max-w-[44rem] flex-col items-center text-center">
        <p data-reveal="script" className="script">raw series 07</p>
        <h2 data-reveal="lines" className="caps-heading">
          Four garments.
          <br />
          Nothing hidden.
        </h2>
        <p data-reveal="fade" className="caps-body mt-6 max-w-[23rem] opacity-80">
          Midday is the honest light. No shadow to hide in — just cloth, cut and thread.
        </p>
      </header>

      <div className="relative z-10 mt-20 grid grid-cols-2 md:mt-28 md:grid-cols-12">
        {GARMENTS.map((garment, i) => (
          <article
            key={garment.title}
            data-speed={SPEEDS[i]}
            className={`group px-2 md:col-span-3 md:px-3 ${OFFSETS[i]}`}
          >
            <div className="relative">
              <div data-reveal="image" className="relative aspect-[3/4] overflow-hidden bg-[#ECE8E0]">
                <Image
                  src={garment.image}
                  alt={garment.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="graded object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                />
              </div>
              <RegMarks />
            </div>

            <div className="mono-label mt-4 flex justify-between gap-2 opacity-60">
              <span>{garment.label}</span>
              <span className="hidden md:inline">fig. {String(i + 6).padStart(2, "0")}</span>
            </div>
            <h3 className="mt-2 text-[1.05rem] uppercase tracking-[0.02em]">{garment.title}</h3>
            <p className="mono-label mt-1 opacity-60 transition-opacity duration-500 group-hover:opacity-100">
              {garment.fabric}
            </p>
          </article>
        ))}
      </div>
    </Chapter>
  );
}
