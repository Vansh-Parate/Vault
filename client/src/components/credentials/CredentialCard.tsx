import { useNavigate } from 'react-router-dom';
import { Eye, Share2, MoreHorizontal } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { Credential } from '../../types';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { CATEGORY_ICONS } from '../../lib/constants';
import { formatDate } from '../../lib/utils';
import DigiLockerBadge from '../digilocker/DigiLockerBadge';

interface CredentialCardProps {
  credential: Credential;
  onShare?: (credential: Credential) => void;
}

export default function CredentialCard({ credential, onShare }: CredentialCardProps) {
  const navigate = useNavigate();
  const iconName = CATEGORY_ICONS[credential.category] as keyof typeof Icons;
  const IconComponent = (Icons[iconName] as any) || Icons.FileText;

  const metadata = (credential.metadata || {}) as Record<string, any>;
  const aadhaarMasked =
    credential.category === 'IDENTITY' &&
    credential.title.toLowerCase().includes('aadhaar')
      ? (() => {
          const last4 =
            (metadata.aadhaarLast4 as string | undefined) ||
            (metadata.aadhaar_last4 as string | undefined) ||
            (metadata.aadhaar as string | undefined) ||
            (metadata.idNumber as string | undefined);
          if (!last4) return null;
          const digits = last4.replace(/\D/g, '');
          if (!digits) return null;
          const four = digits.slice(-4);
          return `XXXX-XXXX-${four}`;
        })()
      : null;

  return (
    <div className="bg-cream-card border border-beige rounded-[14px] p-6 hover:border-sage/40 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-[10px] bg-sage-light flex items-center justify-center">
          <IconComponent size={20} className="text-sage" />
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge status={credential.status} />
          {credential.source === 'DIGILOCKER' && <DigiLockerBadge />}
        </div>
      </div>

      {/* Content */}
      <h3 className="font-display text-[17px] text-dark mb-1 leading-snug">
        {credential.title}
      </h3>
      {credential.issuer && (
        <p className="text-[13px] text-dark-muted font-sans mb-0.5">{credential.issuer}</p>
      )}
      <p className="text-xs text-dark-muted font-sans">
        {aadhaarMasked
          ? `Aadhaar: ${aadhaarMasked}`
          : `Issued: ${formatDate(credential.issuedDate)}`}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-beige">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => navigate(`/wallet/${credential.id}`)}
        >
          <Eye size={14} />
          View
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onShare?.(credential)}
        >
          <Share2 size={14} />
          Share
        </Button>
        <button
          className="ml-auto p-1.5 text-dark-muted hover:text-dark transition-colors cursor-pointer"
          onClick={() => navigate(`/wallet/${credential.id}`)}
        >
          <MoreHorizontal size={16} />
        </button>
      </div>
    </div>
  );
}
