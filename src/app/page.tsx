import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-canvas px-4 text-center">
      <Logo />
      <h1 className="font-display text-display-2">Vertex is being built</h1>
      <Button href="/design-system">View the design system</Button>
    </main>
  );
}
