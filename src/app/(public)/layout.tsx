import Link from "next/link";
import { ReactNode } from "react";
import AIAssistant from "@/components/shared/AIAssistant";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      {/* Navigation Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-xl font-bold text-orange-600">Darshan</span>
              </Link>
              <nav className="hidden md:flex gap-6">
                <Link href="/temples" className="text-sm font-medium text-stone-600 hover:text-orange-600 transition-colors">
                  Temples
                </Link>
                <Link href="/festivals" className="text-sm font-medium text-stone-600 hover:text-orange-600 transition-colors">
                  Festivals
                </Link>
                <Link href="/pilgrimages" className="text-sm font-medium text-stone-600 hover:text-orange-600 transition-colors">
                  Pilgrimages
                </Link>
                <Link href="/threads" className="text-sm font-medium text-stone-600 hover:text-orange-600 transition-colors">
                  Community
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:block relative">
                <input 
                  type="text" 
                  placeholder="Search temples, regions..." 
                  className="pl-4 pr-10 py-2 border border-stone-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-64"
                />
              </div>
              <Link href="/login" className="text-sm font-medium text-stone-700 hover:text-stone-900">
                Log in
              </Link>
              <Link href="/register" className="text-sm font-medium bg-orange-600 text-white px-4 py-2 rounded-full hover:bg-orange-700 transition-colors">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <span className="text-xl font-bold text-white tracking-tight">Darshan</span>
            <p className="mt-4 text-sm">
              The definitive platform for temple discovery, festival calendars, and pilgrimage planning.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Discover</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/temples" className="hover:text-white transition-colors">All Temples</Link></li>
              <li><Link href="/regions" className="hover:text-white transition-colors">By Region</Link></li>
              <li><Link href="/deities" className="hover:text-white transition-colors">By Deity</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Journey</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/festivals" className="hover:text-white transition-colors">Festival Calendar</Link></li>
              <li><Link href="/pilgrimages" className="hover:text-white transition-colors">Pilgrimages</Link></li>
              <li><Link href="/account/journeys" className="hover:text-white transition-colors">My Journeys</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Community</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/threads" className="hover:text-white transition-colors">Discussions</Link></li>
              <li><Link href="/guidelines" className="hover:text-white transition-colors">Guidelines</Link></li>
              <li><Link href="/admin/dashboard" className="hover:text-white transition-colors">Admin Panel</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-stone-800 text-sm text-center">
          © {new Date().getFullYear()} Darshan Platform. All rights reserved.
        </div>
      </footer>
      
      <AIAssistant />
    </div>
  );
}
