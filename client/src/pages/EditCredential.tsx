import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TopBar from '../components/layout/TopBar';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import FieldRenderer from '../components/forms/FieldRenderer';
import { useCredential } from '../hooks/useCredentials';
import { CATEGORY_FIELDS, CATEGORY_LABELS } from '../lib/constants';
import api from '../lib/api';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export default function EditCredential() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { credential, loading: loadingCredential } = useCredential(id);

  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (credential) {
      setTitle(credential.title);
      setIssuer(credential.issuer || '');
      setFormData((credential.metadata || {}) as Record<string, any>);
    }
  }, [credential]);

  const handleFieldChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put(`/credentials/${id}`, {
        title,
        issuer,
        metadata: formData,
        issuedDate: formData.issuedDate || formData.startDate || formData.date,
        expiryDate: formData.expiryDate || formData.endDate,
      });
      navigate(`/wallet/${id}`);
    } catch (err) {
      console.error('Failed to update credential', err);
    } finally {
      setSaving(false);
    }
  };

  if (loadingCredential || !credential) {
    return <div><TopBar title="Loading..." /></div>;
  }

  const fields = CATEGORY_FIELDS[credential.category] || [];

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25 }}
    >
      <TopBar
        title={`Edit — ${CATEGORY_LABELS[credential.category]}`}
        action={
          <Button variant="ghost" onClick={() => navigate(`/wallet/${id}`)}>
            Cancel
          </Button>
        }
      />

      <div className="max-w-xl space-y-4">
        <Input
          label="Credential Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          label="Issuer / Organization"
          value={issuer}
          onChange={(e) => setIssuer(e.target.value)}
        />

        {fields
          .filter((f) => f.type !== 'file')
          .map((field) => (
            <FieldRenderer
              key={field.name}
              field={field}
              value={formData[field.name]}
              onChange={handleFieldChange}
            />
          ))}

        <div className="pt-4">
          <Button onClick={handleSave} disabled={saving} fullWidth>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
