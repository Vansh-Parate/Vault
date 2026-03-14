import { File as FileIcon } from 'lucide-react';
import { CATEGORY_FIELDS, CATEGORY_LABELS } from '../../lib/constants';
import { formatFileSize } from '../../lib/utils';

interface Step3Props {
  category: string;
  title: string;
  issuer: string;
  formData: Record<string, any>;
  file: File | null;
}

export default function Step3_Review({ category, title, issuer, formData, file }: Step3Props) {
  const fields = CATEGORY_FIELDS[category] || [];

  return (
    <div>
      <h2 className="font-display text-xl text-dark mb-1">Review & Save</h2>
      <p className="text-sm text-dark-muted font-sans mb-6">
        Review your credential details before saving.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left - Details */}
        <div className="lg:col-span-3 bg-cream-card border border-beige rounded-[14px] p-6">
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-beige">
              <span className="text-[13px] text-dark-muted font-sans">Category</span>
              <span className="text-sm text-dark font-sans font-medium">
                {CATEGORY_LABELS[category]}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-beige">
              <span className="text-[13px] text-dark-muted font-sans">Title</span>
              <span className="text-sm text-dark font-sans font-medium">{title || '—'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-beige">
              <span className="text-[13px] text-dark-muted font-sans">Issuer</span>
              <span className="text-sm text-dark font-sans font-medium">{issuer || '—'}</span>
            </div>
            {fields
              .filter((f) => f.type !== 'file' && formData[f.name])
              .map((field) => (
                <div key={field.name} className="flex justify-between py-2 border-b border-beige">
                  <span className="text-[13px] text-dark-muted font-sans">{field.label}</span>
                  <span className="text-sm text-dark font-sans font-medium text-right max-w-[60%]">
                    {formData[field.name]}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Right - Document */}
        <div className="lg:col-span-2">
          {file ? (
            <div className="bg-cream-card border border-beige rounded-[14px] p-6">
              <p className="text-[13px] text-dark-muted font-sans mb-3">Document</p>
              <div className="flex items-center gap-3 p-3 bg-cream-input rounded-[8px]">
                <FileIcon size={24} className="text-sage shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-dark font-sans truncate">{file.name}</p>
                  <p className="text-xs text-dark-muted">{formatFileSize(file.size)}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-cream-card border border-beige rounded-[14px] p-6 text-center">
              <p className="text-sm text-dark-muted font-sans">No document uploaded</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
