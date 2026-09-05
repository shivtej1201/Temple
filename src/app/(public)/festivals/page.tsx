import Link from "next/link";
import { FestivalService } from "@/services/festival.service";

export default async function FestivalCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string; region?: string }>;
}) {
  const currentYear = new Date().getFullYear();
  const { year: yearParam } = await searchParams;
  const year = yearParam ? parseInt(yearParam) : currentYear;
  
  // Fetch occurrences from our service
  const occurrences = await FestivalService.getUpcomingFestivals(year);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-stone-900 tracking-tight">Festival Calendar</h1>
          <p className="text-lg text-stone-600 mt-2 max-w-2xl">
            Plan your spiritual journeys around auspicious dates. Our calendar tracks regional variations and calculates exact Tithis.
          </p>
        </div>
        
        <div className="mt-6 md:mt-0 flex flex-wrap gap-3">
          <select className="bg-white border border-stone-300 rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm">
            <option>Year: {year}</option>
            <option>{year + 1}</option>
            <option>{year + 2}</option>
          </select>
          <select className="bg-white border border-stone-300 rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm">
            <option>All Regions</option>
            <option>Maharashtra</option>
            <option>Tamil Nadu</option>
            <option>Uttar Pradesh</option>
          </select>
        </div>
      </div>

      {/* Monthly Timeline View */}
      <div className="space-y-12">
        {/* We'll group by month for the UI. For this stub, we just render a single block. */}
        <div>
          <div className="sticky top-16 bg-stone-50 py-4 z-10 border-b border-stone-200 mb-6">
            <h2 className="text-2xl font-bold text-stone-900">Upcoming in {year}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {occurrences.map((occ) => {
               const startMonth = months[occ.startDate.getMonth()];
               const startDay = occ.startDate.getDate();
               
               return (
                <div key={occ.id} className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden hover:border-orange-300 transition-colors flex flex-col">
                  <div className="flex border-b border-stone-100">
                    <div className="bg-orange-50 px-6 py-4 flex flex-col items-center justify-center border-r border-stone-100 min-w-[100px]">
                      <span className="text-orange-600 text-sm font-bold uppercase">{startMonth.substring(0, 3)}</span>
                      <span className="text-3xl font-black text-stone-900 leading-none mt-1">{startDay}</span>
                    </div>
                    <div className="p-4 flex flex-col justify-center">
                      <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                        {occ.region.name}
                      </div>
                      <h3 className="text-lg font-bold text-stone-900">{occ.festival.name}</h3>
                      <div className="text-sm text-stone-600 mt-1 flex items-center gap-1">
                         <span className="w-2 h-2 rounded-full bg-orange-400 inline-block"></span>
                         Deity: {occ.festival.deity.name}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-stone-50 mt-auto border-t border-stone-100">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-stone-500 font-medium">Tithi: {occ.tithi}</span>
                      <Link href={`/festivals/${occ.festival.slug}`} className="text-orange-600 font-semibold hover:text-orange-700">
                        View Temples &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
               );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
