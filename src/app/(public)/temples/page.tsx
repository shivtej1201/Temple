import Link from "next/link";
import { prisma } from "@/lib/db/prisma";

export default async function TemplesPage() {
  // Fetch from DB (handled safely if DB not connected)
  let temples: any[] = [];
  try {
    temples = await prisma.temple.findMany({
      where: { isVerified: true },
      take: 12,
      include: {
        primaryDeity: true,
        region: true
      }
    });
  } catch (error) {
    console.error("DB connection error:", error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Explore Temples</h1>
          <p className="text-stone-600 mt-2">Discover sacred sites across India.</p>
        </div>
        
        {/* Filters placeholder */}
        <div className="mt-4 md:mt-0 flex gap-2 overflow-x-auto pb-2">
          <select className="bg-white border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option>All Regions</option>
            <option>Maharashtra</option>
            <option>Karnataka</option>
          </select>
          <select className="bg-white border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option>All Deities</option>
            <option>Shiva</option>
            <option>Ganesha</option>
          </select>
          <select className="bg-white border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option>Any Type</option>
            <option>Jyotirlinga</option>
            <option>Shakti Peetha</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {temples.length > 0 ? (
          temples.map((temple) => (
            <div key={temple.id} className="group bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="h-48 w-full relative bg-cover bg-center" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=800)` }}>
                 <div className="absolute inset-0 bg-black/20"></div>
                 <div className="absolute top-2 right-2 bg-white/90 backdrop-blur text-xs font-semibold px-2 py-1 rounded shadow-sm z-10">
                   {temple.templeType || 'Temple'}
                 </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-1 text-xs font-medium text-orange-600 uppercase tracking-wider mb-1">
                  <span>{temple.primaryDeity?.name || 'Deity'}</span>
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-1">{temple.name}</h3>
                <p className="text-stone-600 text-sm mb-4 line-clamp-2">{temple.description || 'No description available.'}</p>
                
                <div className="mt-auto flex justify-between items-center pt-4 border-t border-stone-100">
                  <span className="text-xs text-stone-500">{temple.region?.name || 'Unknown Location'}</span>
                  <Link href={`/temples/${temple.slug}`} className="text-sm font-medium text-stone-900 group-hover:text-orange-600 transition-colors">
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          // Mock data if DB is empty/unconnected
          [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="group bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="h-48 bg-stone-200 w-full relative"></div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="h-3 w-16 bg-orange-200 rounded mb-2"></div>
                <div className="h-5 w-3/4 bg-stone-200 rounded mb-2"></div>
                <div className="h-4 w-full bg-stone-100 rounded mb-1"></div>
                <div className="h-4 w-2/3 bg-stone-100 rounded mb-4"></div>
                
                <div className="mt-auto flex justify-between items-center pt-4 border-t border-stone-100">
                  <div className="h-3 w-20 bg-stone-200 rounded"></div>
                  <div className="h-4 w-12 bg-stone-300 rounded"></div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {temples.length === 0 && (
         <div className="text-center mt-12 text-stone-500">
           (Showing placeholder skeletons while database is unconnected)
         </div>
      )}
    </div>
  );
}
