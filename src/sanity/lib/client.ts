import "server-only";
import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";
import { readToken } from "./token";

// The dataset is private, so every read is server side with the read token.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
  token: readToken,
});
