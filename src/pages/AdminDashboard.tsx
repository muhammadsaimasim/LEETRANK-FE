import { useState, useMemo } from 'react';
import { Search, RefreshCw, ChevronLeft, ChevronRight, Users, Target, TrendingUp, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { StatsCard } from '@/components/common/StatsCard';
import { Avatar } from '@/components/common/Avatar';
import { Loader } from '@/components/common/Loader';
import { BATCHES, DEPARTMENTS, ROLES } from '@/lib/constants';
import { toast } from 'sonner';
import type { User } from '@/types';

// Mock users for demonstration
const mockUsers: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: String(i + 1),
  name: ['Alex Chen', 'Sarah Kim', 'Mike Johnson', 'Emma Wilson', 'James Lee'][i % 5],
  email: `user${i + 1}@university.edu`,
  role: i === 0 ? 'admin' : i < 5 ? 'moderator' : 'student',
  leetcodeUsername: `coder_${i + 1}`,
  leetcodeProfileURL: `https://leetcode.com/coder_${i + 1}`,
  batch: BATCHES[i % BATCHES.length],
  department: DEPARTMENTS[i % DEPARTMENTS.length],
  stats: {
    totalSolved: Math.floor(Math.random() * 500) + 100,
    easySolved: Math.floor(Math.random() * 200) + 50,
    mediumSolved: Math.floor(Math.random() * 200) + 30,
    hardSolved: Math.floor(Math.random() * 100) + 10,
    ranking: Math.floor(Math.random() * 100000) + 1000,
  },
}));

export default function AdminDashboard() {
  const [users] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [batchFilter, setBatchFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSyncing, setIsSyncing] = useState(false);
  const itemsPerPage = 10;

  const filteredUsers = useMemo(() => {
    let data = [...users];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    }

    if (roleFilter && roleFilter !== 'all') {
      data = data.filter((user) => user.role === roleFilter);
    }

    if (batchFilter && batchFilter !== 'all') {
      data = data.filter((user) => user.batch === batchFilter);
    }

    return data;
  }, [users, searchQuery, roleFilter, batchFilter]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const stats = useMemo(() => {
    const totalSolved = users.reduce((acc, user) => acc + (user.stats?.totalSolved || 0), 0);
    const topPerformer = users.reduce((max, user) =>
      (user.stats?.totalSolved || 0) > (max.stats?.totalSolved || 0) ? user : max
    );
    return {
      totalUsers: users.length,
      totalSolved,
      averageSolved: Math.round(totalSolved / users.length),
      topPerformer,
    };
  }, [users]);

  const handleSyncAll = async () => {
    setIsSyncing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      toast.success('All user stats synced successfully!');
    } catch (error) {
      toast.error('Failed to sync stats');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success(`Role updated to ${newRole}`);
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="container py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage users and monitor platform statistics</p>
        </div>
        <Button onClick={handleSyncAll} disabled={isSyncing}>
          {isSyncing ? (
            <Loader size="sm" className="mr-2" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Sync All Stats
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="h-5 w-5" />}
        />
        <StatsCard
          title="Total Problems Solved"
          value={stats.totalSolved.toLocaleString()}
          icon={<Target className="h-5 w-5" />}
        />
        <StatsCard
          title="Average Per User"
          value={stats.averageSolved}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatsCard
          title="Top Performer"
          value={stats.topPerformer.name}
          subtitle={`${stats.topPerformer.stats?.totalSolved} problems`}
          icon={<Crown className="h-5 w-5" />}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="moderator">Moderator</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        <Select value={batchFilter} onValueChange={(v) => { setBatchFilter(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Batch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Batches</SelectItem>
            {BATCHES.map((batch) => (
              <SelectItem key={batch} value={batch}>{batch}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead className="hidden md:table-cell">Role</TableHead>
              <TableHead className="hidden lg:table-cell">Batch</TableHead>
              <TableHead className="hidden lg:table-cell">Department</TableHead>
              <TableHead className="text-center">Total Solved</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar name={user.name} size="sm" />
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Select
                    defaultValue={user.role}
                    onValueChange={(value) => handleRoleChange(user.id, value)}
                  >
                    <SelectTrigger className="w-[120px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="hidden lg:table-cell">{user.batch}</TableCell>
                <TableCell className="hidden lg:table-cell">{user.department}</TableCell>
                <TableCell className="text-center font-medium">{user.stats?.totalSolved}</TableCell>
                <TableCell className="text-right">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {user.name}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteUser(user.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
