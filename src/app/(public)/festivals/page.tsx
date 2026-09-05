'use client';

import { useState, useEffect } from "react";
import Link from "next/link";

export default function FestivalCalendarPage() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);
  const [region, setRegion] = useState<string>("All Regions");
  
  const [occurrences, setOccurrences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFestivals = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/festivals?year=${year}&region=${region}`);
        const json = await res.json();
        if (json.success) {
          setOccurrences(json.data);
        } else {
          setOccurrences([]);
        }
      } catch (error) {
        console.error("Failed to fetch festivals", error);
        setOccurrences([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFestivals();
  }, [year, region]);

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
          <select 
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="bg-white border border-stone-300 rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
          >
            <option value={currentYear}>{currentYear}</option>
            <option value={currentYear + 1}>{currentYear + 1}</option>
            <option value={currentYear + 2}>{currentYear + 2}</option>
          </select>
          <select 
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="bg-white border border-stone-300 rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
          >
            <option value="All Regions">All Regions</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
          </select>
        </div>
      </div>

      {/* Monthly Timeline View */}
      <div className="space-y-12">
        <div>
          <div className="sticky top-16 bg-stone-50 py-4 z-10 border-b border-stone-200 mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-stone-900">Upcoming in {year}</h2>
            {loading && (
              <svg className="w-5 h-5 animate-spin text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
          </div>
          
          {occurrences.length === 0 && !loading && (
             <div className="text-center py-12 bg-white rounded-xl border border-stone-200 border-dashed">
                <p className="text-stone-500 text-lg">No festivals found for the selected criteria.</p>
             </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {occurrences.map((occ) => {
               const startDate = new Date(occ.startDate);
               const startMonth = months[startDate.getMonth()];
               const startDay = startDate.getDate();
               
               return (
                <div key={occ.id} className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden hover:border-orange-300 transition-colors flex flex-col">
                  <div className="flex border-b border-stone-100">
                    <div className="bg-orange-50 px-6 py-4 flex flex-col items-center justify-center border-r border-stone-100 min-w-[100px]">
                      <span className="text-orange-600 text-sm font-bold uppercase">{startMonth.substring(0, 3)}</span>
                      <span className="text-3xl font-black text-stone-900 leading-none mt-1">{startDay}</span>
                    </div>
                    <div className="p-4 flex flex-col justify-center">
                      <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                        {occ.region?.name || 'All Regions'}
                      </div>
                      <h3 className="text-lg font-bold text-stone-900">{occ.festival.name}</h3>
                      <div className="text-sm text-stone-600 mt-1 flex items-center gap-1">
                         <span className="w-2 h-2 rounded-full bg-orange-400 inline-block"></span>
                         Deity: {occ.festival.deity?.name || 'Various'}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-stone-50 mt-auto border-t border-stone-100">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-stone-500 font-medium">Tithi: {occ.tithi || 'N/A'}</span>
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
