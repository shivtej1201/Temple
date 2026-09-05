"use client";

import { useEffect, useState } from "react";

interface ServicePlace {
  id: string;
  name: string;
  vicinity: string;
  rating?: number;
  user_ratings_total?: number;
  type: string;
}

export function NearbyServices({ lat, lng }: { lat: number | null, lng: number | null }) {
  const [services, setServices] = useState<ServicePlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'lodging' | 'restaurant'>('lodging');

  useEffect(() => {
    async function fetchServices() {
      if (!lat || !lng) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/nearby/services?lat=${lat}&lng=${lng}&type=${activeTab}`);
        const data = await res.json();
        if (data.success && data.results) {
          setServices(data.results);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, [lat, lng, activeTab]);

  if (!lat || !lng) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
      <div className="flex justify-between items-center mb-6 border-b border-stone-100 pb-4">
        <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
           <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
           Nearby Amenities
        </h2>
        
        <div className="flex bg-stone-100 rounded-lg p-1">
          <button 
            onClick={() => setActiveTab('lodging')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'lodging' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-700'}`}
          >
            Hotels
          </button>
          <button 
            onClick={() => setActiveTab('restaurant')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'restaurant' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-700'}`}
          >
            Food
          </button>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-16 bg-stone-100 rounded-xl"></div>
          <div className="h-16 bg-stone-100 rounded-xl"></div>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-8 text-stone-500 bg-stone-50 rounded-xl border border-dashed border-stone-200">
          No {activeTab === 'lodging' ? 'hotels' : 'restaurants'} found nearby.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.slice(0, 4).map(service => (
            <div key={service.id} className="flex gap-4 p-4 rounded-xl border border-stone-100 hover:border-green-300 hover:bg-green-50/30 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                {activeTab === 'lodging' ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"></path></svg>
                )}
              </div>
              <div>
                <h4 className="font-bold text-stone-900 line-clamp-1">{service.name}</h4>
                <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">{service.vicinity}</p>
                {service.rating && (
                  <div className="flex items-center gap-1 mt-1">
                    <svg className="w-3.5 h-3.5 text-yellow-500 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <span className="text-xs font-medium text-stone-700">{service.rating}</span>
                    <span className="text-xs text-stone-400">({service.user_ratings_total})</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {services.length > 0 && (
        <div className="mt-4 pt-4 border-t border-stone-100 flex justify-center">
          <button className="text-sm font-medium text-green-700 hover:underline">
            View all {activeTab === 'lodging' ? 'hotels' : 'restaurants'} on Map
          </button>
        </div>
      )}
    </div>
  );
}
