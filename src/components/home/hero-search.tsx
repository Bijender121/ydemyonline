"use client";

import { useEffect, useRef } from "react";
import { SearchInput } from "@/components/ui/input";

/** Plain GET form to /search, so it works without JS; ⌘K / Ctrl+K focuses it. */
export function HeroSearch({ className }: { className?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <form action="/search" method="get" role="search" className={className}>
      <SearchInput
        ref={inputRef}
        name="q"
        size="lg"
        shortcut="⌘ K"
        required
        aria-label="Search your learning"
        placeholder="Ask anything about your learning..."
      />
    </form>
  );
}
