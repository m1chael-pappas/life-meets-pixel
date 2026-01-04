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
  ServiceAreas?: string[];
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
      const errorText = await response.text();
      console.error("Impact API Campaigns error:", response.status, errorText);
      return [];
    }

    const data = await response.json();
    console.log("Impact Campaigns found:", data.Campaigns?.length || 0);
    return data.Campaigns || [];
  } catch (error) {
    console.error("Failed to fetch Impact campaigns:", error);
    return [];
  }
}

// Fetch all deals from Impact.com (tries account-level first, then campaign-level)
export async function fetchDeals(): Promise<ImpactDeal[]> {
  try {
    const config = getConfig();

    // First try account-level deals
    let response = await fetch(
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
      } catch (e) {
        console.log(`No deals for campaign ${campaign.CampaignName}`);
      }
    }

    return allDeals;
  } catch (error) {
    console.error("Failed to fetch Impact deals:", error);
    return [];
  }
}

// Fetch all catalogs (tries account-level first, then campaign-level)
export async function fetchCatalogs(): Promise<ImpactCatalog[]> {
  try {
    const config = getConfig();

    // First try account-level catalogs
    let response = await fetch(
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
        console.log("Impact Catalogs found (account-level):", data.Catalogs.length);
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
            console.log(`Found ${campaignData.Catalogs.length} catalogs for ${campaign.CampaignName}`);
            // Log each catalog's details including service areas
            campaignData.Catalogs.forEach((cat: any) => {
              console.log(`  - Catalog: ${cat.Name || cat.Id}, ServiceAreas: ${JSON.stringify(cat.ServiceAreas)}, Currency: ${cat.Currency}`);
            });
            allCatalogs.push(...campaignData.Catalogs.map((catalog: ImpactCatalog) => ({
              ...catalog,
              CampaignName: campaign.CampaignName,
              CampaignId: campaign.CampaignId,
            })));
          }
        }
      } catch (e) {
        console.log(`No catalogs for campaign ${campaign.CampaignName}`);
      }
    }

    return allCatalogs;
  } catch (error) {
    console.error("Failed to fetch Impact catalogs:", error);
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
      console.error("Impact API error:", response.status, await response.text());
      return [];
    }

    const data = await response.json();
    const items = data.Items || data.CatalogItems || [];

    // Log first item structure for debugging
    if (items.length > 0) {
      console.log("Sample catalog item structure:", JSON.stringify(items[0], null, 2));
    }

    return items;
  } catch (error) {
    console.error("Failed to fetch catalog items:", error);
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
      console.error("Impact API error:", response.status, await response.text());
      return [];
    }

    const data = await response.json();
    return data.Items || [];
  } catch (error) {
    console.error("Failed to search catalog items:", error);
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
            console.log(`Found ${data.Ads.length} ads for ${campaign.CampaignName}`);
            allAds.push(...data.Ads.map((ad: ImpactAd) => ({
              ...ad,
              CampaignName: campaign.CampaignName,
              CampaignId: campaign.CampaignId,
            })));
          }
        }
      } catch (e) {
        console.log(`No ads for campaign ${campaign.CampaignName}`);
      }
    }

    return allAds;
  } catch (error) {
    console.error("Failed to fetch Impact ads:", error);
    return [];
  }
}

// Check if Impact API is configured
export function isImpactConfigured(): boolean {
  return !!(process.env.IMPACT_ACCOUNT_SID && process.env.IMPACT_AUTH_TOKEN);
}
