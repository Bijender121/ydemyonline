import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";
import { CourseCard } from "@/components/cards/course-card";
import { BarsBand } from "@/components/home/bars-band";
import { HeroSearch } from "@/components/home/hero-search";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { getCourses } from "@/lib/data/courses";
import { formatDuration } from "@/lib/time";

export default async function HomePage() {
  const courses = await getCourses();

  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center border-b border-neutral-200/70 px-4 pt-12 pb-12 text-center sm:px-13 sm:pt-17 sm:pb-14">
        <p className="rounded-sm border border-primary-200/70 bg-primary-100/50 px-3.5 py-2.5 text-[0.6875rem] leading-4 font-medium tracking-[0.2em] text-primary-500 uppercase">
          Intelligent Learning
        </p>
        <h1 className="mt-6 font-display text-[2.5rem] leading-[1.15] font-normal tracking-tight text-neutral-900 sm:text-[4rem] sm:leading-[4.5rem]">
          Search your learning
          <br className="hidden sm:block" /> in plain English.
        </h1>
        <p className="mt-5 max-w-[27rem] text-body-lg text-neutral-500 sm:mt-6 sm:max-w-[28rem] sm:text-xl sm:leading-8">
          Vertex understands what you want to learn and finds the exact lessons across all your
          courses.
        </p>
        <Button
          href="/courses"
          size="xl"
          className="mt-8 shadow-md sm:mt-9"
          trailing={<Icon icon={ArrowRight} />}
        >
          Explore Courses
        </Button>
        <HeroSearch className="mt-10 w-full max-w-[746px] sm:mt-11" />
      </section>

      {/* All courses */}
      <section aria-labelledby="all-courses" className="px-4 pt-10 sm:px-13 sm:pt-13">
        <div className="mx-auto max-w-[1040px]">
          <div className="flex items-center justify-between gap-4">
            <h2 id="all-courses" className="font-display text-heading-1 font-medium tracking-tight text-neutral-900">
              All Courses
            </h2>
            <Button
              href="/courses"
              variant="text"
              size="lg"
              trailing={<Icon icon={ArrowRight} className="size-4.5" />}
            >
              View all courses
            </Button>
          </div>
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <li key={course.slug} className="flex">
                <CourseCard
                  layout="tile"
                  href={`/courses/${course.slug}`}
                  title={course.title}
                  summary={course.summary}
                  icon={course.icon && <Image src={course.icon.src} alt={course.icon.alt} width={72} height={72} />}
                  level={course.level}
                  duration={formatDuration(course.durationSeconds)}
                  moduleCount={course.moduleCount}
                />
              </li>
            ))}
          </ul>

          <div className="mt-14 flex items-center gap-6 sm:mt-17">
            <span aria-hidden="true" className="h-px flex-1 bg-neutral-200/70" />
            <p className="flex items-center gap-4 text-body text-neutral-700 sm:text-body-lg">
              <Icon icon={Star} className="size-6 text-primary-500" strokeWidth={1.5} />
              New courses and lessons added every week.
            </p>
            <span aria-hidden="true" className="h-px flex-1 bg-neutral-200/70" />
          </div>
        </div>
      </section>

      <div className="mt-auto pt-10">
        <BarsBand />
      </div>
    </main>
  );
}
