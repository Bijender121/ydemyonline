import { cn } from "@/lib/cn";

type LogoProps = {
  withWordmark?: boolean;
  className?: string;
};

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-6 text-primary-500", className)}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M1.5 2.5h21L12 22.5 1.5 2.5Zm7 0L12 9.5l3.5-7h-7Z"
      />
    </svg>
  );
}

export function Logo({ withWordmark = true, className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      {withWordmark && (
        <span className="text-heading-3 font-semibold tracking-tight text-neutral-900">
          Vertex
        </span>
      )}
    </span>
  );
}
