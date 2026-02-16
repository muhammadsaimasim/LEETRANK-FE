import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Code,
  Shield,
  Trash2,
  Loader2,
  RefreshCw,
  AlertTriangle,
  Eye,
  EyeOff,
  Check,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { useAuth } from '@/context/AuthContext';
import { userApi } from '@/api/user.api.js';
import { authApi } from '@/api/auth.api.js';
import {
  profileUpdateSchema,
  leetcodeUpdateSchema,
  passwordChangeSchema,
  deleteAccountSchema,
  type ProfileUpdateFormData,
  type LeetcodeUpdateFormData,
  type PasswordChangeFormData,
  type DeleteAccountFormData,
} from '@/lib/validation';
import { ROUTES, BATCHES } from '@/lib/constants';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function Settings() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  // Profile form
  const profileForm = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: user?.name || '',
      batch: user?.batch || '',
      rollno: user?.rollno || '',
    },
  });

  // LeetCode form
  const leetcodeForm = useForm<LeetcodeUpdateFormData>({
    resolver: zodResolver(leetcodeUpdateSchema),
    defaultValues: {
      leetcodeUsername: user?.leetcodeUsername || '',
      leetcodeProfileURL: user?.leetcodeProfileURL || '',
    },
  });

  // Password form
  const passwordForm = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
  });

  // Delete form
  const deleteForm = useForm<DeleteAccountFormData>({
    resolver: zodResolver(deleteAccountSchema),
  });

  const newPassword = passwordForm.watch('newPassword', '');

  const passwordRequirements = [
    { label: 'At least 8 characters', met: newPassword.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(newPassword) },
    { label: 'One lowercase letter', met: /[a-z]/.test(newPassword) },
    { label: 'One number', met: /[0-9]/.test(newPassword) },
    { label: 'One special character', met: /[^A-Za-z0-9]/.test(newPassword) },
  ];

  const handleProfileUpdate = async (data: ProfileUpdateFormData) => {
    try {
      const updatedUser = await userApi.updateProfile(data);
      if (updatedUser) {
        updateUser({ ...user, ...updatedUser });
      }
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const handleLeetcodeUpdate = async (data: LeetcodeUpdateFormData) => {
    try {
      const updatedUser = await userApi.updateLeetcode(data);
      if (updatedUser && user) {
        updateUser({ ...user, ...updatedUser });
      }
      toast.success('LeetCode info updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update LeetCode info');
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await userApi.syncStats();
      toast.success('Stats synced successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sync stats');
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePasswordChange = async (data: PasswordChangeFormData) => {
    try {
      await authApi.changePassword(data.currentPassword, data.newPassword);
      toast.success('Password changed successfully');
      passwordForm.reset();
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password');
    }
  };

  const handleDeleteAccount = async (data: DeleteAccountFormData) => {
    try {
      await userApi.deleteAccount(data.password);
      toast.success('Account deleted');
      logout();
      navigate(ROUTES.HOME);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete account');
    }
  };

  return (
    <div className="container max-w-3xl py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4 hidden sm:inline" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="leetcode" className="gap-2">
            <Code className="h-4 w-4 hidden sm:inline" />
            LeetCode
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4 hidden sm:inline" />
            Security
          </TabsTrigger>
          <TabsTrigger value="danger" className="gap-2 text-destructive data-[state=active]:text-destructive">
            <Trash2 className="h-4 w-4 hidden sm:inline" />
            Delete
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold mb-6">Profile Information</h3>
            <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...profileForm.register('name')}
                  className={profileForm.formState.errors.name ? 'border-destructive' : ''}
                />
                {profileForm.formState.errors.name && (
                  <p className="text-sm text-destructive">{profileForm.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Batch</Label>
                <Select
                  defaultValue={user?.batch}
                  onValueChange={(value) => profileForm.setValue('batch', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {BATCHES.map((batch) => (
                      <SelectItem key={batch} value={batch}>{batch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rollno">Roll Number</Label>
                <Input
                  id="rollno"
                  placeholder="e.g. CT-12345"
                  {...profileForm.register('rollno')}
                  className={profileForm.formState.errors.rollno ? 'border-destructive' : ''}
                />
                {profileForm.formState.errors.rollno && (
                  <p className="text-sm text-destructive">{profileForm.formState.errors.rollno.message}</p>
                )}
                <p className="text-xs text-muted-foreground">Programme is auto-derived from roll number prefix</p>
              </div>

              <Button type="submit" disabled={profileForm.formState.isSubmitting}>
                {profileForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </form>
          </div>
        </TabsContent>

        {/* LeetCode Tab */}
        <TabsContent value="leetcode">
          <div className="rounded-xl border bg-card p-6 space-y-6">
            <div>
              <h3 className="font-semibold mb-1">LeetCode Information</h3>
              <p className="text-sm text-muted-foreground">
                Update your LeetCode profile details. Changing username will re-sync your stats.
              </p>
            </div>

            <form onSubmit={leetcodeForm.handleSubmit(handleLeetcodeUpdate)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="leetcodeUsername">LeetCode Username</Label>
                <Input
                  id="leetcodeUsername"
                  {...leetcodeForm.register('leetcodeUsername')}
                  className={leetcodeForm.formState.errors.leetcodeUsername ? 'border-destructive' : ''}
                />
                {leetcodeForm.formState.errors.leetcodeUsername && (
                  <p className="text-sm text-destructive">
                    {leetcodeForm.formState.errors.leetcodeUsername.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="leetcodeProfileURL">Profile URL</Label>
                <Input
                  id="leetcodeProfileURL"
                  {...leetcodeForm.register('leetcodeProfileURL')}
                  className={leetcodeForm.formState.errors.leetcodeProfileURL ? 'border-destructive' : ''}
                />
                {leetcodeForm.formState.errors.leetcodeProfileURL && (
                  <p className="text-sm text-destructive">
                    {leetcodeForm.formState.errors.leetcodeProfileURL.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={leetcodeForm.formState.isSubmitting}>
                  {leetcodeForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
                <Button type="button" variant="outline" onClick={handleSync} disabled={isSyncing}>
                  {isSyncing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  Sync Now
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold mb-6">Change Password</h3>
            <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    {...passwordForm.register('currentPassword')}
                    className={passwordForm.formState.errors.currentPassword ? 'border-destructive pr-10' : 'pr-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-sm text-destructive">
                    {passwordForm.formState.errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    {...passwordForm.register('newPassword')}
                    className={passwordForm.formState.errors.newPassword ? 'border-destructive pr-10' : 'pr-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {newPassword && (
                  <div className="mt-3 space-y-1.5">
                    {passwordRequirements.map((req) => (
                      <div
                        key={req.label}
                        className={cn(
                          'flex items-center gap-2 text-xs',
                          req.met ? 'text-success' : 'text-muted-foreground'
                        )}
                      >
                        {req.met ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        {req.label}
                      </div>
                    ))}
                  </div>
                )}
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-sm text-destructive">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...passwordForm.register('confirmPassword')}
                  className={passwordForm.formState.errors.confirmPassword ? 'border-destructive' : ''}
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                {passwordForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Password
              </Button>
            </form>
          </div>
        </TabsContent>

        {/* Delete Account Tab */}
        <TabsContent value="danger">
          <div className="rounded-xl border border-destructive/50 bg-card p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="rounded-full bg-destructive/10 p-3">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold text-destructive">Delete Account</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This action is permanent and cannot be undone. All your data will be permanently deleted.
                </p>
              </div>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete My Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete your account and remove all your data from our servers.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <form onSubmit={deleteForm.handleSubmit(handleDeleteAccount)}>
                  <div className="space-y-4 my-4">
                    <div className="space-y-2">
                      <Label htmlFor="deletePassword">Confirm your password</Label>
                      <div className="relative">
                        <Input
                          id="deletePassword"
                          type={showDeletePassword ? 'text' : 'password'}
                          {...deleteForm.register('password')}
                          className={deleteForm.formState.errors.password ? 'border-destructive pr-10' : 'pr-10'}
                        />
                        <button
                          type="button"
                          onClick={() => setShowDeletePassword(!showDeletePassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showDeletePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {deleteForm.formState.errors.password && (
                        <p className="text-sm text-destructive">
                          {deleteForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      type="submit"
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      disabled={deleteForm.formState.isSubmitting}
                    >
                      {deleteForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </form>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
