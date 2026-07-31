const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

/* =========================================================
   SEO ANALYSIS TYPES
   ========================================================= */

export interface SeoAnalysis {
  title: string;
  titleLength: number;
  hasTitle: boolean;

  metaDescription: string;
  metaDescriptionLength: number;
  hasMetaDescription: boolean;

  h1Count: number;
  h2Count: number;

  imageCount: number;
  imagesWithoutAlt: number;

  hasCanonical: boolean;
  hasViewport: boolean;

  totalLinks: number;
  internalLinksCount: number;
  externalLinksCount: number;
  linksWithoutText: number;
}

/* =========================================================
   SITE FILE TYPES
   ========================================================= */

export interface SiteFileStatus {
  url: string;
  exists: boolean;
  statusCode: number;
}

export interface SiteFilesResult {
  robotsTxt: SiteFileStatus;
  sitemapXml: SiteFileStatus;
}

/* =========================================================
   RECOMMENDATION TYPES
   ========================================================= */

export interface Recommendation {
  type: string;
  severity: string;
  message: string;
  recommendation: string;
}

/* =========================================================
   PAGE AUDIT TYPES
   ========================================================= */

export interface PageAudit {
  id: number;
  url: string;
  score: number;
  htmlLength: number;
  statusCode: number;
  reachable: boolean;
  depth: number;

  analysis: SeoAnalysis;

  recommendations: Recommendation[];

  siteFiles: SiteFilesResult | null;

  createdAt: string;
}

/* =========================================================
   WEBSITE AUDIT TYPES
   ========================================================= */

export interface WebsiteAudit {
  id: number;
  url: string;
  createdAt: string;

  pagesCrawled: number;

  averageScore: number;
  highestScore: number;
  lowestScore: number;

  crawlTimeMs: number;
  averageTimePerPageMs: number;
  maxDepthReached: number;

  issuesFound?: number;
  status?: string;
}

export interface WebsiteAuditDetails extends WebsiteAudit {
  pageAudits: PageAudit[];
}

/* =========================================================
   CREATE WEBSITE AUDIT RESPONSE
   ========================================================= */

export interface SiteAuditResult {
  websiteAuditId: number;

  pageAudits: PageAudit[];

  summary: {
    pagesCrawled: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
  };

  metrics: {
    pagesCrawled: number;
    crawlTimeMs: number;
    averageTimePerPageMs: number;
    maxDepthReached: number;
  };

  errors: unknown[];
  skipped: unknown[];
}

/* =========================================================
   GENERIC API RESPONSE
   ========================================================= */

interface ApiError {
  code: string;
  details?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: ApiError;
}

/* =========================================================
   CREATE WEBSITE AUDIT
   ========================================================= */

export async function createWebsiteAudit(
  url: string,
  maxDepth = 2,
  maxPages = 10,
): Promise<WebsiteAudit> {
  const response = await fetch(
    `${API_BASE_URL}/api/site-audits`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        maxDepth,
        maxPages,
      }),
    },
  );

  let body: ApiResponse<{
    siteAudit: SiteAuditResult;
  }>;

  try {
    body = (await response.json()) as ApiResponse<{
      siteAudit: SiteAuditResult;
    }>;
  } catch {
    throw new Error(
      "The server returned an invalid response.",
    );
  }

  if (!response.ok || !body.success) {
    throw new Error(
      body.error?.details ??
        body.message ??
        "Failed to create website audit",
    );
  }

  const siteAudit = body.data?.siteAudit;

  if (!siteAudit) {
    throw new Error(
      "Website audit was created but no audit data was returned.",
    );
  }

  if (!siteAudit.websiteAuditId) {
    console.error(
      "Unexpected website audit response:",
      body,
    );

    throw new Error(
      "Website audit was created but its ID was not returned.",
    );
  }

  return {
    id: siteAudit.websiteAuditId,

    url,

    createdAt: new Date().toISOString(),

    pagesCrawled: siteAudit.summary.pagesCrawled,

    averageScore: siteAudit.summary.averageScore,

    highestScore: siteAudit.summary.highestScore,

    lowestScore: siteAudit.summary.lowestScore,

    crawlTimeMs: siteAudit.metrics.crawlTimeMs,

    averageTimePerPageMs:
      siteAudit.metrics.averageTimePerPageMs,

    maxDepthReached:
      siteAudit.metrics.maxDepthReached,
  };
}

/* =========================================================
   GET ALL WEBSITE AUDITS
   ========================================================= */

export async function getWebsiteAudits(): Promise<
  WebsiteAudit[]
> {
  const response = await fetch(
    `${API_BASE_URL}/api/site-audits`,
  );

  let body: ApiResponse<{
    websiteAudits: WebsiteAudit[];
  }>;

  try {
    body = (await response.json()) as ApiResponse<{
      websiteAudits: WebsiteAudit[];
    }>;
  } catch {
    throw new Error(
      "The server returned an invalid response.",
    );
  }

  if (!response.ok || !body.success) {
    throw new Error(
      body.error?.details ??
        body.message ??
        "Failed to fetch website audits",
    );
  }

  return body.data?.websiteAudits ?? [];
}

/* =========================================================
   GET WEBSITE AUDIT BY ID
   ========================================================= */

export async function getWebsiteAuditById(
  id: number,
): Promise<WebsiteAuditDetails> {
  const response = await fetch(
    `${API_BASE_URL}/api/site-audits/${id}`,
  );

  let body: ApiResponse<{
    websiteAudit: WebsiteAuditDetails;
  }>;

  try {
    body = (await response.json()) as ApiResponse<{
      websiteAudit: WebsiteAuditDetails;
    }>;
  } catch {
    throw new Error(
      "The server returned an invalid response.",
    );
  }

  if (!response.ok || !body.success) {
    throw new Error(
      body.error?.details ??
        body.message ??
        "Failed to fetch website audit",
    );
  }

  const websiteAudit = body.data?.websiteAudit;

  if (!websiteAudit) {
    throw new Error(
      "Website audit was not returned by the API.",
    );
  }

  return websiteAudit;
}