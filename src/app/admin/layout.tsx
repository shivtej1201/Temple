import Link from "next/link";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-4 bg-slate-950">
          <h1 className="text-xl font-bold tracking-tight">Temple Admin</h1>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Overview
          </div>
          <Link href="/admin/dashboard" className="block px-4 py-2 hover:bg-slate-800 transition-colors">
            Dashboard
          </Link>
          
          <div className="px-4 mt-6 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Content
          </div>
          <Link href="/admin/temples" className="block px-4 py-2 hover:bg-slate-800 transition-colors">
            Temples
          </Link>
          <Link href="/admin/deities" className="block px-4 py-2 hover:bg-slate-800 transition-colors">
            Deities
          </Link>
          <Link href="/admin/regions" className="block px-4 py-2 hover:bg-slate-800 transition-colors">
            Regions
          </Link>
          <Link href="/admin/festivals" className="block px-4 py-2 hover:bg-slate-800 transition-colors">
            Festivals
          </Link>
          <Link href="/admin/pilgrimages" className="block px-4 py-2 hover:bg-slate-800 transition-colors">
            Pilgrimages
          </Link>

          <div className="px-4 mt-6 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Verification
          </div>
          <Link href="/admin/sources" className="block px-4 py-2 hover:bg-slate-800 transition-colors">
            Pending Content
          </Link>
          
          <div className="px-4 mt-6 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Community
          </div>
          <Link href="/admin/users" className="block px-4 py-2 hover:bg-slate-800 transition-colors">
            Users
          </Link>
          <Link href="/admin/moderation" className="block px-4 py-2 hover:bg-slate-800 transition-colors">
            Moderation
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-end px-8">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Admin User</span>
            <div className="w-8 h-8 rounded-full bg-slate-200"></div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
