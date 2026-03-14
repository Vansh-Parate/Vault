import { useState } from 'react';
import { Copy, Link } from 'lucide-react';
import api from '../../lib/api';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  credentialId: string;
  credentialTitle: string;
}

const expiryOptions = [
  { value: '24h', label: '24 hours' },
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: 'never', label: 'Never' },
];

export default function ShareModal({ isOpen, onClose, credentialId, credentialTitle }: ShareModalProps) {
  const [selectedExpiry, setSelectedExpiry] = useState('7d');
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateLink = async () => {
    try {
      setLoading(true);
      const { data } = await api.post(`/credentials/${credentialId}/share`, {
        expiresIn: selectedExpiry,
      });
      const url = `${window.location.origin}/share/${data.token}`;
      setShareUrl(url);
    } catch (err) {
      console.error('Failed to create share link', err);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setShareUrl(null);
    setCopied(false);
    setSelectedExpiry('7d');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Share Credential">
      <p className="text-sm text-dark-muted font-sans mb-4">
        Create a shareable link for <strong className="text-dark">{credentialTitle}</strong>
      </p>

      {/* Expiry selector */}
      <div className="mb-4">
        <label className="text-[13px] font-medium text-dark-muted font-sans mb-2 block">
          Link expiry
        </label>
        <div className="flex gap-2">
          {expiryOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelectedExpiry(opt.value)}
              className={`px-3 py-1.5 text-sm rounded-[8px] font-sans transition-colors cursor-pointer ${
                selectedExpiry === opt.value
                  ? 'bg-sage text-white'
                  : 'bg-cream-input text-dark-mid border border-beige hover:bg-beige/30'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {!shareUrl ? (
        <Button onClick={generateLink} fullWidth disabled={loading}>
          <Link size={16} />
          {loading ? 'Generating...' : 'Generate Share Link'}
        </Button>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-3 bg-cream-input border border-beige rounded-[8px]">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-transparent text-sm text-dark font-mono outline-none"
            />
            <button
              onClick={copyLink}
              className="p-1.5 text-sage hover:text-sage-hover transition-colors cursor-pointer"
            >
              <Copy size={16} />
            </button>
          </div>
          {copied && (
            <p className="text-xs text-sage font-sans">Link copied to clipboard!</p>
          )}
          <p className="text-xs text-dark-muted font-sans">
            Anyone with this link can view the credential details.
          </p>
        </div>
      )}
    </Modal>
  );
}
