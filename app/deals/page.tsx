import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  fetchDeals,
  fetchCatalogs,
  fetchCatalogItems,
  fetchCampaigns,
  fetchAds,
  isImpactConfigured,
  type ImpactDeal,
  type ImpactCatalogItem,
  type ImpactCampaign,
  type ImpactAd,
} from "@/lib/impact";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://lifemeetspixel.com";

export const metadata: Metadata = {
  title: "Gaming Deals",
  description:
    "Find the best deals on video games from our trusted partners. Save money on your next gaming purchase.",
  alternates: {
    canonical: `${siteUrl}/deals`,
  },
  openGraph: {
    title: "Gaming Deals | Life Meets Pixel",
    description:
      "Find the best deals on video games from our trusted partners.",
    url: `${siteUrl}/deals`,
    type: "website",
  },
};

function DealCard({ deal }: { deal: ImpactDeal }) {
  const isActive = deal.State === "ACTIVE";
  const hasDiscount = deal.DiscountPercent > 0 || deal.DiscountAmount > 0;

  return (
    <div
      className={`bg-card border rounded-lg p-6 ${
        isActive ? "border-primary" : "border-border opacity-60"
      }`}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="font-bold text-lg text-foreground mb-1">
            {deal.Name}
          </h3>
          <p className="text-sm text-muted-foreground">{deal.CampaignName}</p>
        </div>
        {hasDiscount && (
          <Badge className="bg-green-500 text-white border-none shrink-0">
            {deal.DiscountPercent > 0
              ? `${deal.DiscountPercent}% OFF`
              : `${deal.DiscountCurrency}${deal.DiscountAmount} OFF`}
          </Badge>
        )}
      </div>

      {deal.Description && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {deal.Description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground font-mono">
          {deal.DefaultPromoCode && (
            <span className="bg-muted px-2 py-1 rounded">
              Code: {deal.DefaultPromoCode}
            </span>
          )}
        </div>
        {deal.TrackingLink && (
          <a
            href={deal.TrackingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:text-primary/80 font-mono"
          >
            Get Deal →
          </a>
        )}
      </div>

      {deal.EndDate && (
        <p className="text-xs text-muted-foreground mt-3 font-mono">
          Expires: {new Date(deal.EndDate).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

function GameCard({ item }: { item: ImpactCatalogItem }) {
  // Handle different field names from API
  const price = item.Price ?? (item as any).CurrentPrice ?? (item as any).SalePrice ?? 0;
  const originalPrice = item.OriginalPrice ?? (item as any).OriginalPrice ?? (item as any).ListPrice;
  const imageUrl = item.ImageUrl ?? (item as any).ImageURL ?? (item as any).image_url;
  const productUrl = item.Url ?? (item as any).ProductURL ?? (item as any).product_url ?? (item as any).Link;
  const name = item.Name ?? (item as any).ProductName ?? (item as any).Title ?? "Unknown Product";
  const currency = item.Currency ?? (item as any).CurrencyCode ?? "$";
  const category = item.Category ?? (item as any).ProductCategory ?? (item as any).CategoryName;

  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round((1 - price / originalPrice) * 100)
    : 0;

  // Skip items without a URL
  if (!productUrl) return null;

  return (
    <a
      href={productUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="group block h-full"
    >
      <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[3/4] bg-muted flex-shrink-0">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl">🎮</span>
            </div>
          )}
          {hasDiscount && discountPercent > 0 && (
            <Badge className="absolute top-2 right-2 bg-red-500 text-white border-none">
              -{discountPercent}%
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-bold text-sm text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors flex-grow">
            {name}
          </h3>

          <div className="mt-auto">
            {price > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-lg font-bold text-primary">
                  {currency}{typeof price === 'number' ? price.toFixed(2) : price}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-muted-foreground line-through">
                    {currency}{typeof originalPrice === 'number' ? originalPrice.toFixed(2) : originalPrice}
                  </span>
                )}
              </div>
            )}

            {category && (
              <p className="text-xs text-muted-foreground mt-2 font-mono truncate">
                {category}
              </p>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}

const ITEMS_PER_PAGE = 24;

export default async function DealsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));
  const configured = isImpactConfigured();

  let deals: ImpactDeal[] = [];
  let games: ImpactCatalogItem[] = [];
  let campaigns: ImpactCampaign[] = [];
  let ads: ImpactAd[] = [];
  let totalItems = 0;
  let catalogName = "";

  if (configured) {
    // Fetch all data in parallel
    const [dealsResult, catalogs, campaignsResult, adsResult] = await Promise.all([
      fetchDeals(),
      fetchCatalogs(),
      fetchCampaigns(),
      fetchAds(),
    ]);

    deals = dealsResult.filter((deal) => deal.State === "ACTIVE");
    campaigns = campaignsResult.filter((c) => c.Status === "ACTIVE" || c.Status === "Active");
    ads = adsResult;

    // Find Australian catalog first, fall back to first available
    if (catalogs.length > 0) {
      // Log all catalogs for debugging
      console.log("Available catalogs:", JSON.stringify(catalogs.map(c => ({
        Id: c.Id,
        Name: c.Name,
        Currency: c.Currency,
        ServiceAreas: c.ServiceAreas,
      })), null, 2));

      // Look for AU/Australia catalog
      const auCatalog = catalogs.find((c) => {
        const name = (c.Name || '').toLowerCase();
        const currency = (c.Currency || '').toUpperCase();
        const serviceAreas = c.ServiceAreas;

        // Check if ServiceAreas contains Australia (handle string or array)
        let hasAustralia = false;
        if (Array.isArray(serviceAreas)) {
          hasAustralia = serviceAreas.some((area: string) =>
            area.toLowerCase().includes('australia') || area.toLowerCase() === 'au'
          );
        } else if (typeof serviceAreas === 'string') {
          hasAustralia = serviceAreas.toLowerCase().includes('australia');
        }

        return hasAustralia ||
          name.includes('australia') ||
          name.includes(' au ') ||
          name.endsWith(' au') ||
          currency === 'AUD';
      });

      const catalogToUse = auCatalog || catalogs[0];
      catalogName = (catalogToUse as any).Name || catalogToUse.Id;
      totalItems = (catalogToUse as any).ItemCount || 0;
      console.log(`Using catalog: ${catalogName} (Currency: ${(catalogToUse as any).Currency || 'unknown'}, Items: ${totalItems})`);

      games = await fetchCatalogItems(catalogToUse.Id, {
        pageSize: ITEMS_PER_PAGE,
        page: currentPage
      });
    }
  }

  // If we don't have totalItems from API, assume there are more pages if we got a full page
  const hasMorePages = games.length === ITEMS_PER_PAGE;
  const estimatedTotalPages = totalItems > 0
    ? Math.ceil(totalItems / ITEMS_PER_PAGE)
    : (hasMorePages ? currentPage + 1 : currentPage);
  const totalPages = estimatedTotalPages;

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="container mx-auto max-w-7xl p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white drop-shadow-md mb-2 font-mono">
            Gaming Deals
          </h1>
          <p className="text-white/80">
            The best deals on games from our trusted partners. We may earn a
            commission on purchases.
          </p>
        </div>

        {!configured ? (
          // Not Configured State
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">🎮</div>
            <h2 className="text-2xl font-bold text-foreground mb-2 font-mono">
              Coming Soon
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              We&apos;re setting up our deals integration. Check back soon for
              the best gaming deals!
            </p>
          </div>
        ) : (
          <>
            {/* Active Deals Section */}
            {deals.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl font-bold text-white drop-shadow-md font-mono">
                    ACTIVE DEALS
                  </h2>
                  <div className="h-px bg-white/30 flex-1"></div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {deals.map((deal) => (
                    <DealCard key={deal.Id} deal={deal} />
                  ))}
                </div>
              </section>
            )}

            {/* Games Section */}
            {games.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl font-bold text-white drop-shadow-md font-mono">
                    BROWSE GAMES
                  </h2>
                  <div className="h-px bg-white/30 flex-1"></div>
                  <Badge variant="outline" className="text-white border-white/30">
                    {totalItems > 0 ? `${totalItems.toLocaleString()} games` : "via Green Man Gaming"}
                  </Badge>
                </div>
                <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                  {games.map((game) => (
                    <GameCard key={game.CatalogItemId} item={game} />
                  ))}
                </div>

                {/* Pagination */}
                {(currentPage > 1 || hasMorePages) && (
                  <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
                    {/* Previous Button */}
                    {currentPage > 1 ? (
                      <Link
                        href={`/deals?page=${currentPage - 1}`}
                        className="px-4 py-2 bg-card border border-border rounded-lg font-mono text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        ← Prev
                      </Link>
                    ) : (
                      <span className="px-4 py-2 bg-muted/50 border border-border rounded-lg font-mono text-sm text-muted-foreground cursor-not-allowed">
                        ← Prev
                      </span>
                    )}

                    {/* Page Numbers - show 2 before and 2 after current */}
                    <div className="flex items-center gap-1">
                      {/* First page if not in range */}
                      {currentPage > 3 && (
                        <>
                          <Link
                            href="/deals?page=1"
                            className="w-10 h-10 flex items-center justify-center rounded-lg font-mono text-sm bg-card border border-border hover:bg-primary/20 transition-colors"
                          >
                            1
                          </Link>
                          {currentPage > 4 && (
                            <span className="px-2 text-white/50">...</span>
                          )}
                        </>
                      )}

                      {/* Pages around current */}
                      {Array.from({ length: 5 }, (_, i) => currentPage - 2 + i)
                        .filter((page) => page >= 1 && (totalItems > 0 ? page <= totalPages : page <= currentPage + (hasMorePages ? 2 : 0)))
                        .map((pageNum) => (
                          <Link
                            key={pageNum}
                            href={`/deals?page=${pageNum}`}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg font-mono text-sm transition-colors ${
                              pageNum === currentPage
                                ? "bg-primary text-primary-foreground"
                                : "bg-card border border-border hover:bg-primary/20"
                            }`}
                          >
                            {pageNum}
                          </Link>
                        ))}

                      {/* Show more indicator if there could be more pages */}
                      {hasMorePages && (
                        <span className="px-2 text-white/50">...</span>
                      )}
                    </div>

                    {/* Next Button */}
                    {hasMorePages ? (
                      <Link
                        href={`/deals?page=${currentPage + 1}`}
                        className="px-4 py-2 bg-card border border-border rounded-lg font-mono text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        Next →
                      </Link>
                    ) : (
                      <span className="px-4 py-2 bg-muted/50 border border-border rounded-lg font-mono text-sm text-muted-foreground cursor-not-allowed">
                        Next →
                      </span>
                    )}
                  </div>
                )}

                {/* Page Info */}
                <p className="text-center text-sm text-white/60 mt-4 font-mono">
                  Showing {games.length} games {totalItems > 0 && `of ${totalItems.toLocaleString()}`}
                </p>
              </section>
            )}

            {/* Partner Stores Section */}
            {campaigns.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl font-bold text-white drop-shadow-md font-mono">
                    OUR PARTNERS
                  </h2>
                  <div className="h-px bg-white/30 flex-1"></div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {campaigns.map((campaign) => (
                    <a
                      key={campaign.CampaignId}
                      href={campaign.TrackingLink || campaign.CampaignUrl}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="block bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-primary"
                    >
                      <h3 className="font-bold text-lg text-foreground mb-2">
                        {campaign.CampaignName || campaign.AdvertiserName}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Shop games and earn rewards through our affiliate partnership
                      </p>
                      <span className="text-primary font-mono text-sm">
                        Visit Store →
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Empty State */}
            {deals.length === 0 && games.length === 0 && campaigns.length === 0 && (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-2xl font-bold text-foreground mb-2 font-mono">
                  No Deals Available
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  There are no active deals at the moment. Check back later for
                  new offers!
                </p>
                <Link href="/reviews?type=videogame">
                  <Button variant="outline" className="font-mono">
                    Browse Game Reviews →
                  </Button>
                </Link>
              </div>
            )}

            {/* Affiliate Disclosure */}
            <div className="mt-8 p-4 bg-black/30 rounded-lg border border-white/20">
              <p className="text-xs text-white/80 text-center">
                <strong className="text-white">Affiliate Disclosure:</strong> This page contains
                affiliate links. We may earn a commission when you make a
                purchase through these links at no extra cost to you. This helps
                support our site and allows us to continue providing honest
                reviews.{" "}
                <Link
                  href="/legal/affiliate-disclosure"
                  className="text-primary hover:underline"
                >
                  Learn more
                </Link>
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
