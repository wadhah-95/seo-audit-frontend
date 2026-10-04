import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  FileSearch,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AppShell from "../components/layout/AppShell";
import StatusState from "../components/layout/ui/audit/StatusState";
import {
  getWebsiteAudits,
  type WebsiteAudit,
} from "../services/api";

function getScoreClass(score: number) {
  if (score >= 80) {
    return "bg-[#ECFDF3] text-[#16A34A]";
  }

  if (score >= 60) {
    return "bg-[#FFF7E6] text-[#D97706]";
  }

  return "bg-[#FEF2F2] text-[#DC2626]";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function AuditHistory() {
  const navigate = useNavigate();

  const [audits, setAudits] = useState<WebsiteAudit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAudits() {
      try {
        setError("");

        const result = await getWebsiteAudits();

        setAudits(result);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load audit history.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadAudits();
  }, []);

  return (
    <AppShell
      title="Audit History"
      subtitle="All your past SEO audits in one place"
    >
      <div className="mx-auto w-full max-w-[975px] px-4 py-5 md:px-6 md:py-8">
        {/* Page intro */}
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#E6F4F7] px-3 py-1">
              <CalendarDays
                size={12}
                className="text-[#0e7490]"
              />

              <span className="text-xs font-semibold text-[#0e7490]">
                Audit History
              </span>
            </div>

            <h2 className="mt-3 text-2xl font-bold text-[#1E2939]">
              Your previous audits
            </h2>

            <p className="mt-2 max-w-[600px] text-sm text-[#6A7282]">
              Review previous website analyses and open any audit
              for a detailed breakdown.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="hidden shrink-0 rounded-[12px] bg-[#0b2a4a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0e7490] sm:block"
          >
            New Audit
          </button>
        </div>

        {/* History card */}
        <section className="overflow-hidden rounded-2xl border border-[#F3F4F6] bg-white">
          <div className="flex items-center justify-between border-b border-[#F3F4F6] px-5 py-4 md:px-6">
            <div className="flex items-center gap-2">
              <FileSearch
                size={16}
                className="text-[#0e7490]"
              />

              <h3 className="text-sm font-semibold text-[#364153]">
                Previous Audits
              </h3>
            </div>

            <span className="rounded-full bg-[#F9FAFB] px-3 py-1 text-xs text-[#6A7282]">
              {audits.length} audits
            </span>
          </div>

          {isLoading && (
            <StatusState
              variant="loading"
              title="Loading audit history"
              description="Fetching your previous website audits."
            />
          )}

          {!isLoading && error && (
            <StatusState
              variant="error"
              title="Unable to load audit history"
              description={error}
              actionLabel="Try Again"
              onAction={() => window.location.reload()}
            />
          )}

          {!isLoading && !error && audits.length === 0 && (
            <StatusState
              variant="empty"
              title="No audits yet"
              description="Start your first website audit and it will appear here."
              actionLabel="Start an Audit"
              onAction={() => navigate("/")}
            />
          )}

          {!isLoading && !error && audits.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px]">
                <thead>
                  <tr className="border-b border-[#F3F4F6] bg-[#F9FAFB]">
                    <th className="px-6 py-3.5 text-left text-xs font-medium text-[#99A1AF]">
                      Website
                    </th>

                    <th className="px-6 py-3.5 text-left text-xs font-medium text-[#99A1AF]">
                      Date
                    </th>

                    <th className="px-6 py-3.5 text-left text-xs font-medium text-[#99A1AF]">
                      Score
                    </th>

                    <th className="px-6 py-3.5 text-left text-xs font-medium text-[#99A1AF]">
                      Pages
                    </th>

                    <th className="px-6 py-3.5 text-left text-xs font-medium text-[#99A1AF]">
                      Issues
                    </th>

                    <th className="px-6 py-3.5 text-left text-xs font-medium text-[#99A1AF]">
                      Status
                    </th>

                    <th className="px-6 py-3.5" />
                  </tr>
                </thead>

                <tbody>
                  {audits.map((audit) => (
                    <tr
                      key={audit.id}
                      className="border-b border-[#F3F4F6] last:border-b-0 hover:bg-[#FCFCFD]"
                    >
                      <td className="max-w-[270px] px-6 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/audits/${audit.id}`)
                          }
                          className="block max-w-full truncate text-left text-sm font-medium text-[#364153] hover:text-[#0e7490]"
                          title={audit.url}
                        >
                          {audit.url}
                        </button>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-xs text-[#6A7282]">
                        {formatDate(audit.createdAt)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex min-w-9 items-center justify-center rounded-full px-2.5 py-1 text-xs font-semibold ${getScoreClass(
                            audit.averageScore,
                          )}`}
                        >
                          {audit.averageScore}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-[#6A7282]">
                        {audit.pagesCrawled}
                      </td>

                      <td className="px-6 py-4 text-sm text-[#6A7282]">
                        {audit.issuesFound ?? 0}
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF3] px-3 py-1 text-xs font-medium text-[#16A34A]">
                          <CheckCircle2 size={12} />
                          {audit.status ?? "Completed"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/audits/${audit.id}`)
                          }
                          className="inline-flex h-8 w-8 items-center justify-center rounded-[9px] text-[#99A1AF] transition hover:bg-[#E6F4F7] hover:text-[#0e7490]"
                          aria-label={`Open ${audit.url}`}
                        >
                          <ArrowUpRight
                            size={15}
                            strokeWidth={1.8}
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Mobile action */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-4 w-full rounded-[12px] bg-[#0b2a4a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0e7490] sm:hidden"
        >
          New Audit
        </button>
      </div>
    </AppShell>
  );
}

export default AuditHistory;