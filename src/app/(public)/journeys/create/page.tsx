"use client";

export default function CreateJourneyPage() {
  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-stone-900 mb-2">Complete My Yatra</h1>
        <p className="text-lg text-stone-600 mb-8">Select temples and we will calculate the optimal route for your pilgrimage.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
              <h2 className="font-bold text-lg mb-4">Your Stops</h2>
              <div className="space-y-3">
                <div className="p-3 border border-stone-200 rounded-xl bg-stone-50 text-stone-500 text-sm text-center border-dashed">
                  Search and add temples to start planning...
                </div>
              </div>
              <button disabled className="mt-6 w-full bg-orange-600/50 cursor-not-allowed text-white font-bold py-3 rounded-xl">
                Optimize Route
              </button>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="bg-stone-200 rounded-2xl h-[600px] flex items-center justify-center border border-stone-300">
              {/* Map placeholder */}
              <p className="text-stone-500 font-medium">Interactive Map (Add stops to visualize)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
