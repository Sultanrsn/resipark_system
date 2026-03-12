'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Car, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect based on role
        const role = data.data.user.role;
        switch (role) {
          case 'ADMIN':
            router.push('/dashboard/admin');
            break;
          case 'SATPAM':
            router.push('/dashboard/satpam');
            break;
          case 'WARGA':
            router.push('/dashboard/warga');
            break;
          case 'PENGELOLA':
            router.push('/dashboard/pengelola');
            break;
          default:
            router.push('/dashboard');
        }
      } else {
        setError(data.error?.message || 'Login gagal');
      }
    } catch (err) {
      setError('Terjadi kesalahan sistem. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center">
            <Car className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Sistem Parkir Perumahan</CardTitle>
            <CardDescription className="mt-2">
              Masuk ke sistem manajemen parkir
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Masuk...
                </>
              ) : (
                'Masuk'
              )}
            </Button>
          </form>
          
          <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
            <p className="font-medium mb-2">Demo Login:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>Admin: <span className="font-mono">admin</span></div>
              <div>Satpam: <span className="font-mono">satpam1</span></div>
              <div>Warga: <span className="font-mono">warga1</span></div>
              <div>Pengelola: <span className="font-mono">pengelola</span></div>
            </div>
            <p className="mt-2 text-xs">Password: <span className="font-mono">password123</span></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
