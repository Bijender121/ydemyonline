import { cn } from "@/lib/cn";

/**
 * Decorative orange bars along the bottom of the home page. Each bar is
 * [left %, width %, height %, peak opacity] of the band, traced from the design.
 * The salmon tint is specific to this illustration, not a palette token.
 */
const bars: Array<[number, number, number, number]> = [
  [0, 7.5, 47, 0.75],
  [7.5, 6, 64, 0.8],
  [13.5, 4.2, 79, 0.85],
  [17.7, 5.8, 96, 0.55],
  [23.5, 9.2, 69, 0.75],
  [32.7, 5.1, 52, 0.7],
  [48.5, 3, 38, 0.3],
  [51.5, 8.7, 49, 0.8],
  [60.2, 8, 59, 0.75],
  [68.2, 5, 79, 0.75],
  [73.2, 6.3, 96, 0.8],
  [79.5, 5.2, 50, 0.7],
  [84.7, 3.9, 71, 0.85],
  [88.6, 11.4, 86, 0.75],
];

export function BarsBand({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none relative h-40 sm:h-[230px]", className)}>
      {bars.map(([left, width, height, opacity]) => (
        <div
          key={left}
          className="absolute bottom-0 bg-linear-to-t from-[#fca386] via-[#fcab8f] via-55% to-transparent blur-[2px]"
          style={{ left: `${left}%`, width: `${width}%`, height: `${height}%`, opacity: Math.min(1, opacity * 1.2) }}
        />
      ))}
    </div>
  );
}
