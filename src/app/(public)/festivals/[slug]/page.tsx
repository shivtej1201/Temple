import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";

export default async function FestivalDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const festival = await prisma.festival.findUnique({
    where: { slug },
    include: {
      deity: true,
      temples: {
        include: {
          temple: {
            include: {
              city: true,
              state: true
            }
          }
        },
        orderBy: {
          importance: 'asc'
        }
      }
    }
  });

  if (!festival) {
    notFound();
  }

  return (
    <div className="bg-stone-50 min-h-screen pb-20">
      {/* Hero */}
      <div className="bg-stone-900 text-white py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
            {festival.festivalType || 'FESTIVAL'}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">{festival.name}</h1>
          <p className="text-lg text-stone-300 max-w-2xl mx-auto">
            {festival.description}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-stone-900 mb-6 border-b border-stone-100 pb-4">
            About the Festival
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-stone-700">
             <div>
                <p className="mb-2"><strong>Deity:</strong> {festival.deity?.name || 'Various'}</p>
                <p><strong>Duration:</strong> {festival.defaultDurationDays} Day(s)</p>
             </div>
             <div>
                <p className="mb-2"><strong>Significance:</strong> {festival.significance || 'Cultural and Spiritual celebration.'}</p>
             </div>
          </div>
        </div>

        <div>
           <h2 className="text-2xl font-bold text-stone-900 mb-6">Major Celebrations at Temples</h2>
           {festival.temples.length === 0 ? (
             <div className="text-center py-12 bg-white rounded-xl border border-stone-200 border-dashed">
                <p className="text-stone-500 text-lg">No specific temples are currently linked to this festival.</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {festival.temples.map((ft) => (
                  <Link href={`/temples/${ft.temple.slug}`} key={ft.templeId} className="group">
                    <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 hover:border-orange-300 transition-colors h-full flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                         <h3 className="text-xl font-bold text-stone-900 group-hover:text-orange-600 transition-colors">{ft.temple.name}</h3>
                         {ft.importance === 1 && (
                           <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded">Primary</span>
                         )}
                      </div>
                      <p className="text-sm text-stone-500 mb-4 flex-1">
                        {ft.temple.city?.name || ft.temple.state?.name ? `${ft.temple.city?.name || ''}, ${ft.temple.state?.name || ''}` : 'Location unknown'}
                      </p>
                      
                      {ft.description && (
                        <div className="bg-stone-50 p-3 rounded-md text-sm text-stone-700 mb-4 border border-stone-100">
                          {ft.description}
                        </div>
                      )}
                      
                      <div className="mt-auto text-orange-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                        View Temple Details <span aria-hidden="true">&rarr;</span>
                      </div>
                    </div>
                  </Link>
                ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
