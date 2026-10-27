import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-1 text-body text-neutral-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-3">
              {item.href && !isLast ? (
                <Link href={item.href} className="transition-colors hover:text-neutral-900">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className={cn(isLast && "text-neutral-700")}>
                  {item.label}
                </span>
              )}
              {!isLast && <Icon icon={ChevronRight} className="size-4" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
