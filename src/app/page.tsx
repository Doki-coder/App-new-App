'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { preferences, loading } = useUser();

  useEffect(() => {
    if (!loading) {
      if (preferences.isFirstLaunch) {
        router.replace('/welcome');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [preferences.isFirstLaunch, loading, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
