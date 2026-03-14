import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import * as Icons from 'lucide-react';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import api from '../lib/api';
import type { Credential } from '../types';
import { CATEGORY_ICONS, CATEGORY_LABELS, CATEGORY_FIELDS } from '../lib/constants';
import { formatDate } from '../lib/utils';

export default function ShareView() {
  const { token } = useParams();
  const [credential, setCredential] = useState<Credential | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShared = async () => {
      try {
        const { data } = await api.get(`/share/${token}`);
        setCredential(data.credential);
        setExpiresAt(data.expiresAt);
      } catch (err: any) {
        if (err.response?.status === 410) {
          setError('This share link has expired.');
        } else if (err.response?.status === 404) {
          setError('Share link not found.');
        } else {
          setError('Something went wrong.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchShared();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="max-w-lg w-full mx-4 bg-cream-card border border-beige rounded-[14px] p-8">
          <Skeleton className="h-6 w-48 mb-4 mx-auto" />
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-40 mb-4" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-4 w-full mb-3" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="max-w-md w-full mx-4 bg-cream-card border border-beige rounded-[14px] p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-danger-light flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={24} className="text-danger" />
          </div>
          <h2 className="font-display text-xl text-dark mb-2">Link Unavailable</h2>
          <p className="text-sm text-dark-muted font-sans">{error}</p>
        </div>
      </div>
    );
  }

  if (!credential) return null;

  const iconName = CATEGORY_ICONS[credential.category] as keyof typeof Icons;
  const IconComponent = (Icons[iconName] as any) || Icons.FileText;
  const fields = CATEGORY_FIELDS[credential.category] || [];
  const metadata = (credential.metadata || {}) as Record<string, any>;

  return (
    <div className="min-h-screen bg-cream">
      {/* Top watermark */}
      <div className="bg-dark py-2.5 px-4 text-center">
        <p className="text-xs text-beige font-sans">
          Shared via <strong className="text-cream">Vault</strong> · Personal Data Wallet
        </p>
      </div>

      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="bg-cream-card border border-beige rounded-[14px] p-6">
          {/* Category + Status */}
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sage-light text-sage text-xs font-sans font-medium rounded-[999px]">
              <IconComponent size={14} />
              {CATEGORY_LABELS[credential.category]}
            </span>
            <Badge status={credential.status} />
          </div>

          {/* Title */}
          <h1 className="font-display text-2xl text-dark mb-1">{credential.title}</h1>
          {credential.issuer && (
            <p className="text-base text-dark-mid font-sans mb-1">{credential.issuer}</p>
          )}
          <div className="flex gap-3 text-sm text-dark-muted font-sans mb-6">
            {credential.issuedDate && <span>Issued: {formatDate(credential.issuedDate)}</span>}
            {credential.expiryDate && <span>Expires: {formatDate(credential.expiryDate)}</span>}
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

          {/* Expiry notice */}
          {expiresAt && (
            <div className="mt-4 pt-4 border-t border-beige">
              <p className="text-xs text-warning font-sans">
                This link expires on {formatDate(expiresAt)}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-dark-muted font-sans">
            Want to manage your own credentials?{' '}
            <span className="text-sage font-medium">vault.app</span>
          </p>
        </div>
      </div>
    </div>
  );
}
