import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '1ir3sv5r',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function deleteAlexChen() {
  try {
    // First, verify we're targeting the correct author
    const alexChen = await client.fetch(`*[_type == "author" && _id == "9d0f03de-9495-4e3b-886a-f3b4a7af5b38"][0]{
      _id,
      name,
      slug
    }`);

    if (!alexChen) {
      console.log('Alex Chen not found');
      return;
    }

    console.log('Found author to delete:');
    console.log(JSON.stringify(alexChen, null, 2));

    // Verify this is Alex Chen and NOT Michael or Jenna
    if (alexChen.name === 'Alex Chen' && alexChen._id === '9d0f03de-9495-4e3b-886a-f3b4a7af5b38') {
      console.log('\nDeleting Alex Chen...');
      await client.delete('9d0f03de-9495-4e3b-886a-f3b4a7af5b38');
      console.log('✓ Alex Chen deleted successfully');
    } else {
      console.error('Safety check failed - author does not match expected Alex Chen');
    }

    // Verify remaining authors
    const remainingAuthors = await client.fetch(`*[_type == "author"]{_id, name}`);
    console.log('\nRemaining authors:');
    console.log(JSON.stringify(remainingAuthors, null, 2));

  } catch (error) {
    console.error('Error deleting author:', error);
  }
}

deleteAlexChen();
