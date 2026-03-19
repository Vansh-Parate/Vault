import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TopBar from '../components/layout/TopBar';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import api from '../lib/api';
import type { User } from '../types';
import { getInitials } from '../lib/utils';
import ConnectCard from '../components/digilocker/ConnectCard';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [dateFormat, setDateFormat] = useState('');
  const [defaultVis, setDefaultVis] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/profile');
        setUser(data);
        setName(data.name);
        setDateFormat(data.dateFormat);
        setDefaultVis(data.defaultVis);
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const { data } = await api.put('/profile', { name, dateFormat, defaultVis });
      setUser(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div><TopBar title="Profile" /></div>;
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25 }}
    >
      <TopBar title="Profile & Settings" />

      <div className="max-w-xl space-y-6">
        {/* Connected Sources */}
        <div>
          <h3 className="font-display text-lg text-dark mb-3">Connected Sources</h3>
          <ConnectCard />
        </div>

        {/* Personal Info */}
        <div className="bg-cream-card border border-beige rounded-[14px] p-6">
          <h3 className="font-display text-lg text-dark mb-4">Personal Info</h3>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-sage flex items-center justify-center text-white text-lg font-sans font-medium">
              {getInitials(name || user?.name || '')}
            </div>
            <div>
              <p className="text-base text-dark font-sans font-medium">{name}</p>
              <p className="text-sm text-dark-muted font-sans">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Email"
              value={user?.email || ''}
              disabled
            />
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-cream-card border border-beige rounded-[14px] p-6">
          <h3 className="font-display text-lg text-dark mb-4">Preferences</h3>
          <div className="space-y-4">
            <Select
              label="Date Format"
              options={[
                { value: 'DD MMM YYYY', label: 'DD MMM YYYY (e.g. 15 Mar 2024)' },
                { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (e.g. 03/15/2024)' },
                { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (e.g. 2024-03-15)' },
              ]}
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
            />
            <Select
              label="Default Credential Visibility"
              options={[
                { value: 'PRIVATE', label: 'Private' },
                { value: 'SHAREABLE', label: 'Shareable' },
              ]}
              value={defaultVis}
              onChange={(e) => setDefaultVis(e.target.value)}
            />
          </div>
        </div>

        {/* Save */}
        <Button onClick={handleSave} disabled={saving} fullWidth>
          {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Changes'}
        </Button>
      </div>
    </motion.div>
  );
}
