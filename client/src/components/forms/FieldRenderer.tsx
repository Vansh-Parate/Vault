import type { CategoryField } from '../../types';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import DropZone from '../ui/DropZone';

interface FieldRendererProps {
  field: CategoryField;
  value: any;
  onChange: (name: string, value: any) => void;
  file?: File | null;
  onFileSelect?: (file: File) => void;
  onFileClear?: () => void;
}

export default function FieldRenderer({ field, value, onChange, file, onFileSelect, onFileClear }: FieldRendererProps) {
  switch (field.type) {
    case 'text':
    case 'url':
    case 'number':
      return (
        <Input
          type={field.type === 'url' ? 'url' : field.type === 'number' ? 'number' : 'text'}
          label={field.label}
          required={field.required}
          placeholder={`Enter ${field.label.toLowerCase()}`}
          value={value || ''}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      );

    case 'date':
      return (
        <Input
          type="date"
          label={field.label}
          required={field.required}
          value={value || ''}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      );

    case 'select':
      return (
        <Select
          label={field.label}
          required={field.required}
          options={(field.options || []).map((opt) => ({ value: opt, label: opt }))}
          value={value || ''}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      );

    case 'textarea':
      return (
        <Textarea
          label={field.label}
          required={field.required}
          placeholder={`Enter ${field.label.toLowerCase()}`}
          value={value || ''}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      );

    case 'file':
      return (
        <DropZone
          label={field.label}
          onFileSelect={(f) => onFileSelect?.(f)}
          selectedFile={file}
          onClear={onFileClear}
        />
      );

    default:
      return null;
  }
}
