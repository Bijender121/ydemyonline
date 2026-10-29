import "server-only";

import { sanityFetch } from "@/sanity/lib/fetch";
import { INSTRUCTOR_QUERY } from "@/sanity/queries";
import type { INSTRUCTOR_QUERY_RESULT } from "../../../sanity.types";

export type InstructorDetail = NonNullable<INSTRUCTOR_QUERY_RESULT>;

export async function getInstructor(slug: string): Promise<InstructorDetail | null> {
  return sanityFetch({ query: INSTRUCTOR_QUERY, params: { slug }, tags: ["instructor", "course"] });
}
