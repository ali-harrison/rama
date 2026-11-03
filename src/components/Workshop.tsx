import { PROCESS_STEPS, WORKSHOP_SHOTS } from "@/lib/content";
import { Chapter } from "./Chapter";
import { FloatFrame } from "./FloatImage";

export function Workshop() {
  return (
    <Chapter id="workshop" className="flex flex-col px-[var(--margin)] pb-36 pt-36 md:pb-52 md:pt-44">
      <FloatFrame shots={WORKSHOP_SHOTS} />

      <header className="relative z-10 mx-auto flex max-w-[44rem] flex-col items-center text-center">
        <p data-reveal="script" className="script">the workshop</p>
        <h2 data-reveal="lines" className="caps-heading">
          How it&apos;s unmade.
        </h2>
        <p data-reveal="fade" className="caps-body mt-6 max-w-[24rem] opacity-80">
          We show the labour. Not as performance, but as truth. Every garment carries the marks of
          the hands that shaped it.
        </p>
      </header>

      <ol className="relative z-10 mt-24 grid grid-cols-1 gap-y-14 sm:grid-cols-2 md:mt-40 md:grid-cols-12">
        {PROCESS_STEPS.map((step) => (
          <li key={step.number} data-reveal="fade" className="relative md:col-span-3">
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-ink/25">
              <span className="crosshair left-0" />
            </div>
            <div className="pl-3 pr-6 pt-6">
              <span className="mono-label opacity-60">{step.number}.</span>
              <h3 className="mt-2 text-xl uppercase tracking-[0.02em]">{step.title}</h3>
              <p className="mt-3 max-w-[18rem] text-[0.92rem] leading-relaxed opacity-80">
                {step.text}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Chapter>
  );
}
