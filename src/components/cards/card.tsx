import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Shared card surface: white, 1px neutral border, md radius, sm shadow. */
export function CardSurface({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-md border border-neutral-200 bg-white p-4 shadow-sm",
        className,
      )}
    >
      {children}
    </article>
  );
}
