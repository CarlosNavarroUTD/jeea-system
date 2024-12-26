'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/services/AuthContext';

export default function AdminDashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Move routing logic to useEffect to prevent render-time updates
    if (!isAuthenticated()) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  // If not authenticated, render nothing
  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div>
      <h1>Panel de Administración</h1>
      <p>Bienvenido, {user?.username}</p>
      {/* Contenido del dashboard */}
    </div>
  );
}