import Link from "next/link";
import { prisma } from "@/lib/db/prisma";

export default async function HomePage() {
  // We'll fetch data here once the DB is populated.
  // For now, we'll use placeholder content to demonstrate the layout.
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-stone-900 text-white overflow-hidden py-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1598155523122-3842334d6c1f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/60 to-transparent"></div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Discover the Spiritual Heritage of India
          </h1>
          <p className="text-lg sm:text-xl text-stone-200 mb-10 max-w-2xl mx-auto">
            Explore thousands of temples, track regional festivals, and plan your perfect pilgrimage journey.
          </p>
          
          {/* Hero Search */}
          <div className="bg-white p-2 rounded-full flex max-w-2xl mx-auto shadow-xl">
            <input 
              type="text" 
              className="flex-1 bg-transparent px-6 py-3 text-stone-900 focus:outline-none" 
              placeholder="Search for temples, deities, or regions..."
            />
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full font-medium transition-colors">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Featured Temples Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-stone-900">Featured Temples</h2>
            <p className="text-stone-600 mt-2">Discover the most significant spiritual destinations.</p>
          </div>
          <Link href="/temples" className="text-orange-600 font-medium hover:text-orange-700 hidden sm:block">
            View all temples &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Placeholder Cards */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="group bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-stone-200 overflow-hidden">
                 <div className="w-full h-full bg-stone-300 group-hover:scale-105 transition-transform duration-500"></div>
              </div>
              <div className="p-5">
                <div className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-2">Jyotirlinga</div>
                <h3 className="text-lg font-bold text-stone-900 mb-1">Temple Name {i}</h3>
                <p className="text-stone-600 text-sm mb-4">Location, State</p>
                <Link href={`/temples/sample-${i}`} className="text-sm font-medium text-stone-900 group-hover:text-orange-600 transition-colors">
                  Explore &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Festivals Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-orange-50 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-stone-900">Upcoming Festivals</h2>
              <p className="text-stone-600 mt-2">Plan your visits around major celebrations.</p>
            </div>
            <Link href="/festivals" className="text-orange-600 font-medium hover:text-orange-700 hidden sm:block">
              View calendar &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Placeholder Events */}
             {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 flex gap-4">
                <div className="flex flex-col items-center justify-center bg-orange-100 rounded-lg min-w-[80px] h-[80px]">
                  <span className="text-sm font-bold text-orange-800 uppercase">Oct</span>
                  <span className="text-2xl font-black text-orange-900">12</span>
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-lg">Festival Name {i}</h3>
                  <p className="text-sm text-stone-600 mt-1 line-clamp-2">A major celebration happening across the country with special events at these key temples.</p>
                  <Link href={`/festivals/sample-${i}`} className="text-sm text-orange-600 font-medium mt-2 inline-block">
                    Recommended Temples
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journeys/Pilgrimages Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-900">Sacred Journeys</h2>
          <p className="text-stone-600 mt-4">
            Follow ancient routes and complete official pilgrimages step by step with our route planner.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden flex flex-col sm:flex-row h-full">
            <div className="w-full sm:w-2/5 bg-stone-300 min-h-[200px]"></div>
            <div className="p-6 sm:w-3/5 flex flex-col justify-center">
              <span className="inline-block px-3 py-1 bg-stone-100 text-stone-800 text-xs font-semibold rounded-full mb-3 w-max">8 Temples • 3 Days</span>
              <h3 className="text-xl font-bold text-stone-900 mb-2">Ashtavinayak Yatra</h3>
              <p className="text-stone-600 text-sm mb-4">The sacred pilgrimage of eight Ganesha temples in Maharashtra.</p>
              <Link href="/pilgrimages/ashtavinayak" className="text-sm font-medium text-orange-600">
                Plan this journey &rarr;
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden flex flex-col sm:flex-row h-full">
            <div className="w-full sm:w-2/5 bg-stone-300 min-h-[200px]"></div>
            <div className="p-6 sm:w-3/5 flex flex-col justify-center">
              <span className="inline-block px-3 py-1 bg-stone-100 text-stone-800 text-xs font-semibold rounded-full mb-3 w-max">12 Temples • 14 Days</span>
              <h3 className="text-xl font-bold text-stone-900 mb-2">Jyotirlinga Darshan</h3>
              <p className="text-stone-600 text-sm mb-4">A journey to the twelve most sacred shrines of Lord Shiva across India.</p>
              <Link href="/pilgrimages/jyotirlinga" className="text-sm font-medium text-orange-600">
                Plan this journey &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
