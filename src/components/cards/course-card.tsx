import Link from "next/link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ChartNoAxesColumnIncreasing, Clock, File, Folder } from "lucide-react";
import { CardSurface } from "@/components/cards/card";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

type CourseCardProps = {
  href: string;
  title: string;
  summary: string;
  /** Course icon tile content, e.g. an <Image> or a letter. */
  icon: ReactNode;
  level: string;
  duration: string;
  moduleCount: number;
  /** `compact` for lists and search; `tile` for the home and catalog grids. */
  layout?: "compact" | "tile";
};

export function CourseCard({
  href,
  title,
  summary,
  icon,
  level,
  duration,
  moduleCount,
  layout = "compact",
}: CourseCardProps) {
  const isTile = layout === "tile";
  const titleLink = (
    <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
      {title}
    </Link>
  );
  const meta = (
    <CourseMeta
      level={level}
      duration={duration}
      moduleCount={moduleCount}
      moduleIcon={isTile ? File : Folder}
      className={isTile ? "-mx-2 mt-auto flex-nowrap gap-x-2.5 border-t border-neutral-100 pt-5 text-[0.625rem]" : "mt-auto flex-wrap gap-x-3 gap-y-1 pt-6 text-small"}
    />
  );

  if (isTile) {
    return (
      <CardSurface className="relative w-full sm:min-h-90 rounded-lg border-neutral-100 px-6.5 pt-8 pb-6 transition-shadow focus-within:shadow-md hover:shadow-md">
        <div className="size-18 overflow-hidden rounded-md">{icon}</div>
        <h3 className="mt-6 font-display text-heading-2 font-medium text-neutral-900">{titleLink}</h3>
        <p className="mt-4 mb-8 text-body leading-6 text-neutral-500">{summary}</p>
        {meta}
      </CardSurface>
    );
  }

  return (
    <CardSurface className="relative transition-shadow hover:shadow-md">
      <div className="flex gap-3">
        <div className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-xs bg-neutral-900 text-body-lg font-medium text-white">
          {icon}
        </div>
        <div className="min-w-0">
          <h3 className="text-body font-medium text-neutral-900">{titleLink}</h3>
          <p className="mt-1 text-small text-neutral-500">{summary}</p>
        </div>
      </div>
      {meta}
    </CardSurface>
  );
}

type CourseMetaProps = {
  level: string;
  duration: string;
  moduleCount: number;
  moduleIcon: LucideIcon;
  className?: string;
};

function CourseMeta({ level, duration, moduleCount, moduleIcon, className }: CourseMetaProps) {
  return (
    <dl
      className={cn(
        "flex items-center whitespace-nowrap text-neutral-500",
        className,
      )}
    >
      <div className="flex items-center gap-1">
        <dt className="sr-only">Level</dt>
        <Icon icon={ChartNoAxesColumnIncreasing} className="size-3.5 text-neutral-700" />
        <dd>{level}</dd>
      </div>
      <div className="flex items-center gap-1">
        <dt className="sr-only">Duration</dt>
        <Icon icon={Clock} className="size-3.5 text-neutral-700" />
        <dd>{duration}</dd>
      </div>
      <div className="flex items-center gap-1">
        <dt className="sr-only">Modules</dt>
        <Icon icon={moduleIcon} className="size-3.5 text-neutral-700" />
        <dd>
          {moduleCount} {moduleCount === 1 ? "module" : "modules"}
        </dd>
      </div>
    </dl>
  );
}
