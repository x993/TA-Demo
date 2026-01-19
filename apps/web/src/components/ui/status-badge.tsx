import { Badge } from "./badge";
import type { TenantStatus, EventType } from "@/types";

const statusLabels: Record<TenantStatus, string> = {
  critical: "Critical",
  watch: "Watch",
  stable: "Stable",
  improving: "Improving",
};

const eventTypeLabels: Record<EventType, string> = {
  sec_filing: "SEC Filing",
  news: "News",
  press_release: "Press Release",
  court_filing: "Court Filing",
  credit_report: "Credit Report",
};

interface StatusBadgeProps {
  status: TenantStatus;
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function StatusBadge({ status, size = "default", className }: StatusBadgeProps) {
  return (
    <Badge variant={status} size={size} className={className}>
      {statusLabels[status]}
    </Badge>
  );
}

interface EventTypeBadgeProps {
  type: EventType;
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function EventTypeBadge({ type, size = "default", className }: EventTypeBadgeProps) {
  return (
    <Badge variant={type} size={size} className={className}>
      {eventTypeLabels[type]}
    </Badge>
  );
}
