'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Car, Users, AlertTriangle, CreditCard, TrendingUp, Clock } from 'lucide-react';

interface DashboardStats {
  today: {
    totalEntries: number;
    totalExits: number;
    currentParked: number;
    guests: number;
  };
  parking: {
    main: {
      capacity: number;
      occupied: number;
      percentage: number;
    };
    guest: {
      capacity: number;
      occupied: number;
      percentage: number;
    };
  };
  violations: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    pendingFines: number;
    totalUnpaid: number;
  };
  vehicles: {
    total: number;
    active: number;
    blacklisted: number;
  };
}

interface RecentActivity {
  id: string;
  action: string;
  module: string;
  description: string;
  createdAt: string;
  user?: {
    fullName: string;
  } | null;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Fetch stats
        const statsResponse = await fetch('/api/dashboard/stats');
        if (statsResponse.ok) {
          const data = await statsResponse.json();
          setStats(data.data);
        }

        // Fetch activities
        const activitiesResponse = await fetch('/api/dashboard/activities');
        if (activitiesResponse.ok) {
          const data = await activitiesResponse.json();
          setActivities(data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kendaraan</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.vehicles.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.vehicles.active || 0} aktif, {stats?.vehicles.blacklisted || 0} blacklist
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parkir Saat Ini</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.today.currentParked || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.today.guests || 0} tamu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pelanggaran Hari Ini</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.violations.today || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.violations.thisWeek || 0} minggu ini
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Denda Tertunda</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp {((stats?.violations.totalUnpaid || 0)).toLocaleString('id-ID')}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.violations.pendingFines || 0} kasus
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Parking Capacity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Kapasitas Area Utama</CardTitle>
            <CardDescription>
              {stats?.parking.main.occupied} / {stats?.parking.main.capacity} slot terisi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress 
                value={stats?.parking.main.percentage || 0} 
                className={`h-3 ${((stats?.parking.main.percentage || 0) >= 90) ? '[&>div]:bg-red-500' : '[&>div]:bg-emerald-500'}`}
              />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Terisi: {stats?.parking.main.percentage}%</span>
                <Badge variant={(stats?.parking.main.percentage || 0) >= 90 ? 'destructive' : 'secondary'}>
                  {(stats?.parking.main.percentage || 0) >= 90 ? 'Hampir Penuh' : 'Tersedia'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kapasitas Area Tamu</CardTitle>
            <CardDescription>
              {stats?.parking.guest.occupied} / {stats?.parking.guest.capacity} slot terisi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress 
                value={stats?.parking.guest.percentage || 0} 
                className={`h-3 ${((stats?.parking.guest.percentage || 0) >= 90) ? '[&>div]:bg-red-500' : '[&>div]:bg-emerald-500'}`}
              />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Terisi: {stats?.parking.guest.percentage}%</span>
                <Badge variant={(stats?.parking.guest.percentage || 0) >= 90 ? 'destructive' : 'secondary'}>
                  {(stats?.parking.guest.percentage || 0) >= 90 ? 'Hampir Penuh' : 'Tersedia'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Hari Ini</CardTitle>
          <CardDescription>Aktivitas masuk dan keluar kendaraan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
              <div className="text-3xl font-bold text-emerald-600">{stats?.today.totalEntries || 0}</div>
              <div className="text-sm text-emerald-700 dark:text-emerald-300">Kendaraan Masuk</div>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{stats?.today.totalExits || 0}</div>
              <div className="text-sm text-blue-700 dark:text-blue-300">Kendaraan Keluar</div>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
              <div className="text-3xl font-bold text-amber-600">{stats?.today.guests || 0}</div>
              <div className="text-sm text-amber-700 dark:text-amber-300">Tamu Aktif</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Terkini</CardTitle>
          <CardDescription>Log aktivitas sistem terbaru</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Belum ada aktivitas
              </p>
            ) : (
              activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {activity.module}
                      </Badge>
                      <span className="text-sm font-medium">{activity.action}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.user?.fullName || 'System'} • {new Date(activity.createdAt).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
