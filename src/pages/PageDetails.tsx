import {
  ArrowLeft,
  ExternalLink,
  Gauge,
  Globe,
  Image,
  Link2,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AppShell from "../components/layout/AppShell";
import StatusState from "../components/layout/ui/audit/StatusState";
import {
  getWebsiteAuditById,
  type PageAudit,
  type WebsiteAuditDetails,
} from "../services/api";

function getScoreTone(score: number) {
  if (score >= 80) {
    return {
      text: "text-[#16A34A]",
      background: "bg-[#F0FDF4]",
      bar: "bg-[#22C55E]",
      label: "Good",
    };
  }

  if (score >= 60) {
    return {
      text: "text-[#D97706]",
      background: "bg-[#FFF7E6]",
      bar: "bg-[#F59E0B]",
      label: "Needs Improvement",
    };
  }

  return {
    text: "text-[#DC2626]",
    background: "bg-[#FEF2F2]",
    bar: "bg-[#EF4444]",
    label: "Poor",
  };
}

function getSeverityClass(severity: string) {
  switch (severity.toLowerCase()) {
    case "high":
    case "critical":
      return "bg-[#FEF2F2] text-[#DC2626]";

    case "medium":
      return "bg-[#FFF7E6] text-[#D97706]";

    default:
      return "bg-[#EFF6FF] text-[#2563EB]";
  }
}

function formatValue(value: unknown) {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (value === null || value === undefined || value === "") {
    return "—";
  }

  return String(value);
}

function PageDetails() {
  const { auditId, pageId } = useParams();
  const navigate = useNavigate();

  const [audit, setAudit] =
    useState<WebsiteAuditDetails | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPage() {
      if (!auditId || !pageId) {
        setError("Invalid audit or page identifier.");
        setIsLoading(false);
        return;
      }

      const parsedAuditId = Number(auditId);
      const parsedPageId = Number(pageId);

      if (
        !Number.isInteger(parsedAuditId) ||
        parsedAuditId <= 0 ||
        !Number.isInteger(parsedPageId) ||
        parsedPageId <= 0
      ) {
        setError("Invalid audit or page identifier.");
        setIsLoading(false);
        return;
      }

      try {
        const result =
          await getWebsiteAuditById(parsedAuditId);

        setAudit(result);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load page details.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadPage();
  }, [auditId, pageId]);

  const page = useMemo<PageAudit | null>(() => {
    if (!audit || !pageId) {
      return null;
    }

    const parsedPageId = Number(pageId);

    return (
      audit.pageAudits.find(
        (item) => item.id === parsedPageId,
      ) ?? null
    );
  }, [audit, pageId]);

  if (isLoading) {
    return (
      <AppShell
        title="Page Details"
        subtitle="Drill down into individual page performance"
      >
        <div className="mx-auto w-full max-w-[975px] px-4 py-8 md:px-6">
          <section className="rounded-2xl border border-[#F3F4F6] bg-white">
            <StatusState
              variant="loading"
              title="Loading page details"
              description="Fetching the selected page analysis."
            />
          </section>
        </div>
      </AppShell>
    );
  }

  if (error || !audit || !page) {
    return (
      <AppShell
        title="Page Details"
        subtitle="Drill down into individual page performance"
      >
        <div className="mx-auto w-full max-w-[975px] px-4 py-8 md:px-6">
          <section className="rounded-2xl border border-[#F3F4F6] bg-white">
            <StatusState
              variant="error"
              title="Page not found"
              description={
                error ||
                "The selected page audit could not be found."
              }
              actionLabel="Back to Audit"
              onAction={() =>
                navigate(`/audits/${auditId}`)
              }
            />
          </section>
        </div>
      </AppShell>
    );
  }

  const scoreTone = getScoreTone(page.score);
  const analysis = page.analysis;

  const stats = [
    {
      label: "Issues",
      value: page.recommendations.length,
    },
    {
      label: "HTTP Status",
      value: page.statusCode,
    },
    {
      label: "Crawl Depth",
      value: page.depth,
    },
    {
      label: "HTML Size",
      value: `${Math.round(page.htmlLength / 1024)} KB`,
    },
  ];

  return (
    <AppShell
      title="Page Details"
      subtitle="Drill down into individual page performance"
    >
      <div className="mx-auto w-full max-w-[975px] px-4 py-5 md:px-6 md:py-8">
        {/* Page identity */}
        <div className="mb-5">
          <button
            type="button"
            onClick={() =>
              navigate(`/audits/${audit.id}`)
            }
            className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#99A1AF] transition hover:text-[#0e7490]"
          >
            <ArrowLeft size={14} />
            Back to Audit
          </button>

          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <h2 className="break-all text-lg font-bold text-[#1E2939]">
                {page.url}
              </h2>

              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#99A1AF]">
                <span>Depth {page.depth}</span>
                <span>•</span>
                <span>HTTP {page.statusCode}</span>
                <span>•</span>
                <span>
                  {page.reachable
                    ? "Reachable"
                    : "Unreachable"}
                </span>
              </div>
            </div>

            <a
              href={page.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-1.5 rounded-[10px] border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-medium text-[#6A7282] hover:text-[#0e7490]"
            >
              Open page
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* Score */}
        <section className="grid gap-4 lg:grid-cols-[240px_1fr]">
          <div className="rounded-2xl border border-[#F3F4F6] bg-white p-6">
            <div className="text-xs font-medium text-[#99A1AF]">
              SEO Score
            </div>

            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-5xl font-bold leading-none text-[#1E2939]">
                {page.score}
              </span>

              <span className="text-sm text-[#99A1AF]">
                / 100
              </span>
            </div>

            <div
              className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${scoreTone.background} ${scoreTone.text}`}
            >
              {scoreTone.label}
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#F3F4F6]">
              <div
                className={`h-full rounded-full ${scoreTone.bar}`}
                style={{
                  width: `${Math.max(
                    0,
                    Math.min(page.score, 100),
                  )}%`,
                }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[#F3F4F6] bg-white p-6">
            <div className="flex items-center gap-2">
              <Gauge
                size={16}
                className="text-[#0e7490]"
              />

              <h3 className="text-sm font-semibold text-[#364153]">
                Page Overview
              </h3>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl bg-[#F9FAFB] p-3"
                >
                  <div className="text-xs text-[#99A1AF]">
                    {stat.label}
                  </div>

                  <div className="mt-1 text-base font-bold text-[#1E2939]">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEO metrics */}
        <section className="mt-5 rounded-2xl border border-[#F3F4F6] bg-white">
          <div className="border-b border-[#F3F4F6] px-5 py-4">
            <div className="flex items-center gap-2">
              <Search
                size={16}
                className="text-[#0e7490]"
              />

              <h3 className="text-sm font-semibold text-[#364153]">
                SEO Metrics
              </h3>
            </div>
          </div>

          <div className="grid md:grid-cols-2">
            <MetricRow
              label="Title"
              value={formatValue(analysis.title)}
            />

            <MetricRow
              label="Title Length"
              value={formatValue(analysis.titleLength)}
            />

            <MetricRow
              label="Meta Description"
              value={formatValue(analysis.metaDescription)}
            />

            <MetricRow
              label="Meta Description Length"
              value={formatValue(
                analysis.metaDescriptionLength,
              )}
            />

            <MetricRow
              label="H1 Count"
              value={formatValue(analysis.h1Count)}
            />

            <MetricRow
              label="H2 Count"
              value={formatValue(analysis.h2Count)}
            />

            <MetricRow
              label="Canonical"
              value={formatValue(analysis.hasCanonical)}
            />

            <MetricRow
              label="Viewport"
              value={formatValue(analysis.hasViewport)}
            />
          </div>
        </section>

        {/* Images and links */}
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <section className="rounded-2xl border border-[#F3F4F6] bg-white">
            <div className="border-b border-[#F3F4F6] px-5 py-4">
              <div className="flex items-center gap-2">
                <Image
                  size={16}
                  className="text-[#0e7490]"
                />

                <h3 className="text-sm font-semibold text-[#364153]">
                  Images
                </h3>
              </div>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-2 gap-3">
                <MiniMetric
                  label="Images"
                  value={analysis.imageCount}
                />

                <MiniMetric
                  label="Missing Alt"
                  value={analysis.imagesWithoutAlt}
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[#F3F4F6] bg-white">
            <div className="border-b border-[#F3F4F6] px-5 py-4">
              <div className="flex items-center gap-2">
                <Link2
                  size={16}
                  className="text-[#0e7490]"
                />

                <h3 className="text-sm font-semibold text-[#364153]">
                  Links
                </h3>
              </div>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-2 gap-3">
                <MiniMetric
                  label="Total"
                  value={analysis.totalLinks}
                />

                <MiniMetric
                  label="Internal"
                  value={analysis.internalLinksCount}
                />

                <MiniMetric
                  label="External"
                  value={analysis.externalLinksCount}
                />

                <MiniMetric
                  label="No Text"
                  value={analysis.linksWithoutText}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Site files and technical checks */}
        <section className="mt-5 rounded-2xl border border-[#F3F4F6] bg-white">
          <div className="border-b border-[#F3F4F6] px-5 py-4">
            <div className="flex items-center gap-2">
              <Globe
                size={16}
                className="text-[#0e7490]"
              />

              <h3 className="text-sm font-semibold text-[#364153]">
                Site Files & Technical Checks
              </h3>
            </div>
          </div>

          <div className="grid md:grid-cols-2">
            <MetricRow
              label="robots.txt"
              value={
                page.siteFiles
                  ? page.siteFiles.robotsTxt.exists
                    ? "Available"
                    : "Missing"
                  : "—"
              }
            />

            <MetricRow
              label="sitemap.xml"
              value={
                page.siteFiles
                  ? page.siteFiles.sitemapXml.exists
                    ? "Available"
                    : "Missing"
                  : "—"
              }
            />

            <MetricRow
              label="Reachable"
              value={
                page.reachable ? "Yes" : "No"
              }
            />

            <MetricRow
              label="HTTP Status"
              value={page.statusCode}
            />
          </div>
        </section>

        {/* Recommendations */}
        <section className="mt-5 overflow-hidden rounded-2xl border border-[#F3F4F6] bg-white">
          <div className="flex items-center justify-between border-b border-[#F3F4F6] px-5 py-4">
            <div className="flex items-center gap-2">
              <ShieldCheck
                size={16}
                className="text-[#0e7490]"
              />

              <h3 className="text-sm font-semibold text-[#364153]">
                Recommendations
              </h3>
            </div>

            <span className="rounded-full bg-[#F9FAFB] px-2.5 py-1 text-[10px] text-[#6A7282]">
              {page.recommendations.length}
            </span>
          </div>

          {page.recommendations.length === 0 ? (
            <StatusState
              variant="success"
              title="No issues detected"
              description="This page passed all current SEO recommendation checks."
            />
          ) : (
            <div className="divide-y divide-[#F3F4F6]">
              {page.recommendations.map(
                (recommendation, index) => (
                  <div
                    key={`${recommendation.type}-${index}`}
                    className="p-5"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-semibold text-[#364153]">
                            {recommendation.message}
                          </h4>

                          <span className="rounded-[8px] bg-[#F9FAFB] px-2 py-1 text-[10px] text-[#6A7282]">
                            {recommendation.type}
                          </span>
                        </div>

                        <p className="mt-2 max-w-2xl text-xs leading-5 text-[#6A7282]">
                          {recommendation.recommendation}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${getSeverityClass(
                          recommendation.severity,
                        )}`}
                      >
                        {recommendation.severity}
                      </span>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}

interface MetricRowProps {
  label: string;
  value: string | number;
}

function MetricRow({
  label,
  value,
}: MetricRowProps) {
  return (
    <div className="flex min-h-[54px] items-center justify-between border-b border-[#F3F4F6] px-5 py-3 last:border-b-0">
      <span className="text-xs text-[#6A7282]">
        {label}
      </span>

      <span className="ml-4 max-w-[65%] truncate text-right text-xs font-medium text-[#364153]">
        {value}
      </span>
    </div>
  );
}

interface MiniMetricProps {
  label: string;
  value: number;
}

function MiniMetric({
  label,
  value,
}: MiniMetricProps) {
  return (
    <div className="rounded-xl bg-[#F9FAFB] p-3">
      <div className="text-xs text-[#99A1AF]">
        {label}
      </div>

      <div className="mt-1 text-lg font-bold text-[#364153]">
        {value}
      </div>
    </div>
  );
}

export default PageDetails;