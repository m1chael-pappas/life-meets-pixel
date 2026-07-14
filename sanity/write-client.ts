import { createClient } from "next-sanity";

// Server-only client with write access. Never import from client components:
// SANITY_API_TOKEN has no NEXT_PUBLIC_ prefix, so it only exists server-side.
export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});
