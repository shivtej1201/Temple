"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function TemplesPage() {
  const [temples, setTemples] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  const fetchTemples = async (query = "") => {
    setLoading(true);
    try {
      const url = query 
        ? `/api/v1/temples/search?q=${encodeURIComponent(query)}`
        : `/api/v1/temples`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.success) {
        setTemples(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch temples:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemples();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (typingTimeout) clearTimeout(typingTimeout);

    setTypingTimeout(
      setTimeout(() => {
        fetchTemples(value);
      }, 500) // 500ms debounce
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Explore Temples</h1>
          <p className="text-stone-600 mt-2">Discover sacred sites across India.</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-4">
          <div className="relative">
            <input 
              type="text" 
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search temples..." 
              className="pl-4 pr-10 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-full md:w-64"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          // Loading skeletons
          [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="group bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden flex flex-col h-[350px] animate-pulse">
              <div className="h-48 bg-stone-200 w-full relative"></div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="h-3 w-16 bg-orange-200 rounded mb-2"></div>
                <div className="h-5 w-3/4 bg-stone-200 rounded mb-2"></div>
                <div className="h-4 w-full bg-stone-100 rounded mb-1"></div>
                <div className="h-4 w-2/3 bg-stone-100 rounded mb-4"></div>
              </div>
            </div>
          ))
        ) : temples.length > 0 ? (
          temples.map((temple) => (
            <div key={temple.id} className="group bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-[350px]">
              <div 
                className="h-48 w-full relative bg-cover bg-center" 
                style={{ backgroundImage: `url(${temple.image?.url || 'https://images.unsplash.com/photo-1542868727-4bb3342eb6f5?q=80&w=800'})` }}
              >
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                 {temple.templeType && (
                   <div className="absolute top-2 right-2 bg-white/90 backdrop-blur text-xs font-semibold px-2 py-1 rounded shadow-sm z-10">
                     {temple.templeType}
                   </div>
                 )}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-1 text-xs font-medium text-orange-600 uppercase tracking-wider mb-1">
                  <span>{temple.deity?.name || temple.primaryDeity?.name || 'Deity'}</span>
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-1 truncate">{temple.name}</h3>
                <p className="text-stone-600 text-sm mb-4 line-clamp-2">
                  {temple.address || temple.description || 'Address not available.'}
                </p>
                
                <div className="mt-auto flex justify-between items-center pt-4 border-t border-stone-100">
                  <span className="text-xs text-stone-500 truncate max-w-[120px]">
                    {temple.location?.city || temple.region?.name || 'Unknown Location'}
                  </span>
                  <Link href={`/temples/${temple.slug || `p_${temple.googlePlaceId}`}`} className="text-sm font-medium text-stone-900 group-hover:text-orange-600 transition-colors">
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-stone-500">
            No temples found. Try adjusting your search query.
          </div>
        )}
      </div>
    </div>
  );
}
