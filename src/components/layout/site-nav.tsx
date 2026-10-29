"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/cn";

const links = [
  { href: "/courses", label: "Courses" },
  { href: "/my-learning", label: "My Learning" },
];

export function SiteNav({ className }: { className?: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className={cn("flex items-center gap-4 sm:gap-16", className)}>
      <Link href="/" aria-label="Vertex home">
        <Logo size="lg" />
      </Link>
      <ul className="flex items-center gap-3 sm:gap-11">
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "whitespace-nowrap text-body sm:text-body-lg transition-colors hover:text-primary-500",
                  active ? "text-primary-500" : "text-neutral-900",
                )}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
