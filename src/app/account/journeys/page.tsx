import Link from "next/link";

export default function UserJourneysPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-stone-900 mb-2">My Journeys</h1>
      <p className="text-stone-600 mb-8">Track your active pilgrimages and planned trips.</p>

      {/* Active Journey */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-stone-900 mb-4">Active Journey</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded mb-2">IN PROGRESS</span>
              <h3 className="text-2xl font-bold text-stone-900">My Ashtavinayak Yatra</h3>
              <p className="text-stone-500 text-sm">Started on Oct 10, 2026</p>
            </div>
            <button className="px-4 py-2 bg-orange-50 text-orange-700 font-medium rounded-lg hover:bg-orange-100 transition-colors">
              Continue
            </button>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-stone-700">Progress</span>
              <span className="font-bold text-orange-600">3 / 8 Temples Visited</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-3">
              <div className="bg-orange-500 h-3 rounded-full" style={{ width: '37.5%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Planned/Past Journeys */}
      <div>
        <h2 className="text-lg font-bold text-stone-900 mb-4">Planned Trips</h2>
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8 text-center">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
             <svg className="w-8 h-8 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          </div>
          <h3 className="font-bold text-stone-900 mb-2">Plan a new journey</h3>
          <p className="text-stone-500 text-sm mb-6 max-w-sm mx-auto">Create a custom itinerary or follow an official pilgrimage route.</p>
          <Link href="/pilgrimages" className="bg-stone-900 text-white px-6 py-2 rounded-full font-medium hover:bg-stone-800 transition-colors">
            Browse Pilgrimages
          </Link>
        </div>
      </div>
    </div>
  );
}
