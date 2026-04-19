/* eslint-disable no-console */
import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const ALEX_ID = '9d0f03de-9495-4e3b-886a-f3b4a7af5b38';
const ALEX_NAME = 'Alex Chen';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '1ir3sv5r',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const DRY_RUN = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--force');

type DocRef = { _id: string; _type: string; title?: string };

async function main() {
  if (!process.env.SANITY_API_TOKEN) {
    console.error('✗ SANITY_API_TOKEN is not set in .env.local');
    console.error('  Create an Editor/Admin token at https://sanity.io/manage/project/1ir3sv5r/api');
    process.exit(1);
  }

  const alex = await client.fetch<{ _id: string; name: string; slug?: { current?: string } } | null>(
    `*[_type == "author" && _id == $id][0]{ _id, name, slug }`,
    { id: ALEX_ID },
  );

  if (!alex) {
    console.log(`ℹ  No author with _id ${ALEX_ID}. Nothing to do.`);
    return;
  }

  if (alex.name !== ALEX_NAME) {
    console.error(
      `✗ Safety check failed: author at ${ALEX_ID} is "${alex.name}", not "${ALEX_NAME}". Aborting.`,
    );
    process.exit(1);
  }

  console.log(`✓ Found target: ${alex.name} (${alex._id})`);

  // Find everything that references Alex — reviews, news, drafts of either.
  const referencing = await client.fetch<DocRef[]>(
    `*[references($id)]{ _id, _type, title }`,
    { id: ALEX_ID },
  );

  if (referencing.length > 0) {
    console.log(`\n⚠  ${referencing.length} document(s) still reference Alex:`);
    for (const d of referencing) {
      console.log(`   · [${d._type}] ${d._id}  ${d.title ?? ''}`);
    }
    if (!FORCE) {
      console.log(
        `\nSanity's strong references will block the delete. Rerun with --force to also delete these documents:\n  pnpm delete:alex -- --force`,
      );
      console.log('Or reassign them to another author in Sanity Studio first, then rerun without --force.');
      process.exit(referencing.length > 0 ? 1 : 0);
    }
    if (DRY_RUN) {
      console.log(`\n--dry-run set. Would delete ${referencing.length} referencing doc(s) + Alex.`);
      return;
    }
    console.log('\nDeleting referencing documents + their drafts…');
    for (const d of referencing) {
      const idsToDelete = [d._id, d._id.startsWith('drafts.') ? null : `drafts.${d._id}`].filter(
        Boolean,
      ) as string[];
      for (const id of idsToDelete) {
        try {
          await client.delete(id);
          console.log(`   ✓ deleted ${id}`);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          if (msg.includes('Document not found')) continue;
          console.warn(`   ⚠ could not delete ${id}: ${msg}`);
        }
      }
    }
  }

  if (DRY_RUN) {
    console.log('\n--dry-run set. Would delete Alex now. Rerun without --dry-run to apply.');
    return;
  }

  // Delete both the published doc and any draft.
  const ids = [ALEX_ID, `drafts.${ALEX_ID}`];
  for (const id of ids) {
    try {
      await client.delete(id);
      console.log(`✓ deleted ${id}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('Document not found')) continue;
      console.warn(`⚠ could not delete ${id}: ${msg}`);
    }
  }

  const remaining = await client.fetch<Array<{ _id: string; name: string }>>(
    `*[_type == "author"]|order(name asc){ _id, name }`,
  );
  console.log('\nRemaining authors:');
  for (const a of remaining) console.log(`  · ${a.name}  (${a._id})`);
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
