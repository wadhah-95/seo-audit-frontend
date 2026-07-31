import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Globe,
  TrendingUp,
} from "lucide-react";
import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { useNavigate } from "react-router-dom";

import AppShell from "../components/layout/AppShell";
import { createWebsiteAudit } from "../services/api";

const DEFAULT_MAX_DEPTH = 2;
const DEFAULT_MAX_PAGES = 10;

const loadingMessages = [
  "Starting audit...",
  "Crawling website...",
  "Analyzing pages...",
  "Saving results...",
];

const featureItems = [
  "Performance",
  "SEO Score",
  "Accessibility",
  "Best Practices",
];

const stats = [
  {
    label: "Total Audits",
    value: "248",
    icon: BarChart3,
    iconBg: "bg-[#FCE7F3]",
    iconColor: "text-[#E91E8C]",
  },
  {
    label: "Avg Score",
    value: "76",
    icon: TrendingUp,
    iconBg: "bg-[#ECFDF3]",
    iconColor: "text-[#00C950]",
  },
  {
    label: "Issues Found",
    value: "1,204",
    icon: AlertTriangle,
    iconBg: "bg-[#FFF7E6]",
    iconColor: "text-[#F59E0B]",
  },
  {
    label: "Pages Analyzed",
    value: "5,831",
    icon: Globe,
    iconBg: "bg-[#EFF6FF]",
    iconColor: "text-[#3B82F6]",
  },
];

const recentAudits = [
  {
    website: "example.com",
    date: "Jul 10, 2026",
    score: 87,
    status: "Completed",
  },
  {
    website: "mystore.io",
    date: "Jul 9, 2026",
    score: 64,
    status: "Warning",
  },
  {
    website: "blog.zerda.dev",
    date: "Jul 8, 2026",
    score: 92,
    status: "Completed",
  },
];

function isValidUrl(value: string) {
  try {
    const parsed = new URL(value);

    return (
      parsed.protocol === "http:" ||
      parsed.protocol === "https:"
    );
  } catch {
    return false;
  }
}

function getScoreColor(score: number) {
  if (score >= 80) {
    return "bg-[#22C55E]";
  }

  if (score >= 60) {
    return "bg-[#F59E0B]";
  }

  return "bg-[#EF4444]";
}

function Home() {
  const navigate = useNavigate();

  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [loadingMessageIndex, setLoadingMessageIndex] =
    useState(0);

  useEffect(() => {
    if (!isSubmitting) {
      setLoadingMessageIndex(0);
      return;
    }

    const interval = window.setInterval(() => {
      setLoadingMessageIndex((current) =>
        Math.min(
          current + 1,
          loadingMessages.length - 1,
        ),
      );
    }, 2500);

    return () => {
      window.clearInterval(interval);
    };
  }, [isSubmitting]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setError("Please enter a website URL.");
      return;
    }

    if (!isValidUrl(trimmedUrl)) {
      setError(
        "Please enter a valid URL starting with http:// or https://.",
      );
      return;
    }

    setError("");
    setIsSubmitting(true);
    setLoadingMessageIndex(0);

    try {
      const websiteAudit = await createWebsiteAudit(
        trimmedUrl,
        DEFAULT_MAX_DEPTH,
        DEFAULT_MAX_PAGES,
      );

      navigate(`/audits/${websiteAudit.id}`);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create website audit.",
      );

      setIsSubmitting(false);
    }
  }

  return (
    <AppShell
      title="Home"
      subtitle="Welcome back to your SEO dashboard"
    >
      <div className="mx-auto w-full max-w-[975px] px-4 py-5 md:px-6 md:py-8">
        {/* Main audit card */}
        <section className="overflow-hidden rounded-2xl border border-[#F3F4F6] bg-white">
          <div className="grid lg:grid-cols-[1.7fr_0.8fr]">
            {/* Left side */}
            <div className="p-7 md:p-8">
              {/* Badge */}
              <div className="inline-flex items-center rounded-full bg-[rgba(233,30,140,0.09)] px-3 py-1">
                <span className="text-xs font-semibold text-[#E91E8C]">
                  SEO Performance
                </span>
              </div>

              {/* Heading */}
              <h2 className="mt-4 max-w-[360px] text-2xl font-bold leading-[1.35] text-[#1E2939]">
                Monitor your Website&apos;s{" "}
                <span className="text-[#E91E8C]">
                  SEO Performance
                </span>
              </h2>

              {/* Description */}
              <p className="mt-3 max-w-[400px] text-sm leading-[1.65] text-[#6A7282]">
                Run a comprehensive SEO audit to uncover your
                score and get actionable insights to optimize
                your pages and rank higher.
              </p>

              {/* Audit form / loading state */}
              {isSubmitting ? (
                <div className="mt-6 rounded-[14px] border border-[#F3F4F6] bg-[#FCFCFD] p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(233,30,140,0.09)]">
                      <svg
                        className="h-4 w-4 animate-spin text-[#E91E8C]"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          className="opacity-25"
                          stroke="currentColor"
                          strokeWidth="3"
                        />

                        <path
                          d="M21 12a9 9 0 0 0-9-9"
                          className="opacity-100"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1E2939]">
                        {
                          loadingMessages[
                            loadingMessageIndex
                          ]
                        }
                      </p>

                      <p className="mt-0.5 text-xs text-[#99A1AF]">
                        This may take a moment while we analyze
                        your website.
                      </p>
                    </div>
                  </div>

                  {/* Indeterminate progress bar */}
                  <div
                    className="mt-5 h-2 overflow-hidden rounded-full bg-[#F3F4F6]"
                    aria-label="Audit in progress"
                  >
                    <div className="h-full w-1/3 animate-pulse rounded-full bg-[#E91E8C]" />
                  </div>
                </div>
              ) : (
                <>
                  <form
                    onSubmit={handleSubmit}
                    className="mt-6 flex flex-col gap-3 sm:flex-row"
                  >
                    <input
                      type="url"
                      value={url}
                      onChange={(event) =>
                        setUrl(event.target.value)
                      }
                      placeholder="https://yourwebsite.com"
                      aria-label="Website URL"
                      className="h-[41px] min-w-0 flex-1 rounded-[14px] border border-[#E5E7EB] px-4 text-sm text-[#1E2939] outline-none placeholder:text-[#99A1AF] focus:border-[#E91E8C]"
                    />

                    <button
                      type="submit"
                      className="flex h-[41px] shrink-0 items-center justify-center gap-2 rounded-[14px] bg-[#E91E8C] px-5 text-sm font-semibold text-white transition hover:bg-[#D91A80]"
                    >
                      Start Audit
                      <span>→</span>
                    </button>
                  </form>

                  {error && (
                    <p className="mt-3 text-xs font-medium text-[#DC2626]">
                      {error}
                    </p>
                  )}
                </>
              )}

              {/* Feature badges */}
              <div className="mt-7 flex flex-wrap gap-3">
                {featureItems.map((feature) => (
                  <div
                    key={feature}
                    className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#F9FAFB] px-3 py-1.5"
                  >
                    <CheckCircle2
                      size={12}
                      strokeWidth={1.8}
                      className="text-[#00C950]"
                    />

                    <span className="text-xs text-[#6A7282]">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right score panel */}
            <div className="flex flex-col items-center justify-center border-t border-[#F3F4F6] bg-[#FCFCFD] p-7 lg:border-l lg:border-t-0">
              {/* Overall score */}
              <div className="relative flex h-[154px] w-[154px] items-center justify-center">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "conic-gradient(#E91E8C 0deg 295deg, transparent 295deg 360deg)",
                    mask:
                      "radial-gradient(farthest-side, transparent calc(100% - 13px), #000 calc(100% - 12px))",
                    WebkitMask:
                      "radial-gradient(farthest-side, transparent calc(100% - 13px), #000 calc(100% - 12px))",
                  }}
                />

                <div className="text-center">
                  <div className="text-3xl font-bold leading-9 text-[#1E2939]">
                    82
                  </div>

                  <div className="text-xs text-[#99A1AF]">
                    Overall Score
                  </div>
                </div>
              </div>

              {/* Category scores */}
              <div className="mt-4 grid w-full max-w-[214px] grid-cols-2 gap-3">
                <ScoreMiniCard
                  label="Performance"
                  score="78"
                  tone="pink"
                />

                <ScoreMiniCard
                  label="SEO"
                  score="91"
                  tone="green"
                />

                <ScoreMiniCard
                  label="Accessibility"
                  score="85"
                  tone="blue"
                />

                <ScoreMiniCard
                  label="Best Practices"
                  score="74"
                  tone="orange"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(
            ({
              label,
              value,
              icon: Icon,
              iconBg,
              iconColor,
            }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-2xl border border-[#F3F4F6] bg-white px-4 py-4"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
                >
                  <Icon
                    size={18}
                    strokeWidth={1.8}
                    className={iconColor}
                  />
                </div>

                <div>
                  <div className="text-xl font-bold leading-6 text-[#1E2939]">
                    {value}
                  </div>

                  <div className="mt-1 text-xs text-[#99A1AF]">
                    {label}
                  </div>
                </div>
              </div>
            ),
          )}
        </div>

        {/* Recent audits */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-[#F3F4F6] bg-white">
          <div className="flex items-center justify-between border-b border-[#F3F4F6] px-5 py-4">
            <h3 className="text-sm font-semibold text-[#1E2939]">
              Recent Audits
            </h3>

            <button
              type="button"
              onClick={() => navigate("/audits")}
              className="text-xs font-medium text-[#E91E8C] hover:underline"
            >
              View all →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead>
                <tr className="border-b border-[#F3F4F6]">
                  <th className="px-5 py-3 text-xs font-medium text-[#99A1AF]">
                    Website
                  </th>

                  <th className="px-5 py-3 text-xs font-medium text-[#99A1AF]">
                    Date
                  </th>

                  <th className="px-5 py-3 text-xs font-medium text-[#99A1AF]">
                    Score
                  </th>

                  <th className="px-5 py-3 text-xs font-medium text-[#99A1AF]">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentAudits.map((audit) => (
                  <tr
                    key={`${audit.website}-${audit.date}`}
                    className="border-b border-[#F3F4F6] last:border-b-0"
                  >
                    <td className="px-5 py-4 text-sm font-medium text-[#334155]">
                      {audit.website}
                    </td>

                    <td className="px-5 py-4 text-xs text-[#99A1AF]">
                      {audit.date}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-semibold text-white ${getScoreColor(
                          audit.score,
                        )}`}
                      >
                        {audit.score}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={
                          audit.status === "Completed"
                            ? "rounded-full bg-[#ECFDF3] px-3 py-1 text-xs font-medium text-[#16A34A]"
                            : "rounded-full bg-[#FFF7E6] px-3 py-1 text-xs font-medium text-[#D97706]"
                        }
                      >
                        {audit.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

interface ScoreMiniCardProps {
  label: string;
  score: string;
  tone: "pink" | "green" | "blue" | "orange";
}

function ScoreMiniCard({
  label,
  score,
  tone,
}: ScoreMiniCardProps) {
  const styles = {
    pink: "text-[#E91E8C]",
    green: "text-[#16A34A]",
    blue: "text-[#3B82F6]",
    orange: "text-[#F59E0B]",
  };

  return (
    <div className="flex h-[53px] flex-col items-center justify-center rounded-[10px] border border-[#F3F4F6] bg-white">
      <span
        className={`text-base font-bold ${styles[tone]}`}
      >
        {score}
      </span>

      <span className="mt-0.5 text-[10px] text-[#99A1AF]">
        {label}
      </span>
    </div>
  );
}

export default Home;