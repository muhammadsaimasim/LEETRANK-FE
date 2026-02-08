import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ExternalLink, Calendar, Building2, GraduationCap, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/common/Avatar';
import { ProgressBar } from '@/components/common/ProgressBar';
import { RankBadge } from '@/components/leaderboard/RankBadge';
import { PageLoader } from '@/components/common/Loader';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/lib/constants';
import type { User } from '@/types';

// Mock user data for demonstration
const mockUserData: User = {
  id: '1',
  name: 'Alex Chen',
  email: 'alex@university.edu',
  role: 'student',
  leetcodeUsername: 'alex_chen',
  leetcodeProfileURL: 'https://leetcode.com/alex_chen',
  batch: '2024',
  department: 'Computer Science',
  stats: {
    totalSolved: 324,
    easySolved: 156,
    mediumSolved: 132,
    hardSolved: 36,
    ranking: 12453,
    lastSynced: new Date().toISOString(),
  },
  createdAt: '2024-01-15T10:00:00Z',
};

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isOwnProfile = currentUser?.id === id;

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setUser(mockUserData);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [id]);

  if (isLoading) {
    return <PageLoader message="Loading profile..." />;
  }

  if (!user) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">User not found</h1>
        <p className="text-muted-foreground mb-6">The profile you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to={ROUTES.LEADERBOARD}>Back to Leaderboard</Link>
        </Button>
      </div>
    );
  }

  const stats = user.stats || {
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    ranking: 0,
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container max-w-4xl py-8 animate-fade-in">
      {/* Profile Header */}
      <div className="rounded-xl border bg-card p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <Avatar name={user.name} size="xl" />
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <RankBadge position={42} size="lg" />
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <GraduationCap className="h-4 w-4" />
                Batch {user.batch}
              </span>
              {user.department && (
                <span className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  {user.department}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Joined {formatDate(user.createdAt)}
              </span>
            </div>
          </div>
          {isOwnProfile ? (
            <Button asChild>
              <Link to={ROUTES.SETTINGS}>Edit Profile</Link>
            </Button>
          ) : (
            <Button variant="outline" asChild>
              <a
                href={user.leetcodeProfileURL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                LeetCode Profile
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="rounded-xl border bg-card p-6 text-center">
          <div className="text-4xl font-bold text-primary">{stats.totalSolved}</div>
          <div className="text-sm text-muted-foreground mt-1">Total Solved</div>
        </div>
        <div className="rounded-xl border bg-card p-6 text-center">
          <div className="text-4xl font-bold text-difficulty-easy">{stats.easySolved}</div>
          <div className="text-sm text-muted-foreground mt-1">Easy</div>
        </div>
        <div className="rounded-xl border bg-card p-6 text-center">
          <div className="text-4xl font-bold text-difficulty-medium">{stats.mediumSolved}</div>
          <div className="text-sm text-muted-foreground mt-1">Medium</div>
        </div>
        <div className="rounded-xl border bg-card p-6 text-center">
          <div className="text-4xl font-bold text-difficulty-hard">{stats.hardSolved}</div>
          <div className="text-sm text-muted-foreground mt-1">Hard</div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold mb-6">Problem Progress</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-difficulty-easy">Easy</span>
                <span className="text-sm text-muted-foreground">{stats.easySolved} / 800</span>
              </div>
              <ProgressBar value={stats.easySolved} max={800} variant="easy" showLabel={false} size="lg" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-difficulty-medium">Medium</span>
                <span className="text-sm text-muted-foreground">{stats.mediumSolved} / 1600</span>
              </div>
              <ProgressBar value={stats.mediumSolved} max={1600} variant="medium" showLabel={false} size="lg" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-difficulty-hard">Hard</span>
                <span className="text-sm text-muted-foreground">{stats.hardSolved} / 700</span>
              </div>
              <ProgressBar value={stats.hardSolved} max={700} variant="hard" showLabel={false} size="lg" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold mb-6">LeetCode Info</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-muted-foreground">Username</span>
              <a
                href={user.leetcodeProfileURL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-primary inline-flex items-center gap-1"
              >
                @{user.leetcodeUsername}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-muted-foreground">Global Ranking</span>
              <span className="font-medium">#{stats.ranking.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Last Updated
              </span>
              <span className="font-medium text-sm">
                {stats.lastSynced
                  ? new Date(stats.lastSynced).toLocaleString()
                  : 'Never'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
