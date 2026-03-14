import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { CATEGORY_ICONS, CATEGORY_LABELS } from '../../lib/constants';

interface CategoryTileProps {
  category: string;
  count: number;
}

export default function CategoryTile({ category, count }: CategoryTileProps) {
  const navigate = useNavigate();
  const iconName = CATEGORY_ICONS[category] as keyof typeof Icons;
  const IconComponent = (Icons[iconName] as any) || Icons.FileText;

  return (
    <button
      onClick={() => navigate(`/wallet?category=${category}`)}
      className="bg-cream-card border border-beige rounded-[14px] p-5 text-left hover:border-sage transition-colors cursor-pointer w-full"
    >
      <IconComponent size={24} className="text-sage mb-3" />
      <p className="text-sm font-sans font-medium text-dark">
        {CATEGORY_LABELS[category] || category}
      </p>
      <p className="text-xs text-dark-muted font-sans mt-0.5">
        {count} credential{count !== 1 ? 's' : ''}
      </p>
    </button>
  );
}
