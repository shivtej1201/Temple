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
              <div className="mb-4">
                <label className="text-sm font-medium text-stone-700 block mb-1">Search Along Route</label>
                <input type="text" placeholder="From (e.g. Pune)" className="w-full text-sm bg-stone-50 border border-stone-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 mb-2" />
                <input type="text" placeholder="To (e.g. Nashik)" className="w-full text-sm bg-stone-50 border border-stone-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 mb-2" />
                <button className="w-full bg-stone-100 text-stone-800 text-sm font-medium py-2 rounded-md hover:bg-stone-200 transition-colors">
                  Find Temples on Route
                </button>
              </div>
              <hr className="my-4 border-stone-100" />
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
