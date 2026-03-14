import { X } from 'lucide-react';
import type { Toast as ToastType } from '../../hooks/useToast';

interface ToastProps {
  toasts: ToastType[];
  onRemove: (id: string) => void;
}

const toastStyles = {
  success: 'bg-success-light border-l-4 border-l-success',
  error: 'bg-danger-light border-l-4 border-l-danger',
  info: 'bg-cream-input border-l-4 border-l-beige',
};

export default function ToastContainer({ toasts, onRemove }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${toastStyles[toast.type]} ${toast.exiting ? 'toast-exit' : 'toast-enter'} flex items-center gap-3 px-4 py-3 rounded-[8px] border border-beige min-w-[300px] max-w-[400px]`}
        >
          <p className="text-sm text-dark font-sans flex-1">{toast.message}</p>
          <button
            onClick={() => onRemove(toast.id)}
            className="text-dark-muted hover:text-dark transition-colors cursor-pointer shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
