import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import TopBar from '../components/layout/TopBar';
import Button from '../components/ui/Button';
import CredentialGrid from '../components/credentials/CredentialGrid';
import ShareModal from '../components/credentials/ShareModal';
import { useCredentials } from '../hooks/useCredentials';
import { useModal } from '../hooks/useModal';
import { CATEGORIES, CATEGORY_LABELS } from '../lib/constants';
import type { Credential } from '../types';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export default function Wallet() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'ALL';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const { credentials, loading } = useCredentials(
    activeCategory === 'ALL' ? undefined : activeCategory,
    searchQuery || undefined
  );

  const shareModal = useModal();
  const [shareCredential, setShareCredential] = useState<Credential | null>(null);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    if (cat === 'ALL') {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  const handleShare = (credential: Credential) => {
    setShareCredential(credential);
    shareModal.open();
  };

  const tabs = ['ALL', ...CATEGORIES];

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25 }}
    >
      <TopBar
        title="My Wallet"
        action={
          <Button onClick={() => navigate('/wallet/add')}>
            <Plus size={16} />
            Add Credential
          </Button>
        }
      />

      {/* Filter/Sort Bar */}
      <div className="flex items-center gap-4 mb-6">
        {/* Category tabs */}
        <div className="flex-1 overflow-x-auto category-tabs">
          <div className="flex gap-2">
            {tabs.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 py-1.5 text-sm rounded-[8px] font-sans whitespace-nowrap transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-sage text-white'
                    : 'bg-cream-input text-dark-mid hover:bg-beige/30'
                }`}
              >
                {cat === 'ALL' ? 'All' : CATEGORY_LABELS[cat] || cat}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative shrink-0">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-2 bg-cream-input border border-beige rounded-[8px] text-sm text-dark font-sans placeholder:text-dark-muted focus:border-sage focus:outline-none w-48"
          />
        </div>
      </div>

      {/* Credential Grid */}
      <CredentialGrid
        credentials={credentials}
        loading={loading}
        onShare={handleShare}
        emptyTitle={
          activeCategory === 'ALL'
            ? 'No credentials yet'
            : `No ${CATEGORY_LABELS[activeCategory]?.toLowerCase()} credentials stored`
        }
      />

      {/* Share Modal */}
      {shareCredential && (
        <ShareModal
          isOpen={shareModal.isOpen}
          onClose={() => {
            shareModal.close();
            setShareCredential(null);
          }}
          credentialId={shareCredential.id}
          credentialTitle={shareCredential.title}
        />
      )}
    </motion.div>
  );
}
