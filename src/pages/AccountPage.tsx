import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { User, Package, Heart, MapPin, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

export default function AccountPage() {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const data = await api.getProfile();
      setProfile(data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const menuItems = [
    { href: '/account', label: 'Profile', icon: User, exact: true },
    { href: '/account/orders', label: 'Orders', icon: Package },
    { href: '/account/wishlist', label: 'Wishlist', icon: Heart },
    { href: '/account/addresses', label: 'Addresses', icon: MapPin },
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return location.pathname === href;
    return location.pathname.startsWith(href);
  };

  if (loading) {
    return <Layout><div className="container mx-auto px-4 py-8"><div className="animate-pulse">Loading...</div></div></Layout>;
  }

  const isProfilePage = location.pathname === '/account';

  return (
    <>
      <Helmet><title>My Account | AmazingOutfits</title></Helmet>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-display tracking-wider mb-8">MY ACCOUNT</h1>
          <div className="grid md:grid-cols-4 gap-8">
            <aside className="md:col-span-1">
              <nav className="glass-card rounded-lg p-4 space-y-2">
                {menuItems.map(item => (
                  <Link key={item.href} to={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.href, item.exact) ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}>
                    <item.icon className="h-5 w-5" />{item.label}
                  </Link>
                ))}
                <button onClick={handleSignOut} className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-destructive/10 text-destructive w-full">
                  <LogOut className="h-5 w-5" />Sign Out
                </button>
              </nav>
            </aside>
            <main className="md:col-span-3">
              {isProfilePage ? <ProfileContent profile={profile} onUpdate={fetchProfile} /> : null}
            </main>
          </div>
        </div>
      </Layout>
    </>
  );
}

function ProfileContent({ profile, onUpdate }: { profile: any; onUpdate: () => void }) {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', phone: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) setFormData({ fullName: profile.fullName || '', phone: profile.phone || '' });
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await api.updateProfile(formData);
      onUpdate();
      setEditing(false);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="glass-card rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display tracking-wider">PROFILE</h2>
        <Button variant={editing ? 'default' : 'outline'} onClick={() => editing ? handleSave() : setEditing(true)} disabled={saving}>
          {editing ? (saving ? 'Saving...' : 'Save') : 'Edit'}
        </Button>
      </div>
      <div className="space-y-4">
        <div><label className="text-sm text-muted-foreground">Email</label><p className="font-medium">{user?.email}</p></div>
        <div>
          <label className="text-sm text-muted-foreground">Full Name</label>
          {editing ? (
            <input type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary" />
          ) : (
            <p className="font-medium">{profile?.fullName || 'Not set'}</p>
          )}
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Phone</label>
          {editing ? (
            <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary" placeholder="+254 700 000 000" />
          ) : (
            <p className="font-medium">{profile?.phone || 'Not set'}</p>
          )}
        </div>
      </div>
    </div>
  );
}
