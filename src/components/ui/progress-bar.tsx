import { cn } from "@/lib/cn";

type ProgressBarProps = {
  /** 0–100 */
  value: number;
  showLabel?: boolean;
  className?: string;
};

export function ProgressBar({ value, showLabel = false, className }: ProgressBarProps) {
  const percent = Math.round(Math.min(100, Math.max(0, value)));
  return (
    <div className={cn("flex items-center gap-6", className)}>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label={`${percent}% complete`}
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-100"
      >
        <div
          className="h-full rounded-full bg-primary-500 transition-[width]"
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <span className="shrink-0 text-body text-neutral-500">
          <span className="font-medium text-neutral-900">{percent}%</span> complete
        </span>
      )}
    </div>
  );
}
