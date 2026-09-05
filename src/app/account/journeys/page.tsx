import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

export default async function AccountJourneysPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/account/journeys");
  }

  const journeys = await prisma.userJourney.findMany({
    where: { userId: session.user.id },
    include: {
      pilgrimage: true,
      stops: {
        include: { temple: true },
        orderBy: { sequence: 'asc' }
      }
    },
    orderBy: { updatedAt: 'desc' }
  });

  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-stone-900">My Journeys</h1>
          <Link href="/journeys/create" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Create New Journey
          </Link>
        </div>

        {journeys.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-12 text-center">
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-stone-900 mb-2">No journeys planned yet</h2>
            <p className="text-stone-500 max-w-md mx-auto mb-6">Start planning your next spiritual adventure by creating a custom itinerary or selecting an official pilgrimage.</p>
            <Link href="/journeys/create" className="bg-stone-900 text-white px-6 py-3 rounded-lg font-bold">
              Start Planning
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {journeys.map((journey: any) => (
              <div key={journey.id} className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:border-orange-300 transition-colors">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-stone-900">{journey.name}</h3>
                      <p className="text-sm text-stone-500 mt-1">
                        {journey.stops.length} Temples &bull; {journey.status}
                      </p>
                    </div>
                    {journey.pilgrimage && (
                      <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded">Official</span>
                    )}
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    {journey.stops.slice(0, 3).map((stop: any, idx: number) => (
                      <div key={stop.id} className="flex items-center gap-3 text-sm">
                        <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 text-xs font-bold">
                          {idx + 1}
                        </div>
                        <span className="text-stone-700">{stop.temple.name}</span>
                      </div>
                    ))}
                    {journey.stops.length > 3 && (
                      <div className="text-xs text-stone-400 pl-9 font-medium">
                        + {journey.stops.length - 3} more stops
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium py-2 rounded-lg transition-colors text-sm">
                      View Itinerary
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
