import type { LucideIcon, LucideProps } from "lucide-react";
import { CirclePlay, Clock, FileText, Search } from "lucide-react";
import { cn } from "@/lib/cn";

type IconProps = Omit<LucideProps, "ref"> & {
  icon: LucideIcon;
  variant?: "outline" | "filled";
};

/** Outlined circle with a solid play triangle, as used on "Watch" actions. */
export function PlayCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinejoin="round"
      className={cn("size-4 shrink-0", className)}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m10 8 6 4-6 4V8Z" fill="currentColor" />
    </svg>
  );
}

/** Solid circle with a white play triangle (lucide draws its triangle under the circle). */
function FilledPlayCircle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("size-5 shrink-0", className)}>
      <circle cx="12" cy="12" r="11" fill="currentColor" />
      <path d="m10 8 6 4-6 4V8Z" fill="white" stroke="white" strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  );
}

/** Inner detail that must stay visible once the outer shape is filled. */
const filledDetail = new Map<LucideIcon, string>([
  [Clock, "[&>path]:stroke-white"],
  [FileText, "[&>path:not(:first-child)]:fill-none [&>path:not(:first-child)]:stroke-white"],
  [Search, "[&>circle]:fill-none"],
]);

/** Lucide icon on the 24px grid, 2px stroke. `filled` fills the shape with the current color. */
export function Icon({
  icon: Glyph,
  variant = "outline",
  className,
  ...props
}: IconProps) {
  const filled = variant === "filled";
  if (filled && Glyph === CirclePlay) return <FilledPlayCircle className={className} />;
  return (
    <Glyph
      aria-hidden="true"
      strokeWidth={filled && Glyph === Search ? 3 : 2}
      fill={filled ? "currentColor" : "none"}
      className={cn("size-5 shrink-0", filled && filledDetail.get(Glyph), className)}
      {...props}
    />
  );
}
