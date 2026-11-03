// Cutting-mat grid: 12 columns, every third line heavier. Below md only the
// heavy lines show, leaving a 4-column mat.
export function GridLines() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[1]">
      <div className="absolute inset-y-0 left-[var(--margin)] right-[var(--margin)]">
        {Array.from({ length: 13 }, (_, i) => (
          <span
            key={i}
            className={`gridline ${i % 3 === 0 ? "gridline-major" : "hidden md:block"}`}
            style={{ left: i === 12 ? "calc(100% - 1px)" : `${(i / 12) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
}
