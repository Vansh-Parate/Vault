import { useNavigate } from 'react-router-dom';
import { Eye, Share2, MoreHorizontal } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { Credential } from '../../types';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { CATEGORY_ICONS } from '../../lib/constants';
import { formatDate } from '../../lib/utils';

interface CredentialCardProps {
  credential: Credential;
  onShare?: (credential: Credential) => void;
}

export default function CredentialCard({ credential, onShare }: CredentialCardProps) {
  const navigate = useNavigate();
  const iconName = CATEGORY_ICONS[credential.category] as keyof typeof Icons;
  const IconComponent = (Icons[iconName] as any) || Icons.FileText;

  return (
    <div className="bg-cream-card border border-beige rounded-[14px] p-6 hover:border-sage/40 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-[10px] bg-sage-light flex items-center justify-center">
          <IconComponent size={20} className="text-sage" />
        </div>
        <Badge status={credential.status} />
      </div>

      {/* Content */}
      <h3 className="font-display text-[17px] text-dark mb-1 leading-snug">
        {credential.title}
      </h3>
      {credential.issuer && (
        <p className="text-[13px] text-dark-muted font-sans mb-0.5">{credential.issuer}</p>
      )}
      <p className="text-xs text-dark-muted font-sans">
        Issued: {formatDate(credential.issuedDate)}
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
