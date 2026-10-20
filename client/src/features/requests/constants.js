import { Clock, Loader, CheckCircle2 } from "lucide-react";

/**
 * Single source of truth for request statuses.
 * Badges, filters, the dashboard summary and the timeline all read from here.
 */
export const REQUEST_STATUS = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
};

// This is the order of the timeline and dashboard cards.
export const STATUS_ORDER = [
  REQUEST_STATUS.PENDING,
  REQUEST_STATUS.IN_PROGRESS,
  REQUEST_STATUS.RESOLVED,
];

export const STATUS_CONFIG = {
  [REQUEST_STATUS.PENDING]: {
    label: "Pending",
    description:
      "We have received your request and it is waiting to be picked up.",
    icon: Clock,
    // Orange tint, dark orange text: readable on white and cream
    badge: "bg-hope-50 text-hope-700 border-hope-100",
  },
  [REQUEST_STATUS.IN_PROGRESS]: {
    label: "In progress",
    description: "Someone is working on your request.",
    icon: Loader,
    badge: "bg-brand-50 text-brand-700 border-brand-100",
  },
  [REQUEST_STATUS.RESOLVED]: {
    label: "Resolved",
    description: "The issue has been fixed.",
    icon: CheckCircle2,
    badge: "bg-success-50 text-success-600 border-success-600/20",
  },
};
