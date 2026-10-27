import { cn } from "@/lib/cn";

export type BadgeKind = "video" | "lesson" | "popular";

const kinds: Record<BadgeKind, { label: string; className: string }> = {
  video: { label: "Video", className: "bg-video-soft text-video" },
  lesson: { label: "Lesson", className: "bg-lesson-soft text-lesson" },
  popular: { label: "Popular", className: "bg-primary-100 text-primary-500" },
};

export function Badge({ kind, className }: { kind: BadgeKind; className?: string }) {
  const { label, className: tone } = kinds[kind];
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-xs px-2 text-small font-semibold tracking-wider uppercase",
        tone,
        className,
      )}
    >
      {label}
    </span>
  );
}
