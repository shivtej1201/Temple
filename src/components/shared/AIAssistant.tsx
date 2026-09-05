'use client';
import { useState } from 'react';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-stone-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-stone-800 transition-colors z-50"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-50 flex flex-col h-[500px] max-h-[80vh]">
          <div className="bg-stone-900 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span className="font-bold">Temple AI Guide</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto bg-stone-50 flex flex-col gap-4">
             <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm border border-stone-100 max-w-[85%] text-sm text-stone-700">
               Namaste! I am your AI temple guide. I have context on 12,000+ temples, upcoming festivals, and pilgrimage routes. 
               <br/><br/>
               How can I help you plan your journey today?
             </div>
          </div>
          
          <div className="p-3 border-t border-stone-200 bg-white">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ask about a temple or route..." 
                className="w-full bg-stone-100 border-none rounded-full py-2.5 pl-4 pr-10 text-sm focus:ring-2 focus:ring-orange-500"
              />
              <button className="absolute right-2 top-1.5 w-7 h-7 bg-orange-600 rounded-full flex items-center justify-center text-white hover:bg-orange-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
