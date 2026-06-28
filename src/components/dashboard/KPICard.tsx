import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  label: ReactNode;
  value: ReactNode;
  trend?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function KPICard({
  label,
  value,
  trend,
  icon,
  className = "",
}: KPICardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl p-5 text-white shadow-card transition-all hover:shadow-soft hover:scale-105 border-0",
        className
      )}
    >
      {/* Decorative blur circle */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

      {/* Content */}
      <div className="relative">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-white/85">{label}</p>
          </div>
          {icon && (
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/20 backdrop-blur">
              {icon}
            </div>
          )}
        </div>

        <div className="mb-4 mt-2">
          <p className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight truncate">{value}</p>
        </div>

        {trend && (
          <div className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold backdrop-blur">
            {trend}
          </div>
        )}
      </div>
    </div>
  );
}
