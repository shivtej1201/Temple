'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewTemplePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    templeType: "",
    address: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Auto-generate slug if empty
    const slugToUse = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    try {
      const res = await fetch('/api/v1/temples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, slug: slugToUse }),
      });

      if (res.ok) {
        router.push('/admin/temples');
        router.refresh();
      } else {
        const error = await res.json();
        alert(`Failed to create temple: ${error.error}`);
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
        <h1 className="text-3xl font-bold">Add New Temple</h1>
        <Link 
          href="/admin/temples" 
          className="text-gray-500 hover:text-gray-800 transition-colors"
        >
          Cancel
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Temple Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                id="name" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="e.g., Kashi Vishwanath" 
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
                placeholder="Brief description of the temple..." 
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="templeType" className="block text-sm font-medium text-gray-700">Temple Type</label>
              <select 
                id="templeType" 
                value={formData.templeType}
                onChange={(e) => setFormData({...formData, templeType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Type</option>
                <option value="JYOTIRLINGA">Jyotirlinga</option>
                <option value="SHAKTI_PEETHA">Shakti Peetha</option>
                <option value="ASHTAVINAYAK">Ashtavinayak</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address / City</label>
              <input 
                type="text" 
                id="address" 
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Varanasi, Uttar Pradesh" 
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
            <Link 
              href="/admin/temples"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Temple'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
