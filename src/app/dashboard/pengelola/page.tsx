'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Car, 
  Users, 
  AlertTriangle, 
  CreditCard, 
  TrendingUp, 
  Calendar,
  BarChart3,
} from 'lucide-react';

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

export default function PengelolaDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kendaraan</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.vehicles.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.vehicles.active || 0} aktif
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
            <CardTitle className="text-sm font-medium">Pelanggaran Bulan Ini</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.violations.thisMonth || 0}</div>
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

      {/* Parking Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Status Area Parkir Utama</CardTitle>
            <CardDescription>
              Kapasitas: {stats?.parking.main.capacity} slot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">Terisi</span>
                <span className="font-medium">
                  {stats?.parking.main.occupied} / {stats?.parking.main.capacity}
                </span>
              </div>
              <Progress value={stats?.parking.main.percentage || 0} className="h-3" />
              <div className="flex justify-between">
                <Badge variant={(stats?.parking.main.percentage || 0) >= 90 ? 'destructive' : 'secondary'}>
                  {(stats?.parking.main.percentage || 0) >= 90 ? 'Hampir Penuh' : 'Tersedia'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {stats?.parking.main.percentage}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Area Parkir Tamu</CardTitle>
            <CardDescription>
              Kapasitas: {stats?.parking.guest.capacity} slot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">Terisi</span>
                <span className="font-medium">
                  {stats?.parking.guest.occupied} / {stats?.parking.guest.capacity}
                </span>
              </div>
              <Progress value={stats?.parking.guest.percentage || 0} className="h-3" />
              <div className="flex justify-between">
                <Badge variant={(stats?.parking.guest.percentage || 0) >= 90 ? 'destructive' : 'secondary'}>
                  {(stats?.parking.guest.percentage || 0) >= 90 ? 'Hampir Penuh' : 'Tersedia'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {stats?.parking.guest.percentage}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Ringkasan Hari Ini
          </CardTitle>
          <CardDescription>Aktivitas kendaraan hari ini</CardDescription>
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

      {/* Violations Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Ringkasan Pelanggaran
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">{stats?.violations.today || 0}</div>
              <div className="text-sm text-muted-foreground">Hari Ini</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">{stats?.violations.thisWeek || 0}</div>
              <div className="text-sm text-muted-foreground">Minggu Ini</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">{stats?.violations.thisMonth || 0}</div>
              <div className="text-sm text-muted-foreground">Bulan Ini</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats?.violations.pendingFines || 0}</div>
              <div className="text-sm text-muted-foreground">Belum Bayar</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
