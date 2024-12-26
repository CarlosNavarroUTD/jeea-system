'use client';
import React from 'react';
import { useAuth } from '@/services/AuthContext';

export default function AdminInventarioPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Página de Inventario</h1>
      <p>Bienvenido, {user?.username}</p>
      {/* Contenido del dashboard */}
    </div>
  );
}