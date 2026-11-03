import { MANIFESTO, MANIFESTO_SHOTS } from "@/lib/content";
import { Chapter } from "./Chapter";
import { FloatFrame } from "./FloatImage";

export function Manifesto() {
  return (
    <Chapter id="manifesto" className="flex min-h-[115svh] flex-col justify-center">
      <FloatFrame shots={MANIFESTO_SHOTS} />

      <div className="relative z-10 mx-auto flex w-full max-w-[44rem] flex-col items-center px-6 py-36 text-center">
        <p data-reveal="script" className="script">what we believe</p>
        <h2 data-reveal="lines" className="caps-heading max-w-[34rem]">
          {MANIFESTO.heading}
        </h2>
        <p data-reveal="words" className="caps-body mt-8 max-w-[25rem]">
          {MANIFESTO.body}
        </p>
        <p data-reveal="lines" className="caps-heading mt-20 max-w-[30rem] text-[clamp(1.2rem,2vw,1.75rem)]">
          {MANIFESTO.light}
        </p>
        <p data-reveal="fade" className="mono-label mt-6 opacity-60">
          {MANIFESTO.aside}
        </p>
      </div>
    </Chapter>
  );
}
