'use client';
import React from 'react';
import { useAuth } from '@/services/AuthContext';

export default function AdminCategoriasPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Página de Categorias</h1>
      <p>Bienvenido, {user?.username}</p>
      {/* Contenido del dashboard */}
    </div>
  );
}