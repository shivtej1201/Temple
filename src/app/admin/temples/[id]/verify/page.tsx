'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VerifyTemplePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [temple, setTemple] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTemple = async () => {
      try {
        const res = await fetch(`/api/v1/temples/${id}`);
        const json = await res.json();
        if (json.success) {
          setTemple(json.data);
        } else {
          setError(json.error || 'Failed to fetch temple');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };
    fetchTemple();
  }, [id]);

  const handleVerify = async (isVerified: boolean) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/v1/admin/temples/${id}/verify`, {
        method: isVerified ? 'POST' : 'DELETE'
      });
      const json = await res.json();
      if (json.success) {
        router.push('/admin/temples');
        router.refresh();
      } else {
        alert("Failed to update status");
      }
    } catch (e) {
      alert("Network error");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-stone-500 animate-pulse">Loading temple data...</div>;
  if (error || !temple) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-8 text-sm text-stone-500">
        <Link href="/admin/temples" className="hover:text-stone-900">&larr; Back to Temples</Link>
        <span>/</span>
        <span className="text-stone-900 font-medium">Verify Data</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden mb-8">
        <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex justify-between items-center">
          <h1 className="text-xl font-bold text-stone-900">Verification Review: {temple.name}</h1>
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${temple.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {temple.isVerified ? 'VERIFIED' : 'PENDING'}
          </span>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-stone-500 mb-1">Name</div>
                <div className="font-medium">{temple.name}</div>
              </div>
              <div>
                <div className="text-xs text-stone-500 mb-1">Description</div>
                <div className="text-sm text-stone-700">{temple.description || 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs text-stone-500 mb-1">Temple Type</div>
                <div className="text-sm">{temple.templeType || 'N/A'}</div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-4">Location & Geography</h3>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-stone-500 mb-1">Address</div>
                <div className="text-sm">{temple.address || 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs text-stone-500 mb-1">Coordinates</div>
                <div className="text-sm font-mono bg-stone-100 inline-block px-2 py-1 rounded">
                  {temple.latitude}, {temple.longitude}
                </div>
              </div>
              <div>
                <div className="text-xs text-stone-500 mb-1">City / State</div>
                <div className="text-sm">
                  {temple.city?.name || 'N/A'}, {temple.state?.name || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-stone-50 p-6 border-t border-stone-200 flex justify-end gap-4">
          <button 
            disabled={actionLoading}
            onClick={() => handleVerify(false)}
            className="px-6 py-2 border border-red-200 text-red-600 font-medium rounded-md hover:bg-red-50 disabled:opacity-50"
          >
            Reject / Unverify
          </button>
          <button 
            disabled={actionLoading || temple.isVerified}
            onClick={() => handleVerify(true)}
            className="px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {temple.isVerified ? 'Already Verified' : 'Approve & Verify'}
          </button>
        </div>
      </div>
    </div>
  );
}
