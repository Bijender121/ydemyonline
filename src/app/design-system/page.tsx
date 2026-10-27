import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  Bell,
  Bookmark,
  ChartNoAxesColumnIncreasing,
  ChevronRight,
  CirclePlay,
  Clock,
  Eye,
  FileText,
  LayoutGrid,
  PersonStanding,
  Search,
  Target,
  User,
  type LucideIcon,
} from "lucide-react";
import { CourseCard } from "@/components/cards/course-card";
import { LessonCard } from "@/components/cards/lesson-card";
import { LessonVideoCard } from "@/components/cards/lesson-video-card";
import { ResourceCard } from "@/components/cards/resource-card";
import { SiteNav } from "@/components/layout/site-nav";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button, type ButtonVariant } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { SearchInput } from "@/components/ui/input";
import { LogoMark } from "@/components/ui/logo";
import { Pagination } from "@/components/ui/pagination";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Select } from "@/components/ui/select";
import { Status } from "@/components/ui/status";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Design System · Vertex",
};

const primaryColors = [
  { name: "Primary 500", hex: "#F97316", className: "bg-primary-500" },
  { name: "Primary 400", hex: "#FB923C", className: "bg-primary-400" },
  { name: "Primary 300", hex: "#FDBA74", className: "bg-primary-300" },
  { name: "Primary 200", hex: "#FED7AA", className: "bg-primary-200" },
  { name: "Primary 100", hex: "#FFEEE5", className: "bg-primary-100" },
];

const neutralColors = [
  { name: "Neutral 900", hex: "#0F172A", className: "bg-neutral-900" },
  { name: "Neutral 700", hex: "#334155", className: "bg-neutral-700" },
  { name: "Neutral 500", hex: "#64748B", className: "bg-neutral-500" },
  { name: "Neutral 300", hex: "#CBD5E1", className: "bg-neutral-300" },
  { name: "Neutral 200", hex: "#E2E8F0", className: "bg-neutral-200" },
  { name: "Neutral 100", hex: "#F1F5F9", className: "bg-neutral-100" },
  { name: "Neutral 50", hex: "#FAFAFC", className: "bg-neutral-50 border border-neutral-200" },
  { name: "White", hex: "#FFFFFF", className: "bg-white border border-neutral-200" },
];

const typeScale = [
  { style: "Display 1", className: "font-display text-body-lg font-bold", font: "Playfair Display", size: "48 / 56", weight: "Bold", use: "Page titles" },
  { style: "Display 2", className: "font-display text-body-lg font-bold", font: "Playfair Display", size: "36 / 44", weight: "Bold", use: "Section titles" },
  { style: "Heading 1", className: "font-semibold", font: "Inter", size: "28 / 36", weight: "Semi Bold", use: "Card titles" },
  { style: "Heading 2", className: "font-semibold", font: "Inter", size: "22 / 30", weight: "Semi Bold", use: "Sub section" },
  { style: "Heading 3", className: "font-medium", font: "Inter", size: "18 / 26", weight: "Medium", use: "Small titles" },
  { style: "Body Large", className: "", font: "Inter", size: "16 / 24", weight: "Regular", use: "Body copy" },
  { style: "Body", className: "", font: "Inter", size: "14 / 20", weight: "Regular", use: "Supporting text" },
  { style: "Small", className: "", font: "Inter", size: "12 / 16", weight: "Regular", use: "Captions, meta" },
];

const spacing = [
  { px: 4, rem: "0.25rem", className: "size-1" },
  { px: 8, rem: "0.5rem", className: "size-2" },
  { px: 12, rem: "0.75rem", className: "size-3" },
  { px: 16, rem: "1rem", className: "size-4" },
  { px: 24, rem: "1.5rem", className: "size-6" },
  { px: 32, rem: "2rem", className: "size-8" },
  { px: 40, rem: "2.5rem", className: "size-10" },
  { px: 48, rem: "3rem", className: "size-12" },
  { px: 64, rem: "4rem", className: "size-16" },
];

const radii = [
  { label: "4px", name: "xs", className: "rounded-xs" },
  { label: "8px", name: "sm", className: "rounded-sm" },
  { label: "12px", name: "md", className: "rounded-md" },
  { label: "16px", name: "lg", className: "rounded-lg" },
  { label: "24px", name: "xl", className: "rounded-xl" },
  { label: "Full", name: "circle", className: "rounded-full" },
];

const shadows = [
  { name: "Sm", value: "0 1px 2px 0", rgba: "rgba(15, 23, 42, 0.05)", className: "shadow-sm" },
  { name: "Md", value: "0 4px 12px -2px", rgba: "rgba(15, 23, 42, 0.08)", className: "shadow-md" },
  { name: "Lg", value: "0 12px 24px -4px", rgba: "rgba(15, 23, 42, 0.10)", className: "shadow-lg" },
  { name: "Xl", value: "0 20px 40px -8px", rgba: "rgba(15, 23, 42, 0.12)", className: "shadow-xl" },
];

const icons: LucideIcon[] = [Bell, Search, CirclePlay, FileText, Bookmark, ChartNoAxesColumnIncreasing, Clock, User, ChevronRight];

const buttonColumns: Array<{ variant: ButtonVariant; label: string; text: string }> = [
  { variant: "primary", label: "Primary", text: "Get Started" },
  { variant: "secondary", label: "Secondary", text: "Explore Courses" },
  { variant: "tertiary", label: "Tertiary", text: "View Lesson" },
  { variant: "text", label: "Text", text: "Watch Video" },
];

/** Static hover look for the sheet's "Hover" row. */
const hoverLook: Record<ButtonVariant, string> = {
  primary: "bg-primary-600!",
  secondary: "bg-primary-100! border-primary-500!",
  tertiary: "border-neutral-300! bg-neutral-50!",
  text: "text-primary-600!",
};

const principles = [
  { icon: Eye, title: "Clarity First", text: "Every element should communicate clearly." },
  { icon: LayoutGrid, title: "Consistency", text: "Use components and patterns consistently across the platform." },
  { icon: Target, title: "Focus & Calm", text: "Remove noise and help learners focus on what matters." },
  { icon: PersonStanding, title: "Accessible", text: "Design with accessibility and inclusivity in mind." },
];

function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <section className={cn("rounded-lg border border-neutral-100 bg-white p-5 shadow-sm sm:p-6", className)}>
      {children}
    </section>
  );
}

function SectionTitle({ index, children }: { index: string; children: ReactNode }) {
  return (
    <h2 className="mb-5 flex items-center gap-4 text-small font-semibold tracking-[0.12em] text-neutral-900 uppercase">
      <span className="text-primary-500">{index}</span>
      {children}
    </h2>
  );
}

function Label({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("mb-3 text-small text-neutral-700", className)}>{children}</p>;
}

function Specs({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-6">
      <Label className="mb-2">{title}</Label>
      <ul className="list-disc space-y-1 pl-5 text-small text-neutral-500 marker:text-neutral-300">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <main className="flex-1 bg-canvas px-4 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 lg:grid-cols-12">
        {/* Intro + 01 Colors */}
        <Panel className="grid gap-8 lg:col-span-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-0">
          <div className="lg:border-r lg:border-neutral-100 lg:pr-8">
            <div className="flex items-center gap-2">
              <LogoMark className="size-8" />
              <span className="text-heading-2 font-medium tracking-tight">Vertex</span>
            </div>
            <h1 className="mt-6 font-display text-display-2 sm:text-display-1">Design System</h1>
            <p className="mt-5 max-w-sm text-body-lg leading-7 text-neutral-700">
              A unified design language for Vertex learning platform. Clean, modern and focused on
              clarity, consistency and intuitive learning experiences.
            </p>
            <p className="mt-8 text-small tracking-wider text-neutral-700 uppercase">
              Version 1.0 <span aria-hidden="true">·</span> May 2025
            </p>
          </div>
          <div className="lg:pl-6">
            <SectionTitle index="01">Colors</SectionTitle>
            <Label>Primary</Label>
            <ul className="grid grid-cols-3 gap-4 sm:grid-cols-5">
              {primaryColors.map((c) => (
                <li key={c.name}>
                  <div className={cn("h-12 rounded-xs", c.className)} />
                  <p className="mt-2 text-small text-neutral-700">{c.name}</p>
                  <p className="text-small text-neutral-700">{c.hex}</p>
                </li>
              ))}
            </ul>
            <Label className="mt-6">Neutral</Label>
            <ul className="grid grid-cols-4 gap-4 sm:grid-cols-8">
              {neutralColors.map((c) => (
                <li key={c.name}>
                  <div className={cn("h-10 rounded-xs", c.className)} />
                  <p className="mt-2 text-small text-neutral-700">{c.name}</p>
                  <p className="text-small text-neutral-700">{c.hex}</p>
                </li>
              ))}
            </ul>
          </div>
        </Panel>

        {/* 02 Typography */}
        <Panel className="lg:col-span-5">
          <SectionTitle index="02">Typography</SectionTitle>
          <div className="space-y-6 py-2">
            <div className="flex items-center gap-10">
              <span className="w-20 font-display text-[3.5rem] leading-none">Ag</span>
              <div>
                <p className="font-display text-heading-2 font-normal">Playfair Display</p>
                <p className="mt-1 text-body text-neutral-500">
                  Elegant <Dot /> Readable <Dot /> Timeless
                </p>
              </div>
            </div>
            <div className="flex items-center gap-10">
              <span className="w-20 text-[3.5rem] leading-none font-medium">Ag</span>
              <div>
                <p className="text-heading-2 font-normal">Inter</p>
                <p className="mt-1 text-body text-neutral-500">
                  Clean <Dot /> Modern <Dot /> Highly legible
                </p>
              </div>
            </div>
          </div>
        </Panel>

        {/* 03 Type scale */}
        <Panel className="lg:col-span-7">
          <SectionTitle index="03">Type Scale</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-small">
              <thead className="text-neutral-700">
                <tr>
                  {["Style", "Font", "Size / Line Height", "Weight", "Use"].map((h) => (
                    <th key={h} scope="col" className="pb-3 font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-neutral-500">
                {typeScale.map((row) => (
                  <tr key={row.style}>
                    <th scope="row" className={cn("py-1 text-body font-normal text-neutral-900", row.className)}>
                      {row.style}
                    </th>
                    <td className="py-1">{row.font}</td>
                    <td className="py-1">{row.size}</td>
                    <td className="py-1">{row.weight}</td>
                    <td className="py-1">{row.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* 04 Spacing */}
        <Panel className="lg:col-span-6">
          <SectionTitle index="04">Spacing System</SectionTitle>
          <Label>Base unit: 4px</Label>
          <ul className="mt-8 grid grid-cols-5 gap-y-6 sm:grid-cols-9">
            {spacing.map((s) => (
              <li key={s.px} className="flex flex-col items-center gap-3">
                <div className="flex h-16 items-end">
                  <div className={cn("rounded-xs bg-primary-200/70", s.className)} />
                </div>
                <p className="text-center text-small text-neutral-700">
                  {s.px}
                  <br />
                  <span className="text-neutral-500">({s.rem})</span>
                </p>
              </li>
            ))}
          </ul>
        </Panel>

        {/* 05 Radius & Shadows */}
        <Panel className="lg:col-span-6">
          <SectionTitle index="05">Radius &amp; Shadows</SectionTitle>
          <Label>Radius</Label>
          <ul className="grid grid-cols-3 gap-4 sm:grid-cols-6">
            {radii.map((r) => (
              <li key={r.name} className="flex flex-col items-center gap-2">
                <div className={cn("size-10 border border-neutral-200 bg-white", r.className)} />
                <p className="text-center text-small text-neutral-700">
                  {r.label}
                  <br />({r.name})
                </p>
              </li>
            ))}
          </ul>
          <Label className="mt-6">Shadows</Label>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {shadows.map((s) => (
              <li key={s.name} className={cn("rounded-sm bg-white p-3", s.className)}>
                <p className="text-body text-neutral-900">{s.name}</p>
                <p className="mt-2 text-[0.625rem] leading-4 text-neutral-500">
                  {s.value}
                  <br />
                  {s.rgba}
                </p>
              </li>
            ))}
          </ul>
        </Panel>

        {/* 06–08: buttons size to content, icons and inputs share the rest */}
        <div className="grid grid-cols-1 gap-3 lg:col-span-12 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        {/* 06 Icons */}
        <Panel>
          <SectionTitle index="06">Icons</SectionTitle>
          <Label>Outline Style</Label>
          <ul className="grid grid-cols-9 gap-2 text-neutral-900">
            {icons.map((icon, i) => (
              <li key={i}>
                <Icon icon={icon} />
              </li>
            ))}
          </ul>
          <Label className="mt-6">Filled Style</Label>
          <ul className="grid grid-cols-9 gap-2 text-neutral-900">
            {icons.map((icon, i) => (
              <li key={i}>
                <Icon icon={icon} variant="filled" />
              </li>
            ))}
          </ul>
          <Specs
            title="Icon Specs"
            items={["24x24px grid", "2px stroke width (outline)", "Rounded line caps", "Consistent optical balance"]}
          />
        </Panel>

        {/* 07 Buttons */}
        <Panel>
          <SectionTitle index="07">Buttons</SectionTitle>
          <div className="overflow-x-auto">
            <div className="grid w-max grid-cols-[56px_repeat(4,max-content)] items-center gap-x-3 gap-y-3">
              <span />
              {buttonColumns.map((c) => (
                <span key={c.variant} className="text-small text-neutral-500">
                  {c.label}
                </span>
              ))}
              {(["Default", "Hover", "Disabled"] as const).map((state) => (
                <Row key={state} label={state}>
                  {buttonColumns.map((c) => (
                    <div key={c.variant}>
                      <Button
                        variant={c.variant}
                        withIcon
                        disabled={state === "Disabled"}
                        className={state === "Hover" ? hoverLook[c.variant] : undefined}
                      >
                        {c.text}
                      </Button>
                    </div>
                  ))}
                </Row>
              ))}
            </div>
          </div>
          <Specs
            title="Button Specs"
            items={["Height: 44px (default)", "Padding: 0 16px (lg), 0 12px (md)", "Radius: 12px", "Font: Inter Medium (14–16px)"]}
          />
        </Panel>

        {/* 08 Inputs */}
        <Panel>
          <SectionTitle index="08">Inputs</SectionTitle>
          <Label>Search / Text Input</Label>
          <SearchInput aria-label="Search" shortcut="⌘ K" />
          <Label className="mt-6">Select</Label>
          <Select
            aria-label="Sort by"
            defaultValue="relevant"
            options={[
              { value: "relevant", label: "Most Relevant" },
              { value: "newest", label: "Newest" },
            ]}
          />
          <Specs
            title="Field Specs"
            items={["Height: 44px", "Radius: 12px", "Border: 1px solid #E2E8F0", "Padding: 0 16px", "Focus: Border color #FB923C"]}
          />
        </Panel>
        </div>

        {/* 09 Badges */}
        <Panel className="lg:col-span-3">
          <SectionTitle index="09">Badges / Tags</SectionTitle>
          <div className="grid grid-cols-3 gap-4">
            {(["video", "lesson", "popular"] as const).map((kind) => (
              <div key={kind}>
                <Label className="capitalize">{kind}</Label>
                <Badge kind={kind} />
              </div>
            ))}
          </div>
        </Panel>

        {/* 10 Status */}
        <Panel className="lg:col-span-5">
          <SectionTitle index="10">Status / Indicators</SectionTitle>
          <div className="flex flex-wrap gap-x-4 gap-y-3 pt-2">
            <Status status="in-progress" />
            <Status status="completed" />
            <Status status="now-playing" />
            <Status status="locked" />
          </div>
        </Panel>

        {/* 11 Progress */}
        <Panel className="lg:col-span-4">
          <SectionTitle index="11">Progress Bar</SectionTitle>
          <ProgressBar value={35} showLabel className="pt-2" />
        </Panel>

        {/* 12 Cards */}
        <Panel className="lg:col-span-12">
          <SectionTitle index="12">Cards</SectionTitle>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <div className="flex flex-col">
              <Label>Course Card</Label>
              <CourseCard
                href="/courses/nextjs-for-production"
                title="Next.js for Production"
                summary="Build scalable, high-performance web applications with Next.js."
                icon="N"
                level="Intermediate"
                duration="18h 24m"
                moduleCount={12}
              />
            </div>
            <div className="flex flex-col">
              <Label>Lesson Card (Video)</Label>
              <LessonVideoCard
                href="/lessons/data-fetching-in-server-components"
                title="Data Fetching in Server Components"
                description="Learn how to fetch data on the server using async/await and Next.js best practices."
                lessonLabel="Lesson 5.1"
                durationSeconds={765}
                startSeconds={765}
              />
            </div>
            <div className="flex flex-col">
              <Label>Lesson Card (Lesson)</Label>
              <LessonCard
                href="/lessons/data-fetching-and-caching"
                title="Data Fetching & Caching"
                description="Explore different data fetching methods in Next.js and how to cache and revalidate data for optimal performance."
                moduleLabel="Module 5"
              />
            </div>
            <div className="flex flex-col">
              <Label>Resource Card</Label>
              <ResourceCard
                href="https://nextjs.org/docs/app/guides/caching"
                title="Caching and Revalidation Guide"
                description="Deep dive into Next.js caching strategies."
                type="PDF"
                size="1.2 MB"
              />
            </div>
          </div>
        </Panel>

        {/* 13 Navigation + 14 Principles */}
        <Panel className="lg:col-span-12">
          <div className="grid gap-8 border-b border-neutral-100 pb-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)_minmax(0,0.7fr)] lg:gap-0">
            <div className="lg:border-r lg:border-neutral-100 lg:pr-6">
              <SectionTitle index="13">Navigation</SectionTitle>
              <SiteNav className="pl-2" />
            </div>
            <div className="lg:border-r lg:border-neutral-100 lg:px-8">
              <Label>Breadcrumbs</Label>
              <Breadcrumbs
                items={[
                  { label: "All Courses", href: "/courses" },
                  { label: "Next.js for Production", href: "/courses/nextjs-for-production" },
                  { label: "Data Fetching & Caching" },
                ]}
              />
            </div>
            <div className="lg:pl-8">
              <Label>Pagination</Label>
              <Pagination page={1} totalPages={8} hrefFor={(p) => `/design-system?page=${p}`} />
            </div>
          </div>
          <div className="grid gap-6 pt-6 sm:grid-cols-2 lg:grid-cols-[180px_repeat(4,minmax(0,1fr))] lg:items-center">
            <h2 className="flex items-center gap-4 text-small font-semibold tracking-[0.12em] text-neutral-900 uppercase sm:col-span-2 lg:col-span-1">
              <span className="text-primary-500">14</span>
              Principles
            </h2>
            {principles.map((p) => (
              <div key={p.title} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-50 text-neutral-700">
                  <Icon icon={p.icon} className="size-6" />
                </span>
                <div>
                  <p className="text-small font-medium text-neutral-900">{p.title}</p>
                  <p className="mt-1 text-small text-neutral-500">{p.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </main>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <span className="text-small text-neutral-900">{label}</span>
      {children}
    </>
  );
}

function Dot() {
  return (
    <span aria-hidden="true" className="mx-1 text-primary-500">
      •
    </span>
  );
}
