import Link from "next/link";
import type { ReactNode } from "react";
import { ChartNoAxesColumnIncreasing, Clock, Folder } from "lucide-react";
import { CardSurface } from "@/components/cards/card";
import { Icon } from "@/components/ui/icon";

type CourseCardProps = {
  href: string;
  title: string;
  summary: string;
  /** Course icon tile content, e.g. an <Image> or a letter. */
  icon: ReactNode;
  level: string;
  duration: string;
  moduleCount: number;
};

export function CourseCard({ href, title, summary, icon, level, duration, moduleCount }: CourseCardProps) {
  return (
    <CardSurface className="relative transition-shadow hover:shadow-md">
      <div className="flex gap-3">
        <div className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-xs bg-neutral-900 text-body-lg font-medium text-white">
          {icon}
        </div>
        <div className="min-w-0">
          <h3 className="text-body font-medium text-neutral-900">
            <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
              {title}
            </Link>
          </h3>
          <p className="mt-1 text-small text-neutral-500">{summary}</p>
        </div>
      </div>
      <dl className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-6 text-small text-neutral-500">
        <div className="flex items-center gap-1.5">
          <dt className="sr-only">Level</dt>
          <Icon icon={ChartNoAxesColumnIncreasing} className="size-3.5 text-neutral-700" />
          <dd>{level}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <dt className="sr-only">Duration</dt>
          <Icon icon={Clock} className="size-3.5 text-neutral-700" />
          <dd>{duration}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <dt className="sr-only">Modules</dt>
          <Icon icon={Folder} className="size-3.5 text-neutral-700" />
          <dd>
            {moduleCount} {moduleCount === 1 ? "module" : "modules"}
          </dd>
        </div>
      </dl>
    </CardSurface>
  );
}
