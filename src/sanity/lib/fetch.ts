import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { ClientReturn, QueryParams } from "next-sanity";

import { client } from "./client";

/**
 * Cached GROQ fetch. Content stays cached until the Sanity webhook
 * (`/api/revalidate`) invalidates the "sanity" tag or a document type tag.
 */
export async function sanityFetch<const Query extends string>({
  query,
  params = {},
  tags = [],
}: {
  query: Query;
  params?: QueryParams;
  tags?: string[];
}): Promise<ClientReturn<Query, unknown>> {
  "use cache";
  cacheLife("max");
  cacheTag("sanity", ...tags);
  return client.fetch(query, params);
}
