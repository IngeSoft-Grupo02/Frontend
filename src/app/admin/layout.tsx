import { AdminSidebar } from '@/components/admin/Sidebar';
import type { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen bg-brand-bg flex overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 ml-[280px] p-6 lg:p-12 overflow-y-auto">
        <div className="bg-white/50 backdrop-blur-3xl rounded-[40px] shadow-sm min-h-[90vh] py-8 lg:py-12 px-6 lg:px-12 border border-white/20">
          {children}
        </div>
      </main>
    </div>
  );
}