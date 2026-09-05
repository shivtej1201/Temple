"use client";

import { useState } from "react";
import Link from "next/link";

export default function TemplesNearMe() {
  const [temples, setTemples] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationGranted, setLocationGranted] = useState(false);

  const fetchNearbyTemples = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setLocationGranted(true);
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`/api/v1/nearby/temples?lat=${latitude}&lng=${longitude}&radius=25000`);
          const data = await res.json();
          if (data.success) {
            setTemples(data.data || []);
          } else {
            setError(data.error || "Failed to fetch nearby temples.");
          }
        } catch (err) {
          setError("Network error occurred.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError("Location access denied or unavailable.");
        setLoading(false);
      }
    );
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-stone-200 mt-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-stone-900">Temples Near You</h2>
          <p className="text-stone-600 mt-2">Discover sacred spaces in your local area.</p>
        </div>
        {!locationGranted && !loading && (
          <button 
            onClick={fetchNearbyTemples}
            className="bg-orange-100 hover:bg-orange-200 text-orange-800 font-medium px-4 py-2 rounded-md transition-colors text-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
            Use My Location
          </button>
        )}
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="group bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden flex flex-col h-[300px] animate-pulse">
              <div className="h-40 bg-stone-200 w-full"></div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="h-5 w-3/4 bg-stone-200 rounded mb-2"></div>
                <div className="h-4 w-full bg-stone-100 rounded mb-4"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-100">
          {error}
        </div>
      )}

      {locationGranted && !loading && temples.length === 0 && !error && (
        <div className="text-center py-12 text-stone-500 bg-stone-50 rounded-xl border border-stone-100">
          No Hindu temples found within 25km of your location.
        </div>
      )}

      {locationGranted && !loading && temples.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {temples.slice(0, 4).map((temple) => (
            <div key={temple.id} className="group bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-[320px]">
              <div 
                className="h-40 w-full relative bg-cover bg-center" 
                style={{ backgroundImage: `url(${temple.image?.url || 'https://images.unsplash.com/photo-1542868727-4bb3342eb6f5?q=80&w=800'})` }}
              >
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-stone-900 mb-1 truncate">{temple.name}</h3>
                <p className="text-stone-600 text-sm mb-4 line-clamp-2">
                  {temple.address || 'Address not available.'}
                </p>
                <div className="mt-auto flex justify-between items-center pt-3 border-t border-stone-100">
                  {temple.rating && (
                    <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                      ★ {temple.rating}
                    </span>
                  )}
                  <Link href={`/temples/${temple.slug || `p_${temple.googlePlaceId}`}`} className="text-sm font-medium text-orange-600 hover:text-orange-700 ml-auto">
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
