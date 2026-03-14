import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TopBar from '../components/layout/TopBar';
import { ActionBadge } from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import api from '../lib/api';
import type { AccessLog } from '../types';
import { formatDateTime } from '../lib/utils';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export default function AccessLogPage() {
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('all');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const params: any = {};
        if (range !== 'all') params.range = range;
        const { data } = await api.get('/logs', { params });
        setLogs(data);
      } catch (err) {
        console.error('Failed to fetch logs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [range]);

  const rangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: 'all', label: 'All time' },
  ];

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25 }}
    >
      <TopBar
        title="Access Log"
        action={
          <div className="flex gap-2">
            {rangeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setRange(opt.value)}
                className={`px-3 py-1.5 text-sm rounded-[8px] font-sans transition-colors cursor-pointer ${
                  range === opt.value
                    ? 'bg-sage text-white'
                    : 'bg-cream-input text-dark-mid border border-beige hover:bg-beige/30'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        }
      />

      <div className="bg-cream-card border border-beige rounded-[14px] overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-4 gap-4 px-6 py-3 border-b border-beige bg-cream-input/50">
          <span className="text-xs text-dark-muted font-sans font-medium uppercase tracking-wider">Date & Time</span>
          <span className="text-xs text-dark-muted font-sans font-medium uppercase tracking-wider">Credential</span>
          <span className="text-xs text-dark-muted font-sans font-medium uppercase tracking-wider">Action</span>
          <span className="text-xs text-dark-muted font-sans font-medium uppercase tracking-wider">Accessed By</span>
        </div>

        {/* Table body */}
        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="grid grid-cols-4 gap-4 px-6 py-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-dark-muted font-sans">No activity yet.</p>
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={log.id}
              className={`grid grid-cols-4 gap-4 px-6 py-3.5 hover:bg-cream-input transition-colors ${
                index < logs.length - 1 ? 'border-b border-beige' : ''
              }`}
            >
              <span className="text-sm text-dark-muted font-sans">
                {formatDateTime(log.timestamp)}
              </span>
              <span className="text-sm text-dark font-sans font-medium truncate">
                {log.credential?.title || 'Unknown'}
              </span>
              <div>
                <ActionBadge action={log.action} />
              </div>
              <span className="text-sm text-dark-muted font-sans">
                {log.accessedBy}
              </span>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
