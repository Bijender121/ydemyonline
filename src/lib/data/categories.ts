import "server-only";

import { sanityFetch } from "@/sanity/lib/fetch";
import { CATEGORIES_QUERY } from "@/sanity/queries";
import type { CATEGORIES_QUERY_RESULT } from "../../../sanity.types";

export type Category = CATEGORIES_QUERY_RESULT[number];

export async function getCategories(): Promise<Category[]> {
  return sanityFetch({ query: CATEGORIES_QUERY, tags: ["category"] });
}
