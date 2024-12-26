'use client';

import { ProtectedRoute } from '@/services/ProtectedRoute';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { AuthProvider } from '@/services/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <div className="flex">
          <AdminSidebar />
          <main className="flex-grow">
            {children}
          </main>
        </div>
      </ProtectedRoute>
    </AuthProvider>
  );
}