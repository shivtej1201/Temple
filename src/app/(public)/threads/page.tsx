'use client';

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ThreadsPage() {
  const [threads, setThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All Discussions");
  const [sort, setSort] = useState("latest");

  useEffect(() => {
    const fetchThreads = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set("search", searchQuery);
        if (category) params.set("category", category);
        if (sort) params.set("sort", sort);

        const res = await fetch(`/api/v1/discussions?${params.toString()}`);
        const json = await res.json();
        if (json.success) {
          setThreads(json.data);
        } else {
          setThreads([]);
        }
      } catch (error) {
        console.error("Failed to fetch threads", error);
        setThreads([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchThreads();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery, category, sort]);

  const categories = [
    "All Discussions",
    "Temple Guidance",
    "Festival Preparation",
    "Travel & Routes",
    "Rituals & History"
  ];

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
              {categories.map((c) => (
                <li key={c}>
                  <button 
                    onClick={() => setCategory(c)}
                    className={`hover:text-orange-600 transition-colors ${category === c ? 'font-semibold text-orange-600' : ''}`}
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-stone-900 mb-3">Sort By</h3>
            <select 
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="latest">Latest</option>
              <option value="trending">Trending</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Threads List */}
        <div className="flex-1 space-y-4">
          {loading && (
             <div className="py-8 text-center text-stone-500">
                <svg className="w-6 h-6 animate-spin text-orange-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
             </div>
          )}
          
          {!loading && threads.length === 0 && (
            <p className="text-stone-500 py-8 text-center bg-stone-50 rounded-xl border border-stone-200 border-dashed">No discussions found matching your criteria.</p>
          )}

          {!loading && threads.map((thread) => (
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
                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold overflow-hidden">
                      {thread.user?.avatarUrl ? (
                         <img src={thread.user.avatarUrl} alt={thread.user.name} className="w-full h-full object-cover" />
                      ) : (
                         thread.user?.name?.[0] || 'U'
                      )}
                    </div>
                    <span className="font-medium text-stone-700">{thread.user?.name || 'Anonymous'}</span>
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
