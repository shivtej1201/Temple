import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";

export default async function FestivalDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  let festival;
  try {
    festival = await prisma.festival.findUnique({
      where: { slug: slug },
      include: {
        deity: true,
        occurrences: {
          orderBy: { startDate: 'asc' },
          where: { startDate: { gte: new Date(new Date().getFullYear(), 0, 1) } },
          take: 3
        },
        temples: {
          include: { temple: { include: { region: true } } },
          orderBy: { importance: 'desc' },
          take: 10
        }
      }
    });
  } catch (err) {
    console.error(err);
  }

  if (!festival) {
    if (slug === "mahashivratri") {
       // Mock for dev
       festival = {
         name: "Mahashivratri",
         description: "A major festival celebrated annually in honour of the god Shiva. It marks a remembrance of overcoming darkness and ignorance in life and the world.",
         isMajor: true,
         deity: { name: "Shiva" },
         occurrences: [
           { year: 2026, startDate: new Date("2026-02-15"), tithi: "Krishna Paksha Chaturdashi" },
           { year: 2027, startDate: new Date("2027-03-06"), tithi: "Krishna Paksha Chaturdashi" }
         ],
         temples: [
           { temple: { name: "Kashi Vishwanath", slug: "kashi-vishwanath", region: { name: "Uttar Pradesh" } }, importance: 10 },
           { temple: { name: "Trimbakeshwar", slug: "trimbakeshwar", region: { name: "Maharashtra" } }, importance: 9 }
         ]
       }
    } else {
      notFound();
    }
  }

  return (
    <div className="bg-stone-50 min-h-screen pb-20">
      <div className="bg-orange-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {festival.isMajor && (
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
              Major National Festival
            </span>
          )}
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{festival.name}</h1>
          <p className="text-lg text-orange-100 max-w-3xl">
            {festival.description}
          </p>
          <div className="mt-6 flex items-center gap-2 text-orange-100 font-medium">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path></svg>
             Primary Deity: {festival.deity?.name || 'Various'}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
              <h2 className="text-2xl font-bold text-stone-900 mb-6">Prominent Temples for this Festival</h2>
              
              <div className="space-y-4">
                {festival.temples && festival.temples.length > 0 ? (
                  festival.temples.map((mapping: any, i: number) => (
                    <Link href={`/temples/${mapping.temple.slug}`} key={i} className="block group bg-stone-50 rounded-xl p-4 border border-stone-100 hover:border-orange-300 transition-colors">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-stone-900 group-hover:text-orange-600 transition-colors">{mapping.temple.name}</h3>
                          <p className="text-sm text-stone-500">{mapping.temple.region?.name}</p>
                        </div>
                        <div className="text-orange-600">
                          &rarr;
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-stone-500 text-sm">No specific prominent temples mapped yet.</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 sticky top-24">
              <h3 className="font-bold text-stone-900 text-lg mb-4 flex items-center gap-2">
                 <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                 Upcoming Dates
              </h3>
              
              <div className="space-y-4">
                {festival.occurrences && festival.occurrences.length > 0 ? (
                  festival.occurrences.map((occ: any, i: number) => (
                    <div key={i} className="border-b border-stone-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-end gap-2 mb-1">
                        <span className="text-2xl font-black text-stone-900 leading-none">
                          {occ.startDate.getDate()}
                        </span>
                        <span className="text-sm font-bold text-stone-500 uppercase">
                          {occ.startDate.toLocaleString('default', { month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 font-medium">{occ.tithi}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-stone-500">Dates pending panchang calculation.</p>
                )}
              </div>
              
              <button className="w-full mt-6 bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium py-2 rounded-lg transition-colors text-sm border border-stone-200">
                Notify me before next date
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
