import { useParams, useNavigate } from 'react-router-dom';
import { Download, Link, Edit, Trash2, FileText } from 'lucide-react';
import * as Icons from 'lucide-react';
import { motion } from 'framer-motion';
import TopBar from '../components/layout/TopBar';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import ShareModal from '../components/credentials/ShareModal';
import DeleteModal from '../components/credentials/DeleteModal';
import { useCredential } from '../hooks/useCredentials';
import { useModal } from '../hooks/useModal';
import { CATEGORY_ICONS, CATEGORY_LABELS, CATEGORY_FIELDS } from '../lib/constants';
import { formatDate } from '../lib/utils';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export default function CredentialView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { credential, loading } = useCredential(id);
  const shareModal = useModal();
  const deleteModal = useModal();

  if (loading) {
    return (
      <div>
        <TopBar title="" />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-cream-card border border-beige rounded-[14px] p-6">
            <Skeleton className="h-5 w-24 mb-3" />
            <Skeleton className="h-7 w-64 mb-2" />
            <Skeleton className="h-4 w-40 mb-4" />
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-4 w-full mb-3" />
            ))}
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-48 w-full rounded-[14px]" />
          </div>
        </div>
      </div>
    );
  }

  if (!credential) {
    return (
      <div>
        <TopBar title="Credential Not Found" />
        <p className="text-dark-muted font-sans">This credential doesn't exist or has been removed.</p>
      </div>
    );
  }

  const iconName = CATEGORY_ICONS[credential.category] as keyof typeof Icons;
  const IconComponent = (Icons[iconName] as any) || Icons.FileText;
  const fields = CATEGORY_FIELDS[credential.category] || [];
  const metadata = (credential.metadata || {}) as Record<string, any>;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25 }}
    >
      <TopBar
        title=""
        action={
          <Button variant="ghost" onClick={() => navigate('/wallet')}>
            ← Back to Wallet
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left column - Details */}
        <div className="lg:col-span-3 bg-cream-card border border-beige rounded-[14px] p-6">
          {/* Category + Status */}
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sage-light text-sage text-xs font-sans font-medium rounded-[999px]">
              <IconComponent size={14} />
              {CATEGORY_LABELS[credential.category]}
            </span>
            <Badge status={credential.status} />
          </div>

          {/* Title */}
          <h2 className="font-display text-[28px] text-dark mb-1">{credential.title}</h2>
          {credential.issuer && (
            <p className="text-base text-dark-mid font-sans mb-1">{credential.issuer}</p>
          )}
          <div className="flex gap-4 text-sm text-dark-muted font-sans mb-6">
            {credential.issuedDate && (
              <span>Issued: {formatDate(credential.issuedDate)}</span>
            )}
            {credential.expiryDate && (
              <span>Expires: {formatDate(credential.expiryDate)}</span>
            )}
          </div>

          {/* Metadata */}
          <div className="space-y-0">
            {fields
              .filter((f) => f.type !== 'file' && metadata[f.name])
              .map((field) => (
                <div
                  key={field.name}
                  className="flex justify-between py-3 border-b border-beige"
                >
                  <span className="text-[13px] text-dark-muted font-sans">{field.label}</span>
                  <span className="text-sm text-dark font-sans text-right max-w-[60%]">
                    {metadata[field.name]}
                  </span>
                </div>
              ))}
          </div>

          {/* Credential hash */}
          <div className="mt-4 pt-4 border-t border-beige">
            <p className="text-[11px] text-dark-muted font-mono">
              ID: {credential.id}
            </p>
          </div>
        </div>

        {/* Right column - Document + Actions */}
        <div className="lg:col-span-2 space-y-4">
          {/* Document preview */}
          <div className="bg-cream-card border border-beige rounded-[14px] p-6">
            <p className="text-[13px] text-dark-muted font-sans mb-3">Document</p>
            {credential.documentUrl ? (
              <div>
                <div className="flex items-center gap-3 p-4 bg-cream-input rounded-[8px] mb-3">
                  <FileText size={28} className="text-sage shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-dark font-sans truncate">
                      {credential.documentName || 'Document'}
                    </p>
                  </div>
                </div>
                <a
                  href={credential.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Button variant="ghost" size="sm">
                    <Download size={14} />
                    Download
                  </Button>
                </a>
              </div>
            ) : (
              <div className="flex items-center justify-center p-8 bg-cream-input rounded-[8px]">
                <p className="text-sm text-dark-muted font-sans">No document uploaded</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="bg-cream-card border border-beige rounded-[14px] p-6 space-y-3">
            <Button fullWidth onClick={shareModal.open}>
              <Link size={16} />
              Generate Share Link
            </Button>
            <Button variant="ghost" fullWidth onClick={() => navigate(`/wallet/${credential.id}/edit`)}>
              <Edit size={16} />
              Edit
            </Button>
            <Button variant="danger" fullWidth onClick={deleteModal.open}>
              <Trash2 size={16} />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ShareModal
        isOpen={shareModal.isOpen}
        onClose={shareModal.close}
        credentialId={credential.id}
        credentialTitle={credential.title}
      />
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        credentialId={credential.id}
        credentialTitle={credential.title}
        onDeleted={() => navigate('/wallet')}
      />
    </motion.div>
  );
}
