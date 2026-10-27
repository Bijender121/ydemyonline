import type { LucideIcon } from "lucide-react";
import { CircleCheck, CirclePlay, LoaderCircle, Lock } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

export type StatusKind = "in-progress" | "completed" | "now-playing" | "locked";

const statuses: Record<
  StatusKind,
  { label: string; icon: LucideIcon; iconClass: string; filled?: boolean }
> = {
  "in-progress": { label: "In Progress", icon: LoaderCircle, iconClass: "text-primary-500" },
  completed: { label: "Completed", icon: CircleCheck, iconClass: "text-success" },
  "now-playing": {
    label: "Now Playing",
    icon: CirclePlay,
    iconClass: "text-primary-500",
    filled: true,
  },
  locked: { label: "Locked", icon: Lock, iconClass: "text-neutral-700" },
};

type StatusProps = {
  status: StatusKind;
  /** Hide the text label; it stays available to screen readers. */
  iconOnly?: boolean;
  className?: string;
};

export function Status({ status, iconOnly = false, className }: StatusProps) {
  const { label, icon, iconClass, filled } = statuses[status];
  return (
    <span className={cn("inline-flex items-center gap-2 text-body text-neutral-900", className)}>
      <Icon
        icon={icon}
        variant={filled ? "filled" : "outline"}
        className={cn("size-4", iconClass)}
      />
      <span className={cn(iconOnly && "sr-only")}>{label}</span>
    </span>
  );
}
