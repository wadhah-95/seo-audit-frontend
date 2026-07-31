import {
  BarChart3,
  Bell,
  FileText,
  History,
  Home as HomeIcon,
  Menu,
  Search,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink, useParams } from "react-router-dom";

interface HeaderProps {
  title: string;
  subtitle: string;
}

function Header({ title, subtitle }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const params = useParams<{
    id?: string;
    auditId?: string;
    pageId?: string;
  }>();

  const auditIdValue = params.auditId ?? params.id;

  const auditId = auditIdValue
    ? Number(auditIdValue)
    : undefined;

  const pageId = params.pageId
    ? Number(params.pageId)
    : undefined;

  const validAuditId =
    auditId !== undefined &&
    Number.isInteger(auditId) &&
    auditId > 0
      ? auditId
      : undefined;

  const validPageId =
    pageId !== undefined &&
    Number.isInteger(pageId) &&
    pageId > 0
      ? pageId
      : undefined;

  const contextualNavigation = [
    {
      label: "Audit Results",
      to: validAuditId
        ? `/audits/${validAuditId}`
        : "#",
      icon: BarChart3,
      disabled: !validAuditId,
    },
    {
      label: "Page Details",
      to:
        validAuditId && validPageId
          ? `/audits/${validAuditId}/pages/${validPageId}`
          : "#",
      icon: FileText,
      disabled: !validAuditId || !validPageId,
    },
  ];

  return (
    <>
      <header className="flex min-h-[74px] items-center justify-between border-b border-[#F3F4F6] bg-white px-4 py-4 md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            aria-label={
              isMenuOpen
                ? "Close navigation"
                : "Open navigation"
            }
            onClick={() =>
              setIsMenuOpen((current) => !current)
            }
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-[#6A7282] transition hover:bg-[#F9FAFB] hover:text-[#1E2939] lg:hidden"
          >
            {isMenuOpen ? (
              <X size={18} strokeWidth={1.8} />
            ) : (
              <Menu size={18} strokeWidth={1.8} />
            )}
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold leading-6 text-[#1E2939]">
              {title}
            </h1>

            <p className="mt-0.5 truncate text-xs leading-4 text-[#99A1AF]">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="ml-4 flex shrink-0 items-center gap-3">
          {/* Search */}
          <div className="relative hidden sm:block">
            <Search
              size={14}
              strokeWidth={1.7}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#99A1AF]"
            />

            <input
              type="search"
              placeholder="Search..."
              aria-label="Search"
              className="h-[34px] w-[192px] rounded-[10px] border border-[#F3F4F6] bg-[#F9FAFB] py-2 pl-8 pr-4 text-xs text-[#1E2939] outline-none placeholder:text-black/50 focus:border-[#E91E8C]"
            />
          </div>

          {/* Notifications */}
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-8 w-8 items-center justify-center rounded-[10px] text-[#99A1AF] transition hover:bg-[#F9FAFB] hover:text-[#1E2939]"
          >
            <Bell size={16} strokeWidth={1.7} />

            <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#E91E8C]" />
          </button>

          {/* Avatar */}
          <div
            aria-label="User profile"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E91E8C]"
          >
            <span className="text-xs font-bold leading-4 text-white">
              Z
            </span>
          </div>
        </div>
      </header>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="fixed inset-x-0 top-[74px] z-50 border-b border-[#F3F4F6] bg-white shadow-sm lg:hidden">
          <nav className="p-4">
            <div className="space-y-2">
              {/* Primary navigation */}
              <NavLink
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  [
                    "flex h-11 items-center gap-3 rounded-[10px] px-4 text-sm transition",
                    isActive
                      ? "bg-[#E91E8C] font-medium text-white"
                      : "text-[#6A7282] hover:bg-[#F9FAFB] hover:text-[#1E2939]",
                  ].join(" ")
                }
              >
                <HomeIcon size={16} strokeWidth={1.8} />
                <span>Home</span>
              </NavLink>

              <NavLink
                to="/audits"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  [
                    "flex h-11 items-center gap-3 rounded-[10px] px-4 text-sm transition",
                    isActive
                      ? "bg-[#E91E8C] font-medium text-white"
                      : "text-[#6A7282] hover:bg-[#F9FAFB] hover:text-[#1E2939]",
                  ].join(" ")
                }
              >
                <History size={16} strokeWidth={1.8} />
                <span>Audit History</span>
              </NavLink>

              {/* Contextual navigation */}
              <div className="my-3 border-t border-[#F3F4F6]" />

              <p className="mb-2 px-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#99A1AF]">
                Current Audit
              </p>

              {contextualNavigation.map(
                ({
                  label,
                  to,
                  icon: Icon,
                  disabled,
                }) =>
                  disabled ? (
                    <div
                      key={label}
                      className="flex h-11 cursor-not-allowed items-center gap-3 rounded-[10px] px-4 text-sm text-[#CBD5E1]"
                    >
                      <Icon
                        size={16}
                        strokeWidth={1.8}
                      />

                      <span>{label}</span>
                    </div>
                  ) : (
                    <NavLink
                      key={label}
                      to={to}
                      onClick={() =>
                        setIsMenuOpen(false)
                      }
                      className={({ isActive }) =>
                        [
                          "flex h-11 items-center gap-3 rounded-[10px] px-4 text-sm transition",
                          isActive
                            ? "bg-[#E91E8C] font-medium text-white"
                            : "text-[#6A7282] hover:bg-[#F9FAFB] hover:text-[#1E2939]",
                        ].join(" ")
                      }
                    >
                      <Icon
                        size={16}
                        strokeWidth={1.8}
                      />

                      <span>{label}</span>
                    </NavLink>
                  ),
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

export default Header;