import { cn } from "@/lib/cn";

type LogoProps = {
  withWordmark?: boolean;
  size?: "md" | "lg";
  className?: string;
};

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("text-primary-500", className ?? "size-6")}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M1.5 2.5h21L12 22.5 1.5 2.5Zm7 0L12 9.5l3.5-7h-7Z"
      />
    </svg>
  );
}

export function Logo({ withWordmark = true, size = "md", className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark className={size === "lg" ? "size-7 sm:size-8" : undefined} />
      {withWordmark && (
        <span
          className={cn(
            "font-semibold tracking-tight text-neutral-900",
            size === "lg" ? "text-heading-3 sm:text-heading-2 sm:font-medium" : "text-heading-3",
          )}
        >
          Vertex
        </span>
      )}
    </span>
  );
}
