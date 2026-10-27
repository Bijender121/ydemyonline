import { ExternalLink, FileText } from "lucide-react";
import { CardSurface } from "@/components/cards/card";
import { Icon } from "@/components/ui/icon";

type ResourceCardProps = {
  href: string;
  title: string;
  description: string;
  /** e.g. "PDF" */
  type: string;
  /** e.g. "1.2 MB" */
  size?: string;
};

export function ResourceCard({ href, title, description, type, size }: ResourceCardProps) {
  return (
    <CardSurface className="relative transition-shadow hover:shadow-md">
      <div className="flex gap-3">
        <Icon icon={FileText} className="size-6 text-neutral-700" />
        <div className="min-w-0">
          <h3 className="text-body font-medium text-neutral-900">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="after:absolute after:inset-0 focus-visible:outline-none"
            >
              {title}
            </a>
          </h3>
          <p className="mt-1 text-small text-neutral-500">{description}</p>
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between pt-6 text-small text-neutral-500">
        <span>
          {type}
          {size && (
            <>
              {" "}
              <span aria-hidden="true">·</span> {size}
            </>
          )}
        </span>
        <Icon icon={ExternalLink} className="size-4 text-primary-500" />
      </div>
    </CardSurface>
  );
}
