import { FileQuestion } from 'lucide-react';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  description?: string;
  showAddButton?: boolean;
}

export default function EmptyState({ title, description, showAddButton = true }: EmptyStateProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-cream-input flex items-center justify-center mb-4">
        <FileQuestion size={28} className="text-dark-muted" />
      </div>
      <h3 className="font-display text-lg text-dark mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-dark-muted font-sans mb-4">{description}</p>
      )}
      {showAddButton && (
        <Button onClick={() => navigate('/wallet/add')}>Add Credential</Button>
      )}
    </div>
  );
}
