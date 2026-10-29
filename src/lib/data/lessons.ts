import "server-only";

import { sanityFetch } from "@/sanity/lib/fetch";
import { LESSON_QUERY } from "@/sanity/queries";
import type { LESSON_QUERY_RESULT } from "../../../sanity.types";

type LessonResult = NonNullable<LESSON_QUERY_RESULT>;
type LessonLink = NonNullable<LessonResult["course"]>["modules"][number]["lessons"][number];

export type LessonDetail = LessonResult & {
  /** 1-based, derived from order in the parent course. Null when no course uses the lesson. */
  moduleNumber: number | null;
  lessonNumber: number | null;
  moduleTitle: string | null;
  previous: LessonLink | null;
  next: LessonLink | null;
};

export async function getLesson(slug: string): Promise<LessonDetail | null> {
  const lesson = await sanityFetch({ query: LESSON_QUERY, params: { slug }, tags: ["lesson", "course"] });
  if (!lesson) return null;

  const courseModules = lesson.course?.modules ?? [];
  const ordered = courseModules.flatMap((item) => item.lessons);
  const index = ordered.findIndex((item) => item._id === lesson._id);
  const moduleIndex = courseModules.findIndex((m) => m.lessons.some((item) => item._id === lesson._id));
  const current = courseModules[moduleIndex];

  return {
    ...lesson,
    moduleNumber: current ? moduleIndex + 1 : null,
    lessonNumber: current ? current.lessons.findIndex((item) => item._id === lesson._id) + 1 : null,
    moduleTitle: current?.title ?? null,
    previous: index > 0 ? ordered[index - 1] : null,
    next: index >= 0 && index < ordered.length - 1 ? ordered[index + 1] : null,
  };
}
