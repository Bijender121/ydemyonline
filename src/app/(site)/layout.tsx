import { SiteHeader } from "@/components/layout/site-header";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="site-gutters flex flex-1 flex-col lg:px-[30px]">
      <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col overflow-hidden bg-canvas lg:border-x lg:border-neutral-200/70">
        <SiteHeader />
        {children}
      </div>
    </div>
  );
}
