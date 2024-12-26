'use client';

import { useAuth } from '@/services/AuthContext';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check authentication status and redirect if not authenticated
    if (!isAuthenticated()) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  // If not authenticated, render nothing
  if (!isAuthenticated()) {
    return null;
  }

  return <>{children}</>;
}