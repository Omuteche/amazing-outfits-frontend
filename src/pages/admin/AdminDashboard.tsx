import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AdminLayout } from './AdminLayout';
import api from '@/lib/api';
import { Package, Tags, Building2, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import { formatKES } from '@/lib/formatCurrency';

interface Stats {
  products: number;
  categories: number;
  brands: number;
  orders: number;
  users: number;
  revenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    products: 0,
    categories: 0,
    brands: 0,
    orders: 0,
    users: 0,
    revenue: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await api.getAdminStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const statCards = [
    { label: 'Products', value: stats.products, icon: Package, color: 'text-blue-500' },
    { label: 'Categories', value: stats.categories, icon: Tags, color: 'text-green-500' },
    { label: 'Brands', value: stats.brands, icon: Building2, color: 'text-purple-500' },
    { label: 'Orders', value: stats.orders, icon: ShoppingCart, color: 'text-orange-500' },
    { label: 'Users', value: stats.users, icon: Users, color: 'text-pink-500' },
    { label: 'Revenue', value: formatKES(stats.revenue), icon: TrendingUp, color: 'text-primary' },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | AmazingOutfits</title>
      </Helmet>

      <AdminLayout title="Dashboard">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="glass-card rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <Icon className={`h-10 w-10 ${stat.color}`} />
                </div>
              </div>
            );
          })}
        </div>
      </AdminLayout>
    </>
  );
}
