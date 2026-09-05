import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { NearbyTemples } from "@/components/temple/NearbyTemples";
import { NearbyServices } from "@/components/temple/NearbyServices";
import { TempleMap } from "@/components/map/TempleMap";

export default async function TempleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  let temple;
  try {
    temple = await prisma.temple.findUnique({
      where: { slug: slug },
      include: {
        primaryDeity: true,
        region: true,
        city: true,
        images: { orderBy: { sortOrder: 'asc' } },
        timings: true,
        darshans: { where: { isActive: true } },
        festivals: { include: { festival: true } },
        events: true,
        deities: { include: { deity: true } }
      }
    });
  } catch (error) {
    console.error("DB Error fetching temple:", error);
  }

  if (!temple) {
    // If DB is offline, show a nice mock page for development demonstration
    if (slug === "kashi-vishwanath") {
      temple = {
        name: "Kashi Vishwanath",
        primaryDeity: { name: "Shiva" },
        region: { name: "Uttar Pradesh" },
        address: "Varanasi, UP",
        description: "One of the most famous Hindu temples dedicated to Lord Shiva, located in Varanasi.",
        history: "The temple has been destroyed and rebuilt several times over the centuries. The current structure was built by Ahilya Bai Holkar in 1780.",
        templeType: "JYOTIRLINGA",
        images: [{ url: "https://images.unsplash.com/photo-1598155523122-3842334d6c1f?q=80&w=2070", altText: "Kashi Vishwanath Temple" }],
        timings: [{ dayOfWeek: 0, morningOpen: "03:00", morningClose: "11:00", eveningOpen: "12:00", eveningClose: "23:00" }],
        darshans: [{ name: "Mangala Aarti", type: "SPECIAL", price: 500, currency: "INR" }],
        isVerified: true,
        id: "mock-kashi"
      };
    } else {
      notFound();
    }
  }

  return (
    <div className="bg-stone-50 min-h-screen pb-20">
      {/* Hero Image */}
      <div className="h-64 sm:h-96 w-full bg-stone-300 relative">
        {temple.images && temple.images.length > 0 ? (
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${temple.images[0].url})` }}>
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=2070)` }}>
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
        )}
        <div className="absolute bottom-0 left-0 w-full p-8 max-w-7xl mx-auto flex flex-col justify-end h-full text-white">
          <div className="flex gap-2 mb-3">
             {temple.templeType && (
               <span className="bg-orange-600 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm">
                 {temple.templeType}
               </span>
             )}
             {temple.isVerified && (
               <span className="bg-green-600 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-1">
                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                 Verified
               </span>
             )}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-white">{temple.name}</h1>
          <p className="text-lg text-stone-200 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            {temple.address || temple.region?.name}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* About */}
          <section className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">About</h2>
            <p className="text-stone-700 leading-relaxed mb-6">
              {temple.description}
            </p>
            {temple.history && (
              <>
                <h3 className="text-lg font-bold text-stone-900 mb-2">History & Significance</h3>
                <p className="text-stone-700 leading-relaxed">
                  {temple.history}
                </p>
              </>
            )}
          </section>
          
          {/* Darshan & Timings */}
          <section className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
            <h2 className="text-2xl font-bold text-stone-900 mb-6">Darshan & Timings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-stone-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Daily Schedule
                </h3>
                {temple.timings && temple.timings.length > 0 ? (
                  <ul className="space-y-3 text-sm text-stone-700">
                    {temple.timings.map((t: any, i: number) => (
                      <li key={i} className="flex justify-between border-b border-stone-100 pb-2">
                        <span className="font-medium">Everyday</span>
                        <span>{t.morningOpen} - {t.eveningClose}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-stone-500">Official timings not available.</p>
                )}
              </div>
              
              <div>
                <h3 className="font-bold text-stone-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
                  Darshan Types
                </h3>
                {temple.darshans && temple.darshans.length > 0 ? (
                  <ul className="space-y-3">
                    {temple.darshans.map((d: any, i: number) => (
                      <li key={i} className="bg-stone-50 p-3 rounded border border-stone-100 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-stone-900 text-sm">{d.name}</p>
                          <p className="text-xs text-stone-500">{d.type}</p>
                        </div>
                        {d.price && (
                          <span className="text-sm font-bold text-green-700">{d.currency} {d.price}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-stone-500">Darshan details not available.</p>
                )}
              </div>
            </div>
          </section>

          {/* Nearby Temples */}
          <NearbyTemples 
            lat={temple.latitude || null} 
            lng={temple.longitude || null} 
            currentTempleId={temple.id} 
          />

          {/* Nearby Amenities (Monetization hooks) */}
          <NearbyServices 
            lat={temple.latitude || null} 
            lng={temple.longitude || null} 
          />
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {temple.latitude && temple.longitude && (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-2 h-64 relative">
              <TempleMap temple={{ lat: temple.latitude, lng: temple.longitude, name: temple.name }} />
              <div className="absolute bottom-4 right-4">
                <button className="bg-white text-blue-600 shadow-md px-4 py-2 rounded-full font-bold text-sm hover:bg-stone-50 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                  Directions
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 sticky top-24">
            <h3 className="font-bold text-stone-900 text-lg mb-4">Plan Your Visit</h3>
            
            <div className="space-y-4 mb-6">
               <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                 Add to Journey
               </button>
               <button className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 border border-stone-200">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                 Save to Wishlist
               </button>
            </div>

            <hr className="border-stone-100 my-6" />

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="bg-orange-50 text-orange-600 p-2 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path></svg>
                </div>
                <div>
                  <p className="font-semibold text-stone-900">Primary Deity</p>
                  <p className="text-stone-600">{temple.primaryDeity?.name || "Unknown"}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-orange-50 text-orange-600 p-2 rounded-lg">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                  <p className="font-semibold text-stone-900">Region</p>
                  <p className="text-stone-600">{temple.region?.name}</p>
                </div>
              </div>

              {temple.festivals && temple.festivals.length > 0 && (
                <div className="flex items-start gap-3 mt-4">
                  <div className="bg-orange-50 text-orange-600 p-2 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">Festivals</p>
                    <ul className="text-stone-600">
                      {temple.festivals.map((f: any) => (
                        <li key={f.festival.id}>
                          <Link href={`/festivals/${f.festival.slug}`} className="hover:text-orange-600 hover:underline">
                            {f.festival.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
