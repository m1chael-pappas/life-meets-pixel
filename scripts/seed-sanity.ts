#!/usr/bin/env node
/**
 * Seed script to populate Sanity with initial data
 *
 * Usage:
 *   npm run seed              # Seed all data
 *   npm run seed -- --dry-run # Preview without writing
 */

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

// Create write client (needs token with write permissions)
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  token: process.env.SANITY_API_TOKEN!, // You'll need to add this to .env.local
  useCdn: false,
});

const isDryRun = process.argv.includes('--dry-run');

async function seedData() {
  console.log('🌱 Starting Sanity seed script...');
  console.log(`📍 Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
  console.log(`📊 Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}`);

  if (isDryRun) {
    console.log('🔍 DRY RUN MODE - No data will be written\n');
  } else {
    console.log('✍️  WRITE MODE - Data will be created\n');
  }

  try {
    // Create transaction for batch operations
    const transaction = client.transaction();

    // ===========================
    // 1. Create Authors
    // ===========================
    console.log('👥 Creating authors...');

    const author1 = {
      _type: 'author',
      _id: 'author-michael',
      name: 'Michael',
      slug: { current: 'michael' },
      bio: 'Passionate gamer and reviewer with a love for indie games and RPGs.',
      socialLinks: {
        twitter: 'https://twitter.com/michael_reviews',
        website: 'https://lifemeetspixel.com',
      },
    };

    const author2 = {
      _type: 'author',
      _id: 'author-sarah',
      name: 'Sarah',
      slug: { current: 'sarah' },
      bio: 'Movie buff and anime enthusiast. Always looking for the next great story.',
    };

    if (!isDryRun) {
      transaction.createOrReplace(author1);
      transaction.createOrReplace(author2);
    }
    console.log(`  ✓ ${author1.name}`);
    console.log(`  ✓ ${author2.name}\n`);

    // ===========================
    // 2. Create Categories
    // ===========================
    console.log('📁 Creating categories...');

    const categories = [
      { _id: 'category-action', title: 'Action', slug: { current: 'action' }, color: '#ff6b6b' },
      { _id: 'category-adventure', title: 'Adventure', slug: { current: 'adventure' }, color: '#4ecdc4' },
      { _id: 'category-rpg', title: 'RPG', slug: { current: 'rpg' }, color: '#95e1d3' },
      { _id: 'category-indie', title: 'Indie', slug: { current: 'indie' }, color: '#f38181' },
    ];

    for (const cat of categories) {
      if (!isDryRun) {
        transaction.createOrReplace({ _type: 'category', ...cat });
      }
      console.log(`  ✓ ${cat.title}`);
    }
    console.log('');

    // ===========================
    // 3. Create Platforms
    // ===========================
    console.log('🎮 Creating platforms...');

    const platforms = [
      { _id: 'platform-pc', title: 'PC', slug: { current: 'pc' } },
      { _id: 'platform-ps5', title: 'PlayStation 5', slug: { current: 'ps5' } },
      { _id: 'platform-xbox', title: 'Xbox Series X|S', slug: { current: 'xbox-series' } },
      { _id: 'platform-switch', title: 'Nintendo Switch', slug: { current: 'switch' } },
    ];

    for (const platform of platforms) {
      if (!isDryRun) {
        transaction.createOrReplace({ _type: 'platform', ...platform });
      }
      console.log(`  ✓ ${platform.title}`);
    }
    console.log('');

    // ===========================
    // 4. Create Genres
    // ===========================
    console.log('🎯 Creating genres...');

    const genres = [
      { _id: 'genre-action', title: 'Action', slug: { current: 'action' }, color: { hex: '#ff4757' } },
      { _id: 'genre-rpg', title: 'RPG', slug: { current: 'rpg' }, color: { hex: '#5f27cd' } },
      { _id: 'genre-strategy', title: 'Strategy', slug: { current: 'strategy' }, color: { hex: '#00d2d3' } },
      { _id: 'genre-puzzle', title: 'Puzzle', slug: { current: 'puzzle' }, color: { hex: '#feca57' } },
    ];

    for (const genre of genres) {
      if (!isDryRun) {
        transaction.createOrReplace({ _type: 'genre', ...genre });
      }
      console.log(`  ✓ ${genre.title}`);
    }
    console.log('');

    // ===========================
    // 5. Create Reviewable Items (Games)
    // ===========================
    console.log('🎲 Creating reviewable items...');

    const game1 = {
      _type: 'reviewableItem',
      _id: 'game-hollow-knight',
      title: 'Hollow Knight',
      slug: { current: 'hollow-knight' },
      itemType: 'videogame',
      description: 'A challenging 2D action-adventure through a vast interconnected world.',
      releaseDate: '2017-02-24',
      creator: 'Team Cherry',
      publisher: 'Team Cherry',
      platforms: [
        { _type: 'reference', _ref: 'platform-pc' },
        { _type: 'reference', _ref: 'platform-switch' },
      ],
      genres: [
        { _type: 'reference', _ref: 'genre-action' },
      ],
      esrbRating: 'E10+',
    };

    const game2 = {
      _type: 'reviewableItem',
      _id: 'game-baldurs-gate-3',
      title: "Baldur's Gate 3",
      slug: { current: 'baldurs-gate-3' },
      itemType: 'videogame',
      description: 'An epic RPG based on Dungeons & Dragons 5th Edition.',
      releaseDate: '2023-08-03',
      creator: 'Larian Studios',
      publisher: 'Larian Studios',
      platforms: [
        { _type: 'reference', _ref: 'platform-pc' },
        { _type: 'reference', _ref: 'platform-ps5' },
      ],
      genres: [
        { _type: 'reference', _ref: 'genre-rpg' },
      ],
      esrbRating: 'M',
    };

    if (!isDryRun) {
      transaction.createOrReplace(game1);
      transaction.createOrReplace(game2);
    }
    console.log(`  ✓ ${game1.title}`);
    console.log(`  ✓ ${game2.title}\n`);

    // ===========================
    // 6. Create Reviews
    // ===========================
    console.log('📝 Creating reviews...');

    const review1 = {
      _type: 'review',
      _id: 'review-hollow-knight',
      title: 'Hollow Knight: A Masterclass in Metroidvania Design',
      slug: { current: 'hollow-knight-review' },
      reviewScore: 9.5,
      summary: 'Hollow Knight is an absolute gem that sets a new standard for indie metroidvania games.',
      pros: [
        'Gorgeous hand-drawn art style',
        'Challenging but fair combat',
        'Massive interconnected world to explore',
        'Incredible value for money',
      ],
      cons: [
        'Can be quite difficult for newcomers',
        'Some backtracking required',
        'Minimal story guidance',
      ],
      verdict: 'A must-play for fans of challenging action-platformers and metroidvania games.',
      publishedAt: new Date('2024-01-15').toISOString(),
      featured: true,
      reviewableItem: { _type: 'reference', _ref: 'game-hollow-knight' },
      author: { _type: 'reference', _ref: 'author-michael' },
      categories: [
        { _type: 'reference', _ref: 'category-action' },
        { _type: 'reference', _ref: 'category-indie' },
      ],
    };

    const review2 = {
      _type: 'review',
      _id: 'review-baldurs-gate-3',
      title: "Baldur's Gate 3: The New Standard for CRPGs",
      slug: { current: 'baldurs-gate-3-review' },
      reviewScore: 10,
      summary: 'Larian Studios has crafted an absolute masterpiece that redefines what an RPG can be.',
      pros: [
        'Unparalleled player choice and freedom',
        'Rich, engaging storylines',
        'Excellent companion characters',
        'Stunning visuals and presentation',
        'Deep tactical combat',
      ],
      cons: [
        'Can be overwhelming for newcomers to D&D',
        'Some performance issues on console',
      ],
      verdict: 'A generational RPG that will be remembered as one of the greatest games ever made.',
      publishedAt: new Date('2024-02-01').toISOString(),
      featured: true,
      reviewableItem: { _type: 'reference', _ref: 'game-baldurs-gate-3' },
      author: { _type: 'reference', _ref: 'author-sarah' },
      categories: [
        { _type: 'reference', _ref: 'category-rpg' },
      ],
    };

    if (!isDryRun) {
      transaction.createOrReplace(review1);
      transaction.createOrReplace(review2);
    }
    console.log(`  ✓ ${review1.title}`);
    console.log(`  ✓ ${review2.title}\n`);

    // ===========================
    // 7. Create News Post
    // ===========================
    console.log('📰 Creating news posts...');

    const newsPost1 = {
      _type: 'newsPost',
      _id: 'news-game-awards-2024',
      title: 'Game Awards 2024: All the Major Announcements',
      slug: { current: 'game-awards-2024-announcements' },
      excerpt: 'From surprise reveals to emotional wins, here are all the biggest moments from The Game Awards 2024.',
      publishedAt: new Date('2024-01-20').toISOString(),
      breaking: false,
      author: { _type: 'reference', _ref: 'author-michael' },
      categories: [
        { _type: 'reference', _ref: 'category-action' },
      ],
    };

    if (!isDryRun) {
      transaction.createOrReplace(newsPost1);
    }
    console.log(`  ✓ ${newsPost1.title}\n`);

    // ===========================
    // Commit Transaction
    // ===========================
    if (!isDryRun) {
      console.log('💾 Committing data to Sanity...');
      const result = await transaction.commit();
      console.log(`✅ Successfully created ${result.results.length} documents!\n`);
    } else {
      console.log('✅ Dry run completed - no data written\n');
    }

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

// Run the seed function
seedData()
  .then(() => {
    console.log('🎉 Seed script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
