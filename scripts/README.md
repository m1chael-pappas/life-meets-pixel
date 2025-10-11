# Data Scripts

This directory contains scripts for managing Sanity data programmatically.

## Seeding Data

The `seed-sanity.ts` script allows you to programmatically populate your Sanity dataset with initial data.

### Setup

1. **Get a Sanity API Token:**
   - Go to https://sanity.io/manage/project/1ir3sv5r/api
   - Click "Add API token"
   - Name it (e.g., "Seed Script Token")
   - Set permissions to **Editor** or **Admin**
   - Copy the token

2. **Add Token to `.env.local`:**
   ```bash
   SANITY_API_TOKEN=your-actual-token-here
   ```

3. **Install Dependencies:**
   ```bash
   npm install
   ```

### Usage

```bash
# Preview what will be created (dry run)
npm run seed:dry-run

# Actually seed the data
npm run seed
```

### What Gets Seeded

The script creates:
- **2 Authors** (Michael, Sarah)
- **4 Categories** (Action, Adventure, RPG, Indie)
- **4 Platforms** (PC, PS5, Xbox, Switch)
- **4 Genres** (Action, RPG, Strategy, Puzzle)
- **2 Games** (Hollow Knight, Baldur's Gate 3)
- **2 Reviews** (for the above games)
- **1 News Post** (Game Awards 2024)

### Customizing Seed Data

Edit `scripts/seed-sanity.ts` to:
- Add more items
- Modify existing items
- Change which items are created

The script uses `createOrReplace()` which means:
- If a document with that `_id` exists, it updates it
- If it doesn't exist, it creates it
- Safe to run multiple times

### Creating Your Own Data Scripts

You can create additional scripts for:
- **Bulk imports** from CSV/JSON
- **Data migrations** between schemas
- **Automated content generation**
- **Data cleanup/maintenance**

Example structure:
```typescript
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
});

// Create a single document
await client.create({
  _type: 'review',
  title: 'My Review',
  // ... other fields
});

// Create multiple documents in a transaction
const transaction = client.transaction();
transaction.create({ _type: 'author', name: 'John' });
transaction.create({ _type: 'author', name: 'Jane' });
await transaction.commit();

// Update a document
await client.patch('document-id')
  .set({ title: 'New Title' })
  .commit();

// Delete a document
await client.delete('document-id');
```

## Safety Tips

1. **Always test with `--dry-run` first**
2. **Use a test dataset** for experimentation
3. **Back up your data** before running destructive operations
4. **Never commit** `.env.local` with real tokens
5. **Use transactions** for atomic operations

## Useful Resources

- [Sanity Client Documentation](https://www.sanity.io/docs/js-client)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Sanity Schema Types](https://www.sanity.io/docs/schema-types)
