import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

type PaginationProps = {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
  className?: string;
};

/** Pages to show: first three, an ellipsis, the last page — sliding around the current page. */
function pageItems(page: number, total: number): Array<number | "ellipsis"> {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const start = Math.min(Math.max(page - 1, 1), total - 3);
  const items: Array<number | "ellipsis"> = [start, start + 1, start + 2];
  if (start > 1) items.unshift(1, ...(start > 2 ? (["ellipsis"] as const) : []));
  if (start + 2 < total - 1) items.push("ellipsis");
  if (start + 2 < total) items.push(total);
  return items;
}

const item =
  "inline-flex size-8 items-center justify-center rounded-sm text-body text-neutral-700 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-primary-400";

export function Pagination({ page, totalPages, hrefFor, className }: PaginationProps) {
  const prev = page > 1 ? hrefFor(page - 1) : undefined;
  const next = page < totalPages ? hrefFor(page + 1) : undefined;

  return (
    <nav aria-label="Pagination" className={cn("flex items-center gap-2", className)}>
      {prev ? (
        <Link href={prev} aria-label="Previous page" className={item}>
          <Icon icon={ChevronLeft} className="size-4" />
        </Link>
      ) : (
        <span aria-hidden="true" className={cn(item, "text-neutral-300 hover:bg-transparent")}>
          <Icon icon={ChevronLeft} className="size-4" />
        </span>
      )}
      {pageItems(page, totalPages).map((p, i) =>
        p === "ellipsis" ? (
          <span key={`e${i}`} className="inline-flex size-8 items-center justify-center text-neutral-500">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={hrefFor(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              item,
              p === page && "border border-primary-400 font-medium text-primary-500 hover:bg-primary-100",
            )}
          >
            {p}
          </Link>
        ),
      )}
      {next ? (
        <Link href={next} aria-label="Next page" className={item}>
          <Icon icon={ChevronRight} className="size-4" />
        </Link>
      ) : (
        <span aria-hidden="true" className={cn(item, "text-neutral-300 hover:bg-transparent")}>
          <Icon icon={ChevronRight} className="size-4" />
        </span>
      )}
    </nav>
  );
}
