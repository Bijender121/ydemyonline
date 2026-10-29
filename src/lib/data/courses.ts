import "server-only";

import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/fetch";
import { COURSE_QUERY, COURSES_QUERY } from "@/sanity/queries";
import type { COURSE_QUERY_RESULT } from "../../../sanity.types";

export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

export type CourseSummary = {
  slug: string;
  title: string;
  summary: string;
  icon: { src: string; alt: string } | null;
  level: CourseLevel;
  durationSeconds: number;
  moduleCount: number;
  popular: boolean;
  studentCount: number | null;
  price: number | null;
};

export type CourseDetail = NonNullable<COURSE_QUERY_RESULT>;

const LEVEL_LABELS = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
} as const satisfies Record<string, CourseLevel>;

export function levelLabel(level: keyof typeof LEVEL_LABELS): CourseLevel {
  return LEVEL_LABELS[level];
}

type CoverImage = { asset?: { _ref: string }; alt?: string };

/** Square icon tile URL for a course cover, or null when no image is uploaded. */
export function courseIcon(cover: CoverImage | null | undefined, title: string, size = 144) {
  if (!cover?.asset) return null;
  return { src: urlFor(cover).width(size).height(size).fit("crop").url(), alt: cover.alt ?? title };
}

export async function getCourses(): Promise<CourseSummary[]> {
  const courses = await sanityFetch({ query: COURSES_QUERY, tags: ["course"] });
  return courses.map((course) => ({
    slug: course.slug,
    title: course.title,
    summary: course.summary,
    icon: courseIcon(course.coverImage, course.title),
    level: levelLabel(course.level),
    durationSeconds: course.durationSeconds ?? 0,
    moduleCount: course.moduleCount,
    popular: course.popular ?? false,
    studentCount: course.studentCount,
    price: course.price,
  }));
}

export async function getCourse(slug: string): Promise<CourseDetail | null> {
  return sanityFetch({ query: COURSE_QUERY, params: { slug }, tags: ["course"] });
}
