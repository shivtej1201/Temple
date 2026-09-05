"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface NearbyTemple {
  id: string;
  name: string;
  slug: string;
  address: string;
  distanceKm: number;
  isMajor: boolean;
  primaryDeity?: { name: string };
  images?: { url: string }[];
}

export function NearbyTemples({ lat, lng, currentTempleId }: { lat: number | null, lng: number | null, currentTempleId: string }) {
  const [temples, setTemples] = useState<NearbyTemple[]>([]);
  const [loading, setLoading] = useState(true);
  const [radius, setRadius] = useState(25); // Default 25km

  useEffect(() => {
    async function fetchNearby() {
      if (!lat || !lng) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/nearby/temples?lat=${lat}&lng=${lng}&radius=${radius}`);
        if (res.ok) {
          const json = await res.json();
          // Filter out the current temple
          setTemples(json.data.filter((t: NearbyTemple) => t.id !== currentTempleId));
        }
      } catch (e) {
        console.error("Failed to fetch nearby temples", e);
      } finally {
        setLoading(false);
      }
    }
    fetchNearby();
  }, [lat, lng, radius, currentTempleId]);

  if (!lat || !lng) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
      <div className="flex justify-between items-center mb-6 border-b border-stone-100 pb-4">
        <h2 className="text-2xl font-bold text-stone-900">Nearby Temples</h2>
        <select 
          value={radius} 
          onChange={(e) => setRadius(Number(e.target.value))}
          className="text-sm bg-stone-50 border border-stone-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value={5000}>Within 5 km</option>
          <option value={10000}>Within 10 km</option>
          <option value={25000}>Within 25 km</option>
          <option value={50000}>Within 50 km</option>
        </select>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-stone-100 rounded-xl"></div>
          <div className="h-20 bg-stone-100 rounded-xl"></div>
        </div>
      ) : temples.length === 0 ? (
        <div className="text-center py-8 text-stone-500 bg-stone-50 rounded-xl border border-dashed border-stone-200">
          No other temples found within {radius / 1000} km.
        </div>
      ) : (
        <div className="space-y-4">
          {temples.map((temple: any) => {
            const templeLink = temple.slug ? `/temples/${temple.slug}` : `/temples/p_${temple.id}`;
            return (
            <div key={temple.id} className="flex items-center gap-4 p-4 rounded-xl border border-stone-100 hover:border-orange-200 hover:bg-orange-50/30 transition-colors">
              <div className="w-16 h-16 rounded-lg bg-stone-200 flex-shrink-0 overflow-hidden bg-cover bg-center"
                   style={{ backgroundImage: `url(https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=200)` }}>
              </div>
              <div className="flex-1">
                <Link href={templeLink} className="text-lg font-bold text-stone-900 hover:text-orange-600 block">
                  {temple.name}
                  {temple.isVIPDarshanAvailable && <span className="ml-2 text-[10px] uppercase tracking-wider bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full align-middle">VIP Darshan</span>}
                </Link>
                <div className="flex items-center gap-2 mt-1 text-sm text-stone-500">
                  {temple.rating && <span className="font-medium text-yellow-600">★ {temple.rating}</span>}
                  <span>&bull;</span>
                  <span className="truncate">{temple.address || 'Unknown address'}</span>
                </div>
              </div>
              <div>
                <Link href={templeLink} className="text-sm font-medium text-blue-600 hover:underline px-3 py-2">
                  View
                </Link>
              </div>
            </div>
          )})}
        </div>
      )}
    </div>
  );
}
