import { CATEGORY_FIELDS, CATEGORY_LABELS } from '../../lib/constants';
import Input from '../ui/Input';
import FieldRenderer from './FieldRenderer';

interface Step2Props {
  category: string;
  formData: Record<string, any>;
  onChange: (name: string, value: any) => void;
  title: string;
  issuer: string;
  onTitleChange: (value: string) => void;
  onIssuerChange: (value: string) => void;
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileClear: () => void;
}

export default function Step2_Fields({
  category,
  formData,
  onChange,
  title,
  issuer,
  onTitleChange,
  onIssuerChange,
  file,
  onFileSelect,
  onFileClear,
}: Step2Props) {
  const fields = CATEGORY_FIELDS[category] || [];

  return (
    <div>
      <h2 className="font-display text-xl text-dark mb-1">Fill Details</h2>
      <p className="text-sm text-dark-muted font-sans mb-6">
        Enter the details for your {CATEGORY_LABELS[category]?.toLowerCase()} credential.
      </p>

      <div className="space-y-4 max-w-xl">
        {/* Title & Issuer always present */}
        <Input
          label="Credential Title"
          required
          placeholder="e.g. AWS Solutions Architect"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
        <Input
          label="Issuer / Organization"
          placeholder="e.g. Amazon Web Services"
          value={issuer}
          onChange={(e) => onIssuerChange(e.target.value)}
        />

        {/* Dynamic fields */}
        {fields.map((field) => (
          <FieldRenderer
            key={field.name}
            field={field}
            value={formData[field.name]}
            onChange={onChange}
            file={field.type === 'file' ? file : undefined}
            onFileSelect={field.type === 'file' ? onFileSelect : undefined}
            onFileClear={field.type === 'file' ? onFileClear : undefined}
          />
        ))}
      </div>
    </div>
  );
}
