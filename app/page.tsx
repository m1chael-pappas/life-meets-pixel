import { type SanityDocument } from 'next-sanity';
import Link from 'next/link';

import { ModeToggle } from '@/components/mode-toggle';
import PixelHeartRating from '@/components/pixel-heart';
import CourseCard from '@/components/test-card';
import { client } from '@/sanity/client';

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt}`;

const options = { next: { revalidate: 30 } };

export default async function IndexPage() {
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      {/* Header */}
      <header className="bg-background/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-primary/20 dark:border-primary-dark/20 sticky top-0 z-10">
        <div className="container mx-auto max-w-6xl px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary dark:text-primary-dark">
              GameReviews
            </h1>
            <p className="text-muted dark:text-muted-dark text-sm">
              Your source for honest game reviews
            </p>
          </div>
          <ModeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-4xl p-6">
        {/* Hero Section */}
        <div className="text-center mb-12 py-8">
          <h2 className="text-5xl font-bold text-foreground dark:text-foreground-dark mb-4">
            Latest{" "}
            <span className="text-primary dark:text-primary-dark">
              Game Reviews
              <PixelHeartRating reviewScore={5} showScore />
            </span>
          </h2>
          <p className="text-muted dark:text-muted-dark text-lg max-w-2xl mx-auto">
            Discover the best games worth your time with our in-depth reviews
            and honest ratings
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <>
                <Link
                  href={`/${post.slug.current}`}
                  key={post._id}
                  className="group block"
                >
                  <article className="bg-background dark:bg-background-dark border border-primary/10 dark:border-primary-dark/10 rounded-xl p-6 hover:border-primary/30 dark:hover:border-primary-dark/30 hover:shadow-lg hover:shadow-primary/10 dark:hover:shadow-primary-dark/10 transition-all duration-300 group-hover:transform group-hover:-translate-y-1">
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-foreground dark:text-foreground-dark group-hover:text-primary dark:group-hover:text-primary-dark transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      <div className="flex items-center justify-between text-sm">
                        <time className="text-muted dark:text-muted-dark font-medium">
                          {new Date(post.publishedAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </time>
                        <span className="text-secondary dark:text-secondary-dark font-semibold">
                          Read Review →
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
                <CourseCard />
              </>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-2xl font-bold text-muted dark:text-muted-dark mb-2">
              No reviews yet
            </h3>
            <p className="text-muted dark:text-muted-dark">
              Check back soon for the latest game reviews!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
