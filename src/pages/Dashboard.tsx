import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { RefreshCw, ExternalLink, TrendingUp, Target, Award, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { userApi } from '@/api/user.api.js';
import { StatsCard } from '@/components/common/StatsCard';
import { ProgressBar } from '@/components/common/ProgressBar';
import { Avatar } from '@/components/common/Avatar';
import { Loader } from '@/components/common/Loader';
import { ROUTES } from '@/lib/constants';
import { toast } from 'sonner';

export default function Dashboard() {
  const { user, refreshUser } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);

  // Admin doesn't have a dashboard — redirect to admin panel
  if (user?.role === 'admin') {
    return <Navigate to={ROUTES.ADMIN} replace />;
  }

  const stats = user?.stats || {
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    ranking: 0,
    lastSynced: null,
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await userApi.syncStats();
      await refreshUser();
      toast.success('Stats synced successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to sync stats');
    } finally {
      setIsSyncing(false);
    }
  };

  const timeSinceSync = () => {
    if (!stats.lastSynced) return 'Never synced';
    const minutes = Math.floor((Date.now() - new Date(stats.lastSynced).getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="container py-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Avatar
            name={user?.name || 'User'}
            src={user?.stats?.avatar}
            size="xl"
          />
          <div>
            <h1 className="text-3xl font-bold">{user?.name}</h1>
            <p className="text-muted-foreground mt-0.5">@{user?.leetcodeUsername || 'username'}</p>
          </div>
        </div>
        <Button onClick={handleSync} disabled={isSyncing}>
          {isSyncing ? (
            <Loader size="sm" className="mr-2" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Sync Stats
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Your Rank"
          value={stats.ranking ? `#${stats.ranking.toLocaleString()}` : 'N/A'}
          subtitle="LeetCode Global"
          icon={<Award className="h-5 w-5" />}
        />
        <StatsCard
          title="Total Solved"
          value={stats.totalSolved}
          subtitle={`Last synced ${timeSinceSync()}`}
          icon={<Target className="h-5 w-5" />}
        />
        <StatsCard
          title="LeetCode Ranking"
          value={stats.ranking ? stats.ranking.toLocaleString() : 'N/A'}
          subtitle="Global"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatsCard
          title="Hard Solved"
          value={stats.hardSolved}
          subtitle="Keep pushing!"
          icon={<BarChart3 className="h-5 w-5" />}
        />
      </div>

      {/* Stats Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Problem Breakdown */}
        <div className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold mb-6">Problem Breakdown</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-difficulty-easy">Easy</span>
                <span className="text-sm text-muted-foreground">{stats.easySolved} / 800</span>
              </div>
              <ProgressBar value={stats.easySolved} max={800} variant="easy" showLabel={false} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-difficulty-medium">Medium</span>
                <span className="text-sm text-muted-foreground">{stats.mediumSolved} / 1600</span>
              </div>
              <ProgressBar value={stats.mediumSolved} max={1600} variant="medium" showLabel={false} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-difficulty-hard">Hard</span>
                <span className="text-sm text-muted-foreground">{stats.hardSolved} / 700</span>
              </div>
              <ProgressBar value={stats.hardSolved} max={700} variant="hard" showLabel={false} />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to={ROUTES.LEADERBOARD}>
                <TrendingUp className="mr-3 h-4 w-4" />
                View Leaderboard
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to={ROUTES.SETTINGS}>
                <Target className="mr-3 h-4 w-4" />
                Update Profile
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a
                href={user?.leetcodeProfileURL || 'https://leetcode.com'}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-3 h-4 w-4" />
                View LeetCode Profile
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="rounded-xl border bg-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold">Profile Information</h3>
            <p className="text-sm text-muted-foreground mt-1">
              @{user?.leetcodeUsername || 'username'} • {user?.batch}
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to={ROUTES.SETTINGS}>Edit Profile</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
