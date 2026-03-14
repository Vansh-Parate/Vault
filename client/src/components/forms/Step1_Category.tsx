import * as Icons from 'lucide-react';
import { CATEGORY_ICONS, CATEGORY_LABELS, CATEGORY_EXAMPLES, CATEGORIES } from '../../lib/constants';

interface Step1Props {
  selectedCategory: string;
  onSelect: (category: string) => void;
}

export default function Step1_Category({ selectedCategory, onSelect }: Step1Props) {
  return (
    <div>
      <h2 className="font-display text-xl text-dark mb-1">Select Category</h2>
      <p className="text-sm text-dark-muted font-sans mb-6">
        Choose the type of credential you want to store.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {CATEGORIES.map((cat) => {
          const iconName = CATEGORY_ICONS[cat] as keyof typeof Icons;
          const IconComponent = (Icons[iconName] as any) || Icons.FileText;
          const isSelected = selectedCategory === cat;

          return (
            <button
              key={cat}
              onClick={() => onSelect(cat)}
              className={`flex flex-col items-start p-5 rounded-[14px] border-2 text-left transition-colors cursor-pointer ${
                isSelected
                  ? 'border-sage bg-sage-light'
                  : 'border-beige bg-cream-card hover:border-dark-muted'
              }`}
            >
              <IconComponent
                size={32}
                className={isSelected ? 'text-sage' : 'text-dark-muted'}
              />
              <p className="text-sm font-sans font-medium text-dark mt-3">
                {CATEGORY_LABELS[cat]}
              </p>
              <p className="text-xs text-dark-muted font-sans mt-1">
                {CATEGORY_EXAMPLES[cat]}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
