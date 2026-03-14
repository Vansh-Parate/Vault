import type { VerificationStatus } from '../../types';

interface BadgeProps {
  status: VerificationStatus;
}

const badgeStyles: Record<VerificationStatus, string> = {
  VERIFIED: 'bg-success-light text-success',
  PENDING: 'bg-warning-light text-warning',
  EXPIRED: 'bg-danger-light text-danger',
  REJECTED: 'bg-danger-light text-danger',
};

const badgeLabels: Record<VerificationStatus, string> = {
  VERIFIED: 'Verified',
  PENDING: 'Pending',
  EXPIRED: 'Expired',
  REJECTED: 'Rejected',
};

export default function Badge({ status }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-[999px] font-sans ${badgeStyles[status]}`}
    >
      {badgeLabels[status]}
    </span>
  );
}

interface ActionBadgeProps {
  action: string;
}

const actionStyles: Record<string, string> = {
  viewed: 'bg-cream-input text-dark-muted border border-beige',
  shared: 'bg-success-light text-success',
  exported: 'bg-warning-light text-warning',
};

export function ActionBadge({ action }: ActionBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-[999px] font-sans capitalize ${actionStyles[action] || actionStyles.viewed}`}
    >
      {action}
    </span>
  );
}
