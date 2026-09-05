import Link from "next/link";
import { ReactNode } from "react";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Simple header for account section, or could share the public header */}
      <header className="bg-white border-b border-stone-200 h-16 flex items-center px-8">
        <Link href="/" className="text-xl font-bold text-orange-600">Darshan</Link>
      </header>
      
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row gap-8">
        {/* Account Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="p-6 border-b border-stone-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-lg">
                U
              </div>
              <div>
                <h2 className="font-bold text-stone-900">User Profile</h2>
                <p className="text-xs text-stone-500">user@example.com</p>
              </div>
            </div>
            <nav className="p-2">
              <Link href="/account/journeys" className="block px-4 py-2 rounded-md hover:bg-stone-50 text-sm font-medium text-stone-700 hover:text-orange-600">
                My Journeys
              </Link>
              <Link href="/account/wishlist" className="block px-4 py-2 rounded-md hover:bg-stone-50 text-sm font-medium text-stone-700 hover:text-orange-600">
                Wishlist
              </Link>
              <Link href="/account/visited" className="block px-4 py-2 rounded-md hover:bg-stone-50 text-sm font-medium text-stone-700 hover:text-orange-600">
                Visited Temples
              </Link>
              <Link href="/account/calendar" className="block px-4 py-2 rounded-md hover:bg-stone-50 text-sm font-medium text-stone-700 hover:text-orange-600">
                My Calendar
              </Link>
              <Link href="/account/settings" className="block px-4 py-2 rounded-md hover:bg-stone-50 text-sm font-medium text-stone-700 hover:text-orange-600 mt-4">
                Settings
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Account Area */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
