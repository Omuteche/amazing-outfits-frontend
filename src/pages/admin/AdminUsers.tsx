import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { AdminLayout } from './AdminLayout';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Shield, ShieldOff, User } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfile {
  _id: string;
  email?: string;
  fullName?: string;
  role: 'admin' | 'user';
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    userId: string;
    userName: string;
    action: 'promote' | 'demote';
  }>({ open: false, userId: '', userName: '', action: 'promote' });
  const { user: currentUser } = useAuth();

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminUsers();
      setUsers(data || []);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async () => {
    const { userId, action } = confirmDialog;
    const newRole = action === 'promote' ? 'admin' : 'user';

    try {
      await api.updateUserRole(userId, newRole);
      toast.success(`User ${action === 'promote' ? 'promoted to admin' : 'demoted to user'}`);
      fetchUsers();
    } catch {
      toast.error('Failed to update user role');
    }
    setConfirmDialog({ open: false, userId: '', userName: '', action: 'promote' });
  };

  const openConfirmDialog = (userId: string, userName: string, action: 'promote' | 'demote') => {
    setConfirmDialog({ open: true, userId, userName, action });
  };

  return (
    <>
      <Helmet><title>Users | Admin | AmazingOutfits</title></Helmet>
      <AdminLayout title="User Management">
        <p className="text-muted-foreground mb-6">{users.length} users</p>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (<div key={i} className="h-16 bg-secondary animate-pulse rounded-lg" />))}
          </div>
        ) : users.length === 0 ? (
          <p className="text-muted-foreground">No users found.</p>
        ) : (
          <div className="space-y-3">
            {users.map(user => (
              <div key={user._id} className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    {user.role === 'admin' ? <Shield className="h-5 w-5 text-primary" /> : <User className="h-5 w-5 text-muted-foreground" />}
                  </div>
                  <div><p className="font-medium">{user.fullName || 'No name'}</p><p className="text-sm text-muted-foreground">{user.email}</p></div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>{user.role}</Badge>
                  {user._id !== currentUser?.id && (
                    <>
                      {user.role === 'user' ? (
                        <Button variant="outline" size="sm" onClick={() => openConfirmDialog(user._id, user.fullName || user.email || '', 'promote')}>
                          <Shield className="h-4 w-4 mr-2" />Make Admin
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => openConfirmDialog(user._id, user.fullName || user.email || '', 'demote')}>
                          <ShieldOff className="h-4 w-4 mr-2" />Remove Admin
                        </Button>
                      )}
                    </>
                  )}
                  {user._id === currentUser?.id && <span className="text-xs text-muted-foreground">(You)</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{confirmDialog.action === 'promote' ? 'Promote to Admin?' : 'Remove Admin Access?'}</AlertDialogTitle>
              <AlertDialogDescription>
                {confirmDialog.action === 'promote' 
                  ? `Are you sure you want to make "${confirmDialog.userName}" an admin? They will have full access to the admin panel.`
                  : `Are you sure you want to remove admin access from "${confirmDialog.userName}"? They will no longer be able to access the admin panel.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleRoleChange}>{confirmDialog.action === 'promote' ? 'Promote' : 'Remove'}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </AdminLayout>
    </>
  );
}
