import type { ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";

type StatusStateVariant =
  | "loading"
  | "error"
  | "empty"
  | "success";

interface StatusStateProps {
  variant: StatusStateVariant;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

function StatusState({
  variant,
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: StatusStateProps) {
  const defaultIcon = {
    loading: (
      <LoaderCircle
        size={24}
        className="animate-spin text-[#E91E8C]"
      />
    ),
    error: (
      <AlertTriangle
        size={22}
        className="text-[#DC2626]"
      />
    ),
    empty: (
      <AlertTriangle
        size={22}
        className="text-[#F59E0B]"
      />
    ),
    success: (
      <CheckCircle2
        size={22}
        className="text-[#16A34A]"
      />
    ),
  }[variant];

  const iconBackground = {
    loading: "bg-[rgba(233,30,140,0.09)]",
    error: "bg-[#FEF2F2]",
    empty: "bg-[#FFF7E6]",
    success: "bg-[#ECFDF3]",
  }[variant];

  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${iconBackground}`}
      >
        {icon ?? defaultIcon}
      </div>

      <h2 className="mt-4 text-sm font-semibold text-[#1E2939]">
        {title}
      </h2>

      {description && (
        <p className="mt-2 max-w-md text-xs leading-5 text-[#6A7282]">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 rounded-[12px] bg-[#E91E8C] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#D91A80]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default StatusState;