import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import api from '../../lib/api';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  credentialId: string;
  credentialTitle: string;
  onDeleted: () => void;
}

export default function DeleteModal({ isOpen, onClose, credentialId, credentialTitle, onDeleted }: DeleteModalProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/credentials/${credentialId}`);
      onDeleted();
      onClose();
    } catch (err) {
      console.error('Failed to delete credential', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Credential">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-danger-light flex items-center justify-center shrink-0">
          <AlertTriangle size={20} className="text-danger" />
        </div>
        <div>
          <p className="text-sm text-dark font-sans">
            Are you sure you want to delete <strong>{credentialTitle}</strong>?
          </p>
          <p className="text-xs text-dark-muted font-sans mt-1">
            This action cannot be undone. All share links will also be removed.
          </p>
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={handleDelete} disabled={loading}>
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </Modal>
  );
}
