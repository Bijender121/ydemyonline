import type { ComponentProps } from "react";
import { Search } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

export const fieldClasses =
  "h-11 w-full rounded-md border border-neutral-200 bg-white px-4 text-body text-neutral-900 transition-colors placeholder:text-neutral-500 focus:border-primary-400 focus:outline-none disabled:bg-neutral-50 disabled:text-neutral-300";

type SearchInputProps = Omit<ComponentProps<"input">, "type"> & {
  /** Keyboard hint shown at the right, e.g. "⌘ K". */
  shortcut?: string;
};

export function SearchInput({
  shortcut,
  className,
  placeholder = "Search anything...",
  ...props
}: SearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <Icon
        icon={Search}
        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-neutral-700"
      />
      <input
        type="search"
        placeholder={placeholder}
        className={cn(fieldClasses, "pl-11", shortcut && "pr-16")}
        {...props}
      />
      {shortcut && (
        <kbd className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 rounded-xs border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 font-sans text-small font-medium text-neutral-700">
          {shortcut}
        </kbd>
      )}
    </div>
  );
}
