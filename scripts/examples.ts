/**
 * Examples of programmatic Sanity operations
 *
 * These are example snippets - not meant to be run directly.
 * Copy and adapt them for your own scripts.
 */

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
});

// ==========================================
// CREATE Operations
// ==========================================

// Create a single document
async function createAuthor() {
  const author = await client.create({
    _type: 'author',
    name: 'John Doe',
    slug: { current: 'john-doe' },
    bio: 'Passionate gamer and reviewer',
  });
  console.log('Created author:', author._id);
}

// Create with a specific ID
async function createWithId() {
  await client.createIfNotExists({
    _type: 'author',
    _id: 'author-custom-id',
    name: 'Jane Smith',
    slug: { current: 'jane-smith' },
  });
}

// Create or replace (upsert)
async function upsertDocument() {
  await client.createOrReplace({
    _type: 'category',
    _id: 'category-action',
    title: 'Action',
    slug: { current: 'action' },
  });
}

// ==========================================
// READ Operations (GROQ Queries)
// ==========================================

// Fetch all documents of a type
async function fetchAllReviews() {
  const reviews = await client.fetch(`
    *[_type == "review"] | order(publishedAt desc) {
      _id,
      title,
      reviewScore,
      publishedAt
    }
  `);
  return reviews;
}

// Fetch with references
async function fetchReviewWithDetails() {
  const review = await client.fetch(`
    *[_type == "review" && slug.current == $slug][0] {
      _id,
      title,
      reviewScore,
      summary,
      author->{
        name,
        slug
      },
      reviewableItem->{
        title,
        itemType,
        coverImage
      }
    }
  `, { slug: 'hollow-knight-review' });
  return review;
}

// Fetch by ID
async function fetchById() {
  const doc = await client.getDocument('author-michael');
  return doc;
}

// ==========================================
// UPDATE Operations
// ==========================================

// Patch (update) a document
async function updateReviewScore() {
  await client
    .patch('review-id-here')
    .set({ reviewScore: 9.5 })
    .commit();
}

// Add item to array
async function addProToReview() {
  await client
    .patch('review-id-here')
    .setIfMissing({ pros: [] })
    .append('pros', ['Great soundtrack'])
    .commit();
}

// Update nested field
async function updateAuthorBio() {
  await client
    .patch('author-michael')
    .set({
      bio: 'Updated bio text',
      'socialLinks.twitter': 'https://twitter.com/newhandle'
    })
    .commit();
}

// Conditional update (only if condition is met)
async function incrementIfFeatured() {
  await client
    .patch('review-id')
    .inc({ viewCount: 1 })
    .commit();
}

// ==========================================
// DELETE Operations
// ==========================================

// Delete a single document
async function deleteDocument() {
  await client.delete('document-id-here');
}

// Delete multiple documents
async function deleteAllDrafts() {
  const drafts = await client.fetch<string[]>(`*[_id in path("drafts.**")]._id`);

  const transaction = client.transaction();
  drafts.forEach((id: string) => transaction.delete(id));
  await transaction.commit();
}

// ==========================================
// BULK Operations with Transactions
// ==========================================

// Create multiple documents atomically
async function bulkCreate() {
  const transaction = client.transaction();

  // Add multiple operations to transaction
  transaction.create({
    _type: 'author',
    name: 'Author 1',
    slug: { current: 'author-1' },
  });

  transaction.create({
    _type: 'author',
    name: 'Author 2',
    slug: { current: 'author-2' },
  });

  // Commit all at once (atomic)
  const result = await transaction.commit();
  console.log(`Created ${result.results.length} documents`);
}

// Mixed operations in one transaction
async function mixedTransaction() {
  const transaction = client.transaction();

  transaction
    .create({ _type: 'category', title: 'New Category' })
    .patch('existing-id', p => p.set({ featured: true }))
    .delete('old-document-id');

  await transaction.commit();
}

// ==========================================
// IMPORT from External Data
// ==========================================

// Import from JSON file
async function importFromJSON() {
  const fs = require('fs');
  const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));

  const transaction = client.transaction();

  data.reviews.forEach((review: any) => {
    transaction.create({
      _type: 'review',
      title: review.title,
      reviewScore: review.score,
      summary: review.summary,
      // Map your data structure to Sanity schema
    });
  });

  await transaction.commit();
}

// Import from CSV
async function importFromCSV() {
  const fs = require('fs');
  const csv = fs.readFileSync('./games.csv', 'utf-8');

  const lines = csv.split('\n').slice(1); // Skip header
  const transaction = client.transaction();

  lines.forEach((line: string) => {
    const [title, genre, platform, releaseDate] = line.split(',');

    transaction.create({
      _type: 'reviewableItem',
      itemType: 'videogame',
      title: title.trim(),
      slug: { current: title.toLowerCase().replace(/\s+/g, '-') },
      releaseDate,
    });
  });

  await transaction.commit();
}

// ==========================================
// MIGRATIONS
// ==========================================

// Migrate all documents to add a new field
async function addFieldToAllReviews() {
  const reviews = await client.fetch(`*[_type == "review"]._id`);

  const transaction = client.transaction();

  reviews.forEach((id: string) => {
    transaction.patch(id, p =>
      p.setIfMissing({ viewCount: 0 })
    );
  });

  await transaction.commit();
  console.log(`Updated ${reviews.length} reviews`);
}

// Rename a field across all documents
async function renameField() {
  const docs = await client.fetch(`
    *[_type == "review" && defined(oldFieldName)] {
      _id,
      oldFieldName
    }
  `);

  const transaction = client.transaction();

  docs.forEach((doc: any) => {
    transaction.patch(doc._id, (p) =>
      p.set({ newFieldName: doc.oldFieldName }).unset(['oldFieldName'])
    );
  });

  await transaction.commit();
}

// ==========================================
// IMAGE UPLOADS
// ==========================================

// Upload image from URL
async function uploadImageFromUrl() {
  const imageUrl = 'https://example.com/image.jpg';

  // Fetch the image
  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();

  // Upload to Sanity
  const asset = await client.assets.upload('image', Buffer.from(buffer), {
    filename: 'game-cover.jpg'
  });

  // Use in a document
  await client.create({
    _type: 'reviewableItem',
    title: 'Example Game',
    coverImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id
      }
    }
  });
}

// Upload image from local file
async function uploadImageFromFile() {
  const fs = require('fs');
  const imageBuffer = fs.readFileSync('./path/to/image.jpg');

  const asset = await client.assets.upload('image', imageBuffer, {
    filename: 'my-image.jpg',
    contentType: 'image/jpeg'
  });

  console.log('Uploaded:', asset._id);
}

export {
  bulkCreate,
  createAuthor,
  deleteDocument,
  fetchAllReviews,
  importFromJSON,
  updateReviewScore,
};
