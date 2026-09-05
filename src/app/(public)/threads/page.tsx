import Link from "next/link";
import { prisma } from "@/lib/db/prisma";

export const revalidate = 0;

export default async function ThreadsPage() {
  const threads = await prisma.thread.findMany({
    where: { status: "PUBLISHED" },
    include: { user: true },
    orderBy: { createdAt: 'desc' },
    take: 20
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Community Discussions</h1>
          <p className="text-stone-600 mt-2">Connect with other devotees, ask questions, and share experiences.</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search discussions..." 
              className="pl-4 pr-10 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-64"
            />
          </div>
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md font-medium transition-colors text-sm">
            New Topic
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
          <div>
            <h3 className="font-bold text-stone-900 mb-3">Categories</h3>
            <ul className="space-y-2 text-sm text-stone-600">
              <li><Link href="#" className="font-semibold text-orange-600">All Discussions</Link></li>
              <li><Link href="#" className="hover:text-orange-600">Temple Guidance</Link></li>
              <li><Link href="#" className="hover:text-orange-600">Festival Preparation</Link></li>
              <li><Link href="#" className="hover:text-orange-600">Travel & Routes</Link></li>
              <li><Link href="#" className="hover:text-orange-600">Rituals & History</Link></li>
            </ul>
          </div>
        </div>

        {/* Threads List */}
        <div className="flex-1 space-y-4">
          {threads.length === 0 && (
            <p className="text-stone-500">No discussions found.</p>
          )}
          {threads.map((thread) => (
            <div key={thread.id} className="bg-white rounded-xl shadow-sm border border-stone-200 p-5 hover:border-orange-300 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <Link href={`/threads/${thread.id}`} className="text-lg font-bold text-stone-900 hover:text-orange-600">
                  {thread.title}
                </Link>
                <span className="text-xs text-stone-400 whitespace-nowrap ml-4">
                  {new Date(thread.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-stone-600 mb-4 line-clamp-2">
                {thread.content}
              </p>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold">
                      {thread.user.name?.[0] || 'U'}
                    </div>
                    <span className="font-medium text-stone-700">{thread.user.name || 'Anonymous'}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-stone-500 font-medium">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                    {thread.replyCount}
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    {thread.viewCount}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
