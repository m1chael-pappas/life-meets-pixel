// Impact.com API Client for affiliate integrations
// API Docs: https://integrations.impact.com/impact-publisher/reference/overview

const IMPACT_API_BASE = "https://api.impact.com/Mediapartners";

interface ImpactConfig {
  accountSid: string;
  authToken: string;
}

function getConfig(): ImpactConfig {
  const accountSid = process.env.IMPACT_ACCOUNT_SID;
  const authToken = process.env.IMPACT_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    throw new Error("Impact.com API credentials not configured");
  }

  return { accountSid, authToken };
}

function getAuthHeader(config: ImpactConfig): string {
  const credentials = Buffer.from(
    `${config.accountSid}:${config.authToken}`
  ).toString("base64");
  return `Basic ${credentials}`;
}

export interface ImpactCampaign {
  Id: string;
  CampaignId: string;
  CampaignName: string;
  AdvertiserId: string;
  AdvertiserName: string;
  Status: string;
  CampaignUrl: string;
  TrackingLink: string;
}

export interface ImpactDeal {
  Id: string;
  Name: string;
  Description: string;
  Type: string;
  State: string;
  DiscountType: string;
  DiscountAmount: number;
  DiscountPercent: number;
  DiscountCurrency: string;
  StartDate: string;
  EndDate: string;
  DefaultPromoCode?: string;
  TrackingLink?: string;
  CampaignId: string;
  CampaignName: string;
}

export interface ImpactCatalogItem {
  CatalogItemId: string;
  Name: string;
  Description: string;
  Price: number;
  Currency: string;
  ImageUrl: string;
  Url: string;
  Category: string;
  Labels?: string[];
  OriginalPrice?: number;
  StockAvailability?: string;
}

export interface ImpactCatalog {
  Id: string;
  Name: string;
  CampaignId: string;
  CampaignName: string;
  ItemCount: number;
  ServiceAreas?: string[] | string;
  Currency?: string;
  Description?: string;
}

// Fetch all campaigns (brands you're partnered with)
export async function fetchCampaigns(): Promise<ImpactCampaign[]> {
  try {
    const config = getConfig();
    const response = await fetch(
      `${IMPACT_API_BASE}/${config.accountSid}/Campaigns?PageSize=100`,
      {
        headers: {
          Authorization: getAuthHeader(config),
          Accept: "application/json",
        },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.Campaigns || [];
  } catch {
    return [];
  }
}

// Fetch all deals from Impact.com (tries account-level first, then campaign-level)
export async function fetchDeals(): Promise<ImpactDeal[]> {
  try {
    const config = getConfig();

    // First try account-level deals
    const response = await fetch(
      `${IMPACT_API_BASE}/${config.accountSid}/Deals?PageSize=100`,
      {
        headers: {
          Authorization: getAuthHeader(config),
          Accept: "application/json",
        },
        next: { revalidate: 3600 },
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.Deals?.length > 0) {
        return data.Deals;
      }
    }

    // If no account-level deals, try fetching from campaigns
    const campaigns = await fetchCampaigns();
    const allDeals: ImpactDeal[] = [];

    for (const campaign of campaigns) {
      try {
        const campaignResponse = await fetch(
          `${IMPACT_API_BASE}/${config.accountSid}/Campaigns/${campaign.CampaignId}/Deals?PageSize=50`,
          {
            headers: {
              Authorization: getAuthHeader(config),
              Accept: "application/json",
            },
            next: { revalidate: 3600 },
          }
        );

        if (campaignResponse.ok) {
          const campaignData = await campaignResponse.json();
          if (campaignData.Deals) {
            allDeals.push(...campaignData.Deals.map((deal: ImpactDeal) => ({
              ...deal,
              CampaignName: campaign.CampaignName,
            })));
          }
        }
      } catch {
        // No deals for this campaign
      }
    }

    return allDeals;
  } catch {
    return [];
  }
}

// Fetch all catalogs (tries account-level first, then campaign-level)
export async function fetchCatalogs(): Promise<ImpactCatalog[]> {
  try {
    const config = getConfig();

    // First try account-level catalogs
    const response = await fetch(
      `${IMPACT_API_BASE}/${config.accountSid}/Catalogs`,
      {
        headers: {
          Authorization: getAuthHeader(config),
          Accept: "application/json",
        },
        next: { revalidate: 3600 },
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.Catalogs?.length > 0) {
        return data.Catalogs;
      }
    }

    // If no account-level catalogs, try fetching from campaigns
    const campaigns = await fetchCampaigns();
    const allCatalogs: ImpactCatalog[] = [];

    for (const campaign of campaigns) {
      try {
        const campaignResponse = await fetch(
          `${IMPACT_API_BASE}/${config.accountSid}/Campaigns/${campaign.CampaignId}/Catalogs`,
          {
            headers: {
              Authorization: getAuthHeader(config),
              Accept: "application/json",
            },
            next: { revalidate: 3600 },
          }
        );

        if (campaignResponse.ok) {
          const campaignData = await campaignResponse.json();
          if (campaignData.Catalogs) {
            allCatalogs.push(...campaignData.Catalogs.map((catalog: ImpactCatalog) => ({
              ...catalog,
              CampaignName: campaign.CampaignName,
              CampaignId: campaign.CampaignId,
            })));
          }
        }
      } catch {
        // No catalogs for this campaign
      }
    }

    return allCatalogs;
  } catch {
    return [];
  }
}

// Fetch items from a specific catalog
export async function fetchCatalogItems(
  catalogId: string,
  options?: {
    query?: string;
    pageSize?: number;
    page?: number;
  }
): Promise<ImpactCatalogItem[]> {
  try {
    const config = getConfig();
    const params = new URLSearchParams({
      PageSize: String(options?.pageSize || 50),
      Page: String(options?.page || 1),
    });

    if (options?.query) {
      params.set("Query", options.query);
    }

    const response = await fetch(
      `${IMPACT_API_BASE}/${config.accountSid}/Catalogs/${catalogId}/Items?${params}`,
      {
        headers: {
          Authorization: getAuthHeader(config),
          Accept: "application/json",
        },
        next: { revalidate: 1800 }, // Cache for 30 minutes
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.Items || data.CatalogItems || [];
  } catch {
    return [];
  }
}

// Search across all catalogs
export async function searchCatalogItems(
  query: string
): Promise<ImpactCatalogItem[]> {
  try {
    const config = getConfig();
    const params = new URLSearchParams({
      Query: query,
      PageSize: "20",
    });

    const response = await fetch(
      `${IMPACT_API_BASE}/${config.accountSid}/Catalogs/ItemSearch?${params}`,
      {
        headers: {
          Authorization: getAuthHeader(config),
          Accept: "application/json",
        },
        next: { revalidate: 1800 },
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.Items || [];
  } catch {
    return [];
  }
}

// Fetch ads/creatives for a campaign
export interface ImpactAd {
  Id: string;
  CampaignId: string;
  CampaignName: string;
  Name: string;
  Description: string;
  Type: string;
  TrackingLink: string;
  LandingPageUrl: string;
  ImageUrl?: string;
}

export async function fetchAds(): Promise<ImpactAd[]> {
  try {
    const config = getConfig();
    const campaigns = await fetchCampaigns();
    const allAds: ImpactAd[] = [];

    for (const campaign of campaigns) {
      try {
        const response = await fetch(
          `${IMPACT_API_BASE}/${config.accountSid}/Campaigns/${campaign.CampaignId}/Ads?PageSize=50`,
          {
            headers: {
              Authorization: getAuthHeader(config),
              Accept: "application/json",
            },
            next: { revalidate: 3600 },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.Ads) {
            allAds.push(...data.Ads.map((ad: ImpactAd) => ({
              ...ad,
              CampaignName: campaign.CampaignName,
              CampaignId: campaign.CampaignId,
            })));
          }
        }
      } catch {
        // No ads for this campaign
      }
    }

    return allAds;
  } catch {
    return [];
  }
}

// Check if Impact API is configured
export function isImpactConfigured(): boolean {
  return !!(process.env.IMPACT_ACCOUNT_SID && process.env.IMPACT_AUTH_TOKEN);
}
