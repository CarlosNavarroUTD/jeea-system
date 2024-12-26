import Link from 'next/link';
import React from 'react';
import Navbar from '@/components/layout/Navbar';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6">Bienvenido</h1>
          <div className="space-x-4">
            <Link 
              href="/login" 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Iniciar Sesión
            </Link>
            <Link 
              href="/dashboard" 
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Panel de Administración
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

