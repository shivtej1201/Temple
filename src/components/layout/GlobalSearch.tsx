'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults(null);
      setIsOpen(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/search?q=${encodeURIComponent(query)}`);
        const json = await res.json();
        if (json.success) {
          setResults(json.data);
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

  const hasResults = results && (
    results.temples.length > 0 || 
    results.festivals.length > 0 || 
    results.pilgrimages.length > 0 || 
    results.regions.length > 0
  );

  return (
    <div className="hidden md:block relative z-50" ref={wrapperRef}>
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
           if (query.length >= 2) setIsOpen(true);
        }}
        placeholder="Search temples, regions..." 
        className="pl-4 pr-10 py-2 border border-stone-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-64"
      />
      {loading && (
         <div className="absolute right-3 top-2.5">
           <svg className="w-4 h-4 animate-spin text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
           </svg>
         </div>
      )}

      {isOpen && results && (
        <div className="absolute top-12 left-0 w-80 bg-white border border-stone-200 shadow-xl rounded-xl overflow-hidden max-h-96 overflow-y-auto">
          {!hasResults ? (
            <div className="p-4 text-sm text-stone-500 text-center">No results found for "{query}"</div>
          ) : (
            <div className="py-2">
              {results.temples.length > 0 && (
                <div className="mb-2">
                  <div className="px-4 py-1 text-xs font-bold text-stone-400 uppercase tracking-wider bg-stone-50">Temples</div>
                  {results.temples.map((t: any) => (
                    <Link href={`/temples/${t.slug}`} key={t.id} onClick={() => setIsOpen(false)} className="block px-4 py-2 hover:bg-orange-50 text-sm">
                      <div className="font-semibold text-stone-900">{t.name}</div>
                      <div className="text-xs text-stone-500">{t.city?.name || t.primaryDeity?.name}</div>
                    </Link>
                  ))}
                </div>
              )}
              {results.festivals.length > 0 && (
                <div className="mb-2">
                  <div className="px-4 py-1 text-xs font-bold text-stone-400 uppercase tracking-wider bg-stone-50">Festivals</div>
                  {results.festivals.map((f: any) => (
                    <Link href={`/festivals/${f.slug}`} key={f.id} onClick={() => setIsOpen(false)} className="block px-4 py-2 hover:bg-orange-50 text-sm">
                      <div className="font-semibold text-stone-900">{f.name}</div>
                    </Link>
                  ))}
                </div>
              )}
              {results.pilgrimages.length > 0 && (
                <div className="mb-2">
                  <div className="px-4 py-1 text-xs font-bold text-stone-400 uppercase tracking-wider bg-stone-50">Pilgrimages</div>
                  {results.pilgrimages.map((p: any) => (
                    <Link href={`/pilgrimages/${p.slug}`} key={p.id} onClick={() => setIsOpen(false)} className="block px-4 py-2 hover:bg-orange-50 text-sm">
                      <div className="font-semibold text-stone-900">{p.name}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
