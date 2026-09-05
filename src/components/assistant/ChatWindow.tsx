"use client";

import { useState } from "react";

export function ChatWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: 'Namaste! I am your Yatra Assistant. How can I help you plan your temple visit today?' }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const newMessages = [...messages, { role: 'user' as const, content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch('/api/v1/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await res.json();
      
      if (data.success) {
        setMessages([...newMessages, { role: 'assistant', content: data.response }]);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: "Sorry, I am having trouble connecting to my database." }]);
      }
    } catch (e) {
      setMessages([...newMessages, { role: 'assistant', content: "An error occurred." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-orange-600 hover:bg-orange-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 z-50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-stone-200 overflow-hidden">
          <div className="bg-orange-600 p-4 text-white flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              Yatra Assistant
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl text-sm ${m.role === 'user' ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-white border border-stone-200 text-stone-800 rounded-tl-none shadow-sm'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-stone-200 p-3 rounded-xl rounded-tl-none flex gap-1">
                  <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-white border-t border-stone-100 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about temples..."
              className="flex-1 bg-stone-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
            />
            <button 
              onClick={sendMessage}
              className="bg-orange-600 text-white p-2 rounded-full hover:bg-orange-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
