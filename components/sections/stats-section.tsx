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
    <section className="mt-16 py-8 border-t border-white/30">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <div className="text-3xl font-bold text-primary font-mono stat-text-shadow">
            {stats.totalReviews}
          </div>
          <div className="text-md text-white/80">Total Reviews</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-primary font-mono stat-text-shadow">
            {stats.featuredReviews}
          </div>
          <div className="text-md text-white/80">Featured</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-primary font-mono stat-text-shadow">
            {stats.averageScore?.toFixed(1) || "0.0"}
          </div>
          <div className="text-md text-white/80">Avg Rating</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-primary font-mono stat-text-shadow">
            {new Date().getFullYear()}
          </div>
          <div className="text-md text-white/80">Est.</div>
        </div>
      </div>
    </section>
  );
}
