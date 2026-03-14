import { useCallback, useState, useRef } from 'react';
import { Upload, File, X } from 'lucide-react';
import { formatFileSize } from '../../lib/utils';

interface DropZoneProps {
  label?: string;
  onFileSelect: (file: File) => void;
  selectedFile?: File | null;
  onClear?: () => void;
}

export default function DropZone({ label = 'Upload Document', onFileSelect, selectedFile, onClear }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  if (selectedFile) {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-[13px] font-medium text-dark-muted font-sans">{label}</label>
        )}
        <div className="flex items-center gap-3 p-3 bg-cream-input border border-beige rounded-[8px]">
          <File size={20} className="text-sage shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-dark font-sans truncate">{selectedFile.name}</p>
            <p className="text-xs text-dark-muted">{formatFileSize(selectedFile.size)}</p>
          </div>
          {onClear && (
            <button onClick={onClear} className="p-1 text-dark-muted hover:text-danger transition-colors cursor-pointer">
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[13px] font-medium text-dark-muted font-sans">{label}</label>
      )}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-[8px] cursor-pointer transition-colors ${
          isDragging
            ? 'border-sage bg-sage-light'
            : 'border-beige bg-cream-input hover:border-dark-muted'
        }`}
      >
        <Upload size={24} className={isDragging ? 'text-sage' : 'text-dark-muted'} />
        <p className="text-sm text-dark-muted mt-2 font-sans">
          Drag & drop or <span className="text-sage font-medium">browse</span>
        </p>
        <p className="text-xs text-dark-muted mt-1">PDF, JPG, PNG — max 10MB</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
