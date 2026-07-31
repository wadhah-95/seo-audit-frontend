import type { ReactNode } from "react";
import { useParams } from "react-router-dom";

import Header from "./Header";
import Sidebar from "./Sidebar";

interface AppShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

function AppShell({
  title,
  subtitle,
  children,
}: AppShellProps) {
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

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Sidebar
        auditId={validAuditId}
        pageId={validPageId}
      />

      <div className="min-h-screen lg:pl-[244px]">
        <Header
          title={title}
          subtitle={subtitle}
        />

        <main className="min-h-[calc(100vh-74px)]">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppShell;