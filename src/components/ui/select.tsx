import type { ComponentProps } from "react";
import { ChevronDown } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { fieldClasses } from "@/components/ui/input";
import { cn } from "@/lib/cn";

type SelectProps = ComponentProps<"select"> & {
  options: Array<{ value: string; label: string }>;
};

export function Select({ options, className, ...props }: SelectProps) {
  return (
    <div className={cn("relative", className)}>
      <select
        className={cn(fieldClasses, "appearance-none pr-11 font-medium")}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Icon
        icon={ChevronDown}
        className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-neutral-700"
      />
    </div>
  );
}
