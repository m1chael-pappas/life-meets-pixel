import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '1ir3sv5r',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function fetchAuthors() {
  try {
    const authors = await client.fetch(`*[_type == "author"]{
      _id,
      name,
      slug,
      bio,
      avatar{
        asset->{
          url
        }
      },
      socialLinks
    }`);

    console.log(JSON.stringify(authors, null, 2));
  } catch (error) {
    console.error('Error fetching authors:', error);
  }
}

fetchAuthors();
