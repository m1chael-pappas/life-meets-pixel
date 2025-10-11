import {
  fetchOptions,
  SITE_STATS_QUERY,
} from '@/lib/queries';
import { SiteStats } from '@/lib/types';
import { client } from '@/sanity/client';

export default async function StatsSection() {
  const stats = await client.fetch<SiteStats>(
    SITE_STATS_QUERY,
    {},
    fetchOptions
  );

  if (!stats.totalReviews) {
    return null;
  }

  return (
    <section className="mt-16 py-8 border-t border-primary/20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <div className="text-3xl font-bold text-primary font-mono">
            {stats.totalReviews}
          </div>
          <div className="text-sm text-muted-foreground">Total Reviews</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-primary font-mono">
            {stats.featuredReviews}
          </div>
          <div className="text-sm text-muted-foreground">Featured</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-primary font-mono">
            {stats.averageScore?.toFixed(1) || "0.0"}
          </div>
          <div className="text-sm text-muted-foreground">Avg Rating</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-primary font-mono">
            {new Date().getFullYear()}
          </div>
          <div className="text-sm text-muted-foreground">Est.</div>
        </div>
      </div>
    </section>
  );
}
