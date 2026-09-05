import Link from "next/link";
import { PilgrimageService } from "@/services/pilgrimage.service";

export default async function PilgrimagesPage() {
  const pilgrimages = await PilgrimageService.getPilgrimages();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-stone-900 tracking-tight">Sacred Pilgrimages</h1>
          <p className="text-lg text-stone-600 mt-2 max-w-2xl">
            Discover established spiritual routes, map out your itinerary, and track your lifelong journey.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pilgrimages.map((pilgrimage) => (
          <Link href={`/pilgrimages/${pilgrimage.slug}`} key={pilgrimage.id} className="group block">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-lg transition-all flex flex-col h-full transform hover:-translate-y-1">
              <div className="h-48 bg-stone-200 relative overflow-hidden">
                 <div className="absolute inset-0 bg-stone-800/20 group-hover:bg-transparent transition-colors z-10"></div>
                 <div className="absolute bottom-3 right-3 z-20">
                    <span className="bg-white/90 backdrop-blur text-stone-800 text-xs font-bold px-2 py-1 rounded shadow-sm">
                      {pilgrimage.templeCount} Temples
                    </span>
                 </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex gap-2 mb-3">
                  <span className="text-xs font-semibold px-2 py-1 bg-stone-100 text-stone-600 rounded">
                    {pilgrimage.region?.name || 'Various'}
                  </span>
                  <span className="text-xs font-semibold px-2 py-1 bg-orange-50 text-orange-700 rounded">
                    {pilgrimage.durationDays} Days
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-stone-900 mb-2 group-hover:text-orange-600 transition-colors">
                  {pilgrimage.name}
                </h3>
                <p className="text-stone-600 text-sm mb-6 flex-1">
                  {pilgrimage.description}
                </p>
                
                <div className="mt-auto border-t border-stone-100 pt-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-500 font-medium">Difficulty:</span>
                    <span className={`text-xs font-bold ${
                      pilgrimage.difficulty === 'EASY' ? 'text-green-600' : 
                      pilgrimage.difficulty === 'MODERATE' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {pilgrimage.difficulty}
                    </span>
                  </div>
                  <span className="text-orange-600 font-medium text-sm">View Route &rarr;</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
