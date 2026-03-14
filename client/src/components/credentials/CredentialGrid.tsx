import type { Credential } from '../../types';
import CredentialCard from './CredentialCard';
import { CardSkeleton } from '../ui/Skeleton';
import EmptyState from '../ui/EmptyState';

interface CredentialGridProps {
  credentials: Credential[];
  loading: boolean;
  onShare?: (credential: Credential) => void;
  emptyTitle?: string;
}

export default function CredentialGrid({ credentials, loading, onShare, emptyTitle }: CredentialGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (credentials.length === 0) {
    return <EmptyState title={emptyTitle || 'No credentials yet'} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {credentials.map((cred) => (
        <CredentialCard key={cred.id} credential={cred} onShare={onShare} />
      ))}
    </div>
  );
}
