import { notFound } from "next/navigation";
import Link from "next/link";
import { PilgrimageService } from "@/services/pilgrimage.service";
import { RouteMap } from "@/components/map/RouteMap";

export default async function PilgrimageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pilgrimage = await PilgrimageService.getPilgrimageDetails(slug);
  
  if (!pilgrimage) {
    notFound();
  }

  // Group temples by Day Number
  const days = pilgrimage.sequence.reduce((acc: any, curr: any) => {
    const day = curr.dayNumber || 1;
    if (!acc[day]) acc[day] = [];
    acc[day].push(curr);
    return acc;
  }, {});

  return (
    <div className="bg-stone-50 min-h-screen pb-20">
      {/* Hero */}
      <div className="bg-stone-900 text-white py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
            Official Pilgrimage
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">{pilgrimage.name}</h1>
          <p className="text-lg text-stone-300 max-w-2xl mx-auto">
            {pilgrimage.description}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full font-medium transition-colors shadow-lg">
              Start This Journey
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-3 rounded-full font-medium transition-colors">
              Save for Later
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Itinerary */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
              <h2 className="text-2xl font-bold text-stone-900 mb-6 border-b border-stone-100 pb-4">
                Recommended Itinerary
              </h2>
              
              <div className="space-y-8">
                {Object.keys(days).map((dayKey) => {
                  const dayNum = parseInt(dayKey);
                  return (
                    <div key={dayNum} className="relative">
                      {/* Day Header */}
                      <div className="sticky top-16 bg-white py-2 z-10 flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                          {dayNum}
                        </div>
                        <h3 className="text-xl font-bold text-stone-900">Day {dayNum}</h3>
                      </div>
                      
                      {/* Temples Timeline */}
                      <div className="ml-5 border-l-2 border-stone-100 pl-8 space-y-6 pb-4">
                        {days[dayNum].map((stop: any) => (
                          <div key={stop.sequence} className="relative bg-stone-50 rounded-xl p-5 border border-stone-200 hover:border-orange-300 transition-colors">
                            <div className="absolute -left-[41px] top-5 w-4 h-4 rounded-full bg-white border-4 border-orange-400"></div>
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1 block">Stop {stop.sequence}</span>
                                <h4 className="text-lg font-bold text-stone-900">{stop.temple.name}</h4>
                                <p className="text-sm text-stone-500 mt-1">{stop.temple.address}</p>
                                {stop.notes && (
                                  <p className="text-sm text-orange-700 bg-orange-50 px-3 py-2 rounded-md mt-3 inline-block">
                                    {stop.notes}
                                  </p>
                                )}
                              </div>
                              <Link href="#" className="text-sm font-medium text-blue-600 hover:underline">
                                View Temple
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar / Map */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden sticky top-24">
              <div className="h-64 bg-stone-200 relative">
                 <RouteMap stops={pilgrimage.sequence
                   .filter((s: any) => s.temple.latitude && s.temple.longitude)
                   .map((s: any) => ({ lat: s.temple.latitude, lng: s.temple.longitude, name: s.temple.name }))} 
                 />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-stone-900 mb-4">Journey Summary</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between border-b border-stone-100 pb-2">
                    <span className="text-stone-500">Duration</span>
                    <span className="font-semibold text-stone-900">{pilgrimage.durationDays} Days</span>
                  </li>
                  <li className="flex justify-between border-b border-stone-100 pb-2">
                    <span className="text-stone-500">Total Temples</span>
                    <span className="font-semibold text-stone-900">{pilgrimage.sequence.length}</span>
                  </li>
                  <li className="flex justify-between pb-2">
                    <span className="text-stone-500">Estimated Distance</span>
                    <span className="font-semibold text-stone-900">~650 km</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
