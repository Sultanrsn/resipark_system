'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Car, Users, LogIn, LogOut, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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
}

export default function SatpamDashboard() {
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
      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/dashboard/satpam/entry">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-emerald-200 bg-emerald-50 dark:bg-emerald-950">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <LogIn className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Akses Masuk</h3>
                  <p className="text-muted-foreground">Catat kendaraan masuk</p>
                </div>
                <ArrowRight className="w-6 h-6 ml-auto text-emerald-600" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/satpam/exit">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200 bg-blue-50 dark:bg-blue-950">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center">
                  <LogOut className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Akses Keluar</h3>
                  <p className="text-muted-foreground">Catat kendaraan keluar</p>
                </div>
                <ArrowRight className="w-6 h-6 ml-auto text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Masuk Hari Ini</CardTitle>
            <LogIn className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{stats?.today.totalEntries || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Keluar Hari Ini</CardTitle>
            <LogOut className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.today.totalExits || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parkir Saat Ini</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.today.currentParked || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tamu Aktif</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats?.today.guests || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Parking Capacity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Area Parkir Utama</CardTitle>
            <CardDescription>
              {stats?.parking.main.occupied} / {stats?.parking.main.capacity} slot terisi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress 
              value={stats?.parking.main.percentage || 0} 
              className="h-4"
            />
            <div className="flex justify-between mt-2">
              <span className="text-sm text-muted-foreground">
                {stats?.parking.main.percentage}% terisi
              </span>
              <Badge variant={(stats?.parking.main.percentage || 0) >= 90 ? 'destructive' : 'secondary'}>
                {(stats?.parking.main.percentage || 0) >= 90 ? 'Hampir Penuh' : 'Tersedia'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Area Parkir Tamu</CardTitle>
            <CardDescription>
              {stats?.parking.guest.occupied} / {stats?.parking.guest.capacity} slot terisi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress 
              value={stats?.parking.guest.percentage || 0} 
              className="h-4"
            />
            <div className="flex justify-between mt-2">
              <span className="text-sm text-muted-foreground">
                {stats?.parking.guest.percentage}% terisi
              </span>
              <Badge variant={(stats?.parking.guest.percentage || 0) >= 90 ? 'destructive' : 'secondary'}>
                {(stats?.parking.guest.percentage || 0) >= 90 ? 'Hampir Penuh' : 'Tersedia'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Menu Lainnya</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            <Link href="/dashboard/satpam/guests">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Registrasi Tamu
              </Button>
            </Link>
            <Link href="/dashboard/satpam/violations">
              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Catat Pelanggaran
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
