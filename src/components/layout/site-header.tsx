import { Suspense } from "react";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { Bell, User } from "lucide-react";
import { SiteNav } from "@/components/layout/site-nav";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

const avatarSize = "size-9 sm:size-13";

/** Shown while auth resolves, so the header doesn't shift. */
function AvatarPlaceholder() {
  return (
    <span
      role="img"
      aria-label="Account"
      className={`inline-flex ${avatarSize} items-center justify-center rounded-full bg-neutral-100 text-neutral-500 ring-1 ring-neutral-200`}
    >
      <Icon icon={User} className="size-5 sm:size-6" />
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="flex h-18 items-center justify-between gap-2 border-b border-neutral-200/70 px-4 sm:h-24 sm:px-10">
      <SiteNav />
      <div className="flex shrink-0 items-center gap-1 sm:gap-6">
        {/* Presentational until notifications exist. */}
        <button
          type="button"
          aria-label="Notifications"
          className="inline-flex size-9 items-center justify-center rounded-full text-neutral-700 sm:size-10 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-primary-400"
        >
          <Icon icon={Bell} className="size-6" />
        </button>
        <Suspense fallback={<AvatarPlaceholder />}>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button variant="secondary" size="sm" className="h-9 sm:h-11">
                Sign in
              </Button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserButton appearance={{ elements: { avatarBox: avatarSize } }} />
          </Show>
        </Suspense>
      </div>
    </header>
  );
}
