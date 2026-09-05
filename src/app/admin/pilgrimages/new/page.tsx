'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPilgrimagePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    difficulty: "MODERATE",
    durationDays: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const slugToUse = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    try {
      const res = await fetch('/api/v1/pilgrimages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, slug: slugToUse, durationDays: parseInt(formData.durationDays.toString()) }),
      });

      if (res.ok) {
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        const error = await res.json();
        alert(`Failed to create pilgrimage: ${error.error}`);
      }
    } catch (err) {
      alert('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Create Official Pilgrimage Route</h1>
        <Link 
          href="/admin/dashboard" 
          className="text-gray-500 hover:text-gray-800 transition-colors"
        >
          Cancel
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Pilgrimage Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                id="name" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="e.g., Char Dham Yatra" 
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea 
                id="description" 
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Details about the journey..." 
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">Difficulty Level</label>
              <select 
                id="difficulty" 
                value={formData.difficulty}
                onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="EASY">Easy (Accessible)</option>
                <option value="MODERATE">Moderate</option>
                <option value="HARD">Hard (Mountain treks)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="durationDays" className="block text-sm font-medium text-gray-700">Duration (Days)</label>
              <input 
                type="number" 
                id="durationDays" 
                min="1"
                value={formData.durationDays}
                onChange={(e) => setFormData({...formData, durationDays: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Pilgrimage Master'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
