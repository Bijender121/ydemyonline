import { ExternalLink } from "lucide-react";
import { CardSurface } from "@/components/cards/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

type LessonCardProps = {
  href: string;
  title: string;
  description: string;
  /** e.g. "Module 5" */
  moduleLabel: string;
};

export function LessonCard({ href, title, description, moduleLabel }: LessonCardProps) {
  return (
    <CardSurface>
      <Badge kind="lesson" className="self-start" />
      <h3 className="mt-3 text-body font-medium text-neutral-900">{title}</h3>
      <p className="mt-2 text-small text-neutral-500">{description}</p>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4 text-small text-neutral-500">
        <span>{moduleLabel}</span>
        <Button
          variant="text"
          href={href}
          size="sm"
          trailing={<Icon icon={ExternalLink} className="size-4" />}
        >
          View lesson
        </Button>
      </div>
    </CardSurface>
  );
}
