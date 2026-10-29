import type { ComponentProps } from "react";
import { Search } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

const fieldBase =
  "w-full border border-neutral-200 bg-white text-neutral-900 transition-colors placeholder:text-neutral-500 focus:border-primary-400 focus:outline-none disabled:bg-neutral-50 disabled:text-neutral-300";

export const fieldClasses = cn(fieldBase, "h-11 rounded-md px-4 text-body");

const searchSizes = {
  md: {
    field: cn(fieldBase, "h-11 rounded-md pl-11 text-body"),
    icon: "left-4",
    kbd: "right-3 px-1.5 py-0.5 text-small",
    padRight: "pr-4",
    padRightWithShortcut: "pr-16",
  },
  /** Hero search. */
  lg: {
    field: cn(fieldBase, "h-16 rounded-md pl-13 text-body-lg shadow-sm sm:h-21 sm:pl-17 sm:text-xl"),
    icon: "left-5 size-6 sm:left-6",
    kbd: "right-5 hidden rounded-sm px-3 py-1.5 text-body-lg sm:block",
    padRight: "pr-6",
    padRightWithShortcut: "pr-6 sm:pr-28",
  },
};

type SearchInputProps = Omit<ComponentProps<"input">, "type" | "size"> & {
  /** Keyboard hint shown at the right, e.g. "⌘ K". */
  shortcut?: string;
  size?: keyof typeof searchSizes;
};

export function SearchInput({
  shortcut,
  size = "md",
  className,
  placeholder = "Search anything...",
  ...props
}: SearchInputProps) {
  const styles = searchSizes[size];
  return (
    <div className={cn("relative", className)}>
      <Icon
        icon={Search}
        className={cn(
          "pointer-events-none absolute top-1/2 -translate-y-1/2 text-neutral-700",
          styles.icon,
        )}
      />
      <input
        type="search"
        placeholder={placeholder}
        className={cn(styles.field, shortcut ? styles.padRightWithShortcut : styles.padRight)}
        {...props}
      />
      {shortcut && (
        <kbd
          className={cn(
            "pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-xs border border-neutral-200 bg-neutral-50 font-sans font-medium text-neutral-700",
            styles.kbd,
          )}
        >
          {shortcut}
        </kbd>
      )}
    </div>
  );
}
