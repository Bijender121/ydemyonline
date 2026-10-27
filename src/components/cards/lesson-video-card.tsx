import { CardSurface } from "@/components/cards/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayCircleIcon } from "@/components/ui/icon";
import { formatTimestamp } from "@/lib/time";

type LessonVideoCardProps = {
  /** Lesson page URL; the start second is appended as `?t=`. */
  href: string;
  title: string;
  description: string;
  /** e.g. "Lesson 5.1" */
  lessonLabel: string;
  /** Clip length in seconds. */
  durationSeconds: number;
  /** Matched moment in the video. */
  startSeconds: number;
};

export function LessonVideoCard({
  href,
  title,
  description,
  lessonLabel,
  durationSeconds,
  startSeconds,
}: LessonVideoCardProps) {
  const start = Math.floor(startSeconds);
  return (
    <CardSurface>
      <Badge kind="video" className="self-start" />
      <h3 className="mt-3 text-body font-medium text-neutral-900">{title}</h3>
      <p className="mt-2 text-small text-neutral-500">{description}</p>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4 text-small text-neutral-500">
        <span>
          {lessonLabel} <span aria-hidden="true">·</span> {formatTimestamp(durationSeconds)}
        </span>
        <Button variant="text" href={`${href}?t=${start}`} size="sm">
          <PlayCircleIcon />
          Watch from {formatTimestamp(start)}
        </Button>
      </div>
    </CardSurface>
  );
}
