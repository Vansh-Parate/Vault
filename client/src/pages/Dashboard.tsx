import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import TopBar from '../components/layout/TopBar';
import StatTile from '../components/ui/StatTile';
import CategoryTile from '../components/credentials/CategoryTile';
import { ActionBadge } from '../components/ui/Badge';
import { StatSkeleton } from '../components/ui/Skeleton';
import Skeleton from '../components/ui/Skeleton';
import { useDashboardStats } from '../hooks/useCredentials';
import { getGreeting, formatDateTime } from '../lib/utils';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export default function Dashboard() {
  const { stats, loading } = useDashboardStats();
  const navigate = useNavigate();
  const today = format(new Date(), 'EEEE, MMMM d, yyyy');

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25 }}
    >
      <TopBar
        title={`${getGreeting()}, Arjun`}
        subtitle={today}
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          [1, 2, 3, 4].map((i) => <StatSkeleton key={i} />)
        ) : (
          <>
            <StatTile value={stats?.totalCredentials || 0} label="Total Credentials" />
            <StatTile value={stats?.verifiedCount || 0} label="Verified" />
            <StatTile value={stats?.pendingCount || 0} label="Pending" />
            <StatTile value={stats?.totalShared || 0} label="Times Shared" />
          </>
        )}
      </div>

      {/* Category Overview */}
      <div className="mb-8">
        <h2 className="font-display text-lg text-dark mb-4">Categories</h2>
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="bg-cream-card border border-beige rounded-[14px] p-5">
                <Skeleton className="h-6 w-6 mb-3" />
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats?.categories.map((cat) => (
              <CategoryTile
                key={cat.category}
                category={cat.category}
                count={cat.count}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <h2 className="font-display text-lg text-dark mb-4">Recent Activity</h2>
        <div className="bg-cream-card border border-beige rounded-[14px] overflow-hidden">
          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ))}
            </div>
          ) : stats?.recentActivity.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-dark-muted font-sans">No activity yet.</p>
            </div>
          ) : (
            <div>
              {stats?.recentActivity.map((log, index) => (
                <div
                  key={log.id}
                  className={`flex items-center justify-between px-6 py-3.5 hover:bg-cream-input transition-colors ${
                    index < (stats.recentActivity.length - 1) ? 'border-b border-beige' : ''
                  }`}
                >
                  <span className="text-sm text-dark font-sans font-medium flex-1">
                    {log.credential?.title || 'Unknown'}
                  </span>
                  <div className="flex-shrink-0 mx-4">
                    <ActionBadge action={log.action} />
                  </div>
                  <span className="text-xs text-dark-muted font-sans flex-shrink-0">
                    {formatDateTime(log.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Add */}
      <button
        onClick={() => navigate('/wallet/add')}
        className="w-full bg-cream-card border border-beige rounded-[14px] p-6 flex items-center gap-4 hover:border-sage transition-colors cursor-pointer text-left"
      >
        <div className="w-12 h-12 rounded-full bg-sage-light flex items-center justify-center">
          <Plus size={24} className="text-sage" />
        </div>
        <div>
          <p className="text-base font-display text-dark">Store a new credential</p>
          <p className="text-sm text-dark-muted font-sans">Add documents, certificates, or IDs to your wallet</p>
        </div>
      </button>
    </motion.div>
  );
}
