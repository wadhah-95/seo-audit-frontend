import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Gauge,
  Globe,
 
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AppShell from "../components/layout/AppShell";
import StatusState from "../components/layout/ui/audit/StatusState";
import {
  getWebsiteAuditById,
  type WebsiteAuditDetails,
} from "../services/api";

function getScoreClass(score: number) {
  if (score >= 80) {
    return "bg-[#F0FDF4] text-[#16A34A]";
  }

  if (score >= 60) {
    return "bg-[#FFF7E6] text-[#D97706]";
  }

  return "bg-[#FEF2F2] text-[#DC2626]";
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatDuration(milliseconds: number) {
  if (milliseconds < 1000) {
    return `${milliseconds} ms`;
  }

  return `${(milliseconds / 1000).toFixed(1)} s`;
}

function AuditResult() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [audit, setAudit] =
    useState<WebsiteAuditDetails | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAudit() {
      if (!id) {
        setError("Invalid audit identifier.");
        setIsLoading(false);
        return;
      }

      const auditId = Number(id);

      if (!Number.isInteger(auditId) || auditId <= 0) {
        setError("Invalid audit identifier.");
        setIsLoading(false);
        return;
      }

      try {
        const result = await getWebsiteAuditById(auditId);

        setAudit(result);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load website audit.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadAudit();
  }, [id]);

  const insights = useMemo(() => {
    if (!audit) {
      return [];
    }

    return audit.pageAudits.flatMap((page) =>
      page.recommendations.map((recommendation) => ({
        pageId: page.id,
        pageUrl: page.url,
        score: page.score,
        issue: recommendation.message,
        type: recommendation.type,
        severity: recommendation.severity,
      })),
    );
  }, [audit]);

  const issueCount = insights.length;

  if (isLoading) {
    return (
      <AppShell
        title="Audit Result"
        subtitle="Website SEO audit results"
      >
        <div className="mx-auto w-full max-w-[975px] px-4 py-8 md:px-6">
          <section className="rounded-2xl border border-[#F3F4F6] bg-white">
            <StatusState
              variant="loading"
              title="Loading audit"
              description="Fetching the website audit results."
            />
          </section>
        </div>
      </AppShell>
    );
  }

  if (error || !audit) {
    return (
      <AppShell
        title="Audit Result"
        subtitle="Website SEO audit results"
      >
        <div className="mx-auto w-full max-w-[975px] px-4 py-8 md:px-6">
          <section className="rounded-2xl border border-[#F3F4F6] bg-white">
            <StatusState
              variant="error"
              title="Unable to load audit"
              description={
                error ||
                "The requested audit could not be found."
              }
              actionLabel="Back to Home"
              onAction={() => navigate("/")}
            />
          </section>
        </div>
      </AppShell>
    );
  }

  if (audit.pageAudits.length === 0) {
    return (
      <AppShell
        title="Audit Result"
        subtitle="Website SEO audit results"
      >
        <div className="mx-auto w-full max-w-[975px] px-4 py-8 md:px-6">
          <section className="rounded-2xl border border-[#F3F4F6] bg-white">
            <StatusState
              variant="empty"
              title="No pages were crawled"
              description="The crawler completed the audit but did not find any pages that could be analyzed."
              actionLabel="Back to Home"
              onAction={() => navigate("/")}
            />
          </section>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Audit Result"
      subtitle="Website SEO audit results"
    >
      <div className="mx-auto w-full max-w-[975px] px-4 py-5 md:px-6 md:py-6">
        {/* Audit heading */}
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#99A1AF] transition hover:text-[#E91E8C]"
            >
              <ArrowLeft size={14} />
              Back to Home
            </button>

            <h2 className="truncate text-lg font-bold text-[#1E2939]">
              {audit.url}
            </h2>

            <p className="mt-1 text-xs text-[#99A1AF]">
              Audited {formatDate(audit.createdAt)}
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#F0FDF4] px-3 py-1.5 text-xs font-medium text-[#16A34A]">
            <CheckCircle2 size={13} />
            Completed
          </div>
        </div>

        {/* Overview */}
        <section className="rounded-2xl border border-[#F3F4F6] bg-white p-5 md:p-6">
          <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(233,30,140,0.09)] px-3 py-1 text-xs font-semibold text-[#E91E8C]">
                <Gauge size={12} />
                SEO Performance
              </span>

              <div className="mt-4 flex items-end gap-2">
                <span className="text-5xl font-bold leading-none text-[#1E2939]">
                  {audit.averageScore}
                </span>

                <span className="pb-1 text-sm text-[#99A1AF]">
                  / 100
                </span>
              </div>

              <p className="mt-2 max-w-md text-sm leading-6 text-[#6A7282]">
                Average SEO score across the pages included in
                this website audit.
              </p>

              <div className="mt-4 h-2 max-w-md overflow-hidden rounded-full bg-[#F3F4F6]">
                <div
                  className="h-full rounded-full bg-[#E91E8C]"
                  style={{
                    width: `${Math.max(
                      0,
                      Math.min(audit.averageScore, 100),
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <SummaryCard
                icon={Globe}
                label="Pages Crawled"
                value={audit.pagesCrawled}
              />

              <SummaryCard
                icon={AlertTriangle}
                label="Issues Found"
                value={issueCount}
              />

              <SummaryCard
                icon={Gauge}
                label="Highest Score"
                value={audit.highestScore}
              />

              <SummaryCard
                icon={Clock3}
                label="Crawl Time"
                value={formatDuration(audit.crawlTimeMs)}
              />
            </div>
          </div>
        </section>

        {/* Audit Insights */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-[#F3F4F6] bg-white">
          <div className="flex items-center justify-between border-b border-[#F3F4F6] px-6 py-4">
            <h3 className="text-sm font-semibold text-[#364153]">
              Audit Insights
            </h3>

            <button
              type="button"
              onClick={() => navigate(`/audits/${audit.id}`)}
              className="text-xs font-medium text-[#E91E8C]"
            >
              View page details →
            </button>
          </div>

          {insights.length === 0 ? (
            <StatusState
              variant="success"
              title="No SEO issues found"
              description="All analyzed pages passed the current recommendation checks."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="border-b border-[#F3F4F6] bg-[#F9FAFB]">
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#99A1AF]">
                      Page
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-[#99A1AF]">
                      Issue
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-[#99A1AF]">
                      Type
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-[#99A1AF]">
                      Severity
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {insights.map((insight, index) => (
                    <tr
                      key={`${insight.pageId}-${insight.type}-${index}`}
                      className="border-b border-[#F3F4F6] last:border-b-0"
                    >
                      <td className="max-w-[170px] px-6 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/audits/${audit.id}/pages/${insight.pageId}`,
                            )
                          }
                          className="block max-w-full truncate text-left text-xs font-medium text-[#364153] hover:text-[#E91E8C]"
                          title={insight.pageUrl}
                        >
                          {insight.pageUrl}
                        </button>
                      </td>

                      <td className="max-w-[290px] px-6 py-4">
                        <div className="text-xs leading-5 text-[#364153]">
                          {insight.issue}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-[8px] bg-[#F9FAFB] px-2.5 py-1 text-[11px] text-[#6A7282]">
                          {insight.type}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${getSeverityClass(
                            insight.severity,
                          )}`}
                        >
                          {insight.severity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Page summary */}
        <section className="mt-6 rounded-2xl border border-[#F3F4F6] bg-white p-5 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#364153]">
                Pages
              </h3>

              <p className="mt-1 text-xs text-[#99A1AF]">
                Pages included in this audit
              </p>
            </div>

            <span className="rounded-full bg-[#F9FAFB] px-3 py-1 text-xs text-[#6A7282]">
              {audit.pageAudits.length} pages
            </span>
          </div>

          <div className="mt-4 divide-y divide-[#F3F4F6]">
            {audit.pageAudits.map((page) => (
              <div
                key={page.id}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-[#364153]">
                    {page.url}
                  </div>

                  <div className="mt-1 text-xs text-[#99A1AF]">
                    Depth {page.depth} ·{" "}
                    {page.recommendations.length} issues
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getScoreClass(
                      page.score,
                    )}`}
                  >
                    {page.score}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/audits/${audit.id}/pages/${page.id}`,
                      )
                    }
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#E91E8C]"
                  >
                    Details
                    <ExternalLink size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

interface SummaryCardProps {
  icon: typeof Gauge;
  label: string;
  value: string | number;
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}: SummaryCardProps) {
  return (
    <div className="rounded-xl border border-[#F3F4F6] bg-[#FCFCFD] p-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-white">
        <Icon
          size={15}
          strokeWidth={1.7}
          className="text-[#E91E8C]"
        />
      </div>

      <div className="mt-3 text-lg font-bold text-[#1E2939]">
        {value}
      </div>

      <div className="mt-1 text-xs text-[#99A1AF]">
        {label}
      </div>
    </div>
  );
}

export default AuditResult;