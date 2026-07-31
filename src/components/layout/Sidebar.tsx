import {
  BarChart3,
  FileText,
  History,
  Home as HomeIcon,
  Settings,
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  auditId?: number;
  pageId?: number;
}

const navigation = [
  {
    label: "Home",
    to: "/",
    icon: HomeIcon,
    requiresAudit: false,
    requiresPage: false,
  },
  {
    label: "Audit History",
    to: "/audits",
    icon: History,
    requiresAudit: false,
    requiresPage: false,
  },
];

function Sidebar({
  auditId,
  pageId,
}: SidebarProps) {
  const contextualNavigation = [
    {
      label: "Audit Results",
      to: auditId ? `/audits/${auditId}` : "#",
      icon: BarChart3,
      disabled: !auditId,
    },
    {
      label: "Page Details",
      to:
        auditId && pageId
          ? `/audits/${auditId}/pages/${pageId}`
          : "#",
      icon: FileText,
      disabled: !auditId || !pageId,
    },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[244px] border-r border-[#F3F4F6] bg-[#F9FAFB] lg:flex lg:flex-col">
      {/* Branding */}
      <div className="flex h-[90px] items-center px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#E91E8C]">
            <span className="text-sm font-bold text-white">
              Z
            </span>
          </div>

          <div className="leading-none">
            <div className="text-[13px] font-bold tracking-[0.02em] text-[#1E2939]">
              ZERDA
            </div>

            <div className="mt-0.5 text-[9px] font-medium tracking-[0.18em] text-[#99A1AF]">
              ACADEMY
            </div>
          </div>
        </div>
      </div>

      {/* Primary navigation */}
      <nav className="px-6">
        <div className="space-y-2">
          {navigation.map(
            ({ label, to, icon: Icon }) => (
              <NavLink
                key={label}
                to={to}
                className={({ isActive }) =>
                  [
                    "flex h-10 items-center gap-3 rounded-[10px] px-3 text-sm transition",
                    isActive
                      ? "bg-[#E91E8C] font-medium text-white shadow-sm"
                      : "text-[#6A7282] hover:bg-white hover:text-[#1E2939]",
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

        {/* Contextual navigation */}
        <div className="mt-4 border-t border-[#F3F4F6] pt-4">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#99A1AF]">
            Current Audit
          </p>

          <div className="space-y-2">
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
                    className="flex h-10 cursor-not-allowed items-center gap-3 rounded-[10px] px-3 text-sm text-[#CBD5E1]"
                    title={
                      label === "Audit Results"
                        ? "Open an audit first"
                        : "Open a page from an audit first"
                    }
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
                    className={({ isActive }) =>
                      [
                        "flex h-10 items-center gap-3 rounded-[10px] px-3 text-sm transition",
                        isActive
                          ? "bg-[#E91E8C] font-medium text-white shadow-sm"
                          : "text-[#6A7282] hover:bg-white hover:text-[#1E2939]",
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
        </div>
      </nav>

      {/* Settings */}
      <div className="mt-auto px-6 pb-8">
        <NavLink
          to="/settings"
          className="flex h-10 items-center gap-3 rounded-[10px] px-3 text-sm text-[#6A7282] transition hover:bg-white hover:text-[#1E2939]"
        >
          <Settings
            size={16}
            strokeWidth={1.8}
          />

          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;