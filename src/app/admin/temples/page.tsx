import Link from "next/link";
import { prisma } from "@/lib/db/prisma";

export default async function AdminTemplesPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const params = await searchParams;
  const tab = params.tab || 'all';
  
  let temples: any[] = [];
  let dbError = false;

  try {
    temples = await prisma.temple.findMany({
      where: tab === 'pending' ? { isVerified: false } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  } catch (error) {
    dbError = true;
    console.error("Database connection failed:", error);
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Temples</h1>
        <Link 
          href="/admin/temples/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          + Add Temple
        </Link>
      </div>

      <div className="flex gap-4 border-b border-stone-200 mb-6">
        <Link 
          href="/admin/temples?tab=all" 
          className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${tab === 'all' ? 'border-blue-600 text-blue-600' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
        >
          All Temples
        </Link>
        <Link 
          href="/admin/temples?tab=pending" 
          className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${tab === 'pending' ? 'border-blue-600 text-blue-600' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
        >
          Verification Queue
        </Link>
      </div>

      {dbError && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6 border border-red-200">
          <h3 className="font-semibold">Database Connection Error</h3>
          <p className="text-sm mt-1">
            Could not connect to the database.
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm uppercase tracking-wider">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Location</th>
              <th className="p-4 font-medium">Type</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {temples.length === 0 && !dbError ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No temples found matching your criteria.
                </td>
              </tr>
            ) : (
              temples.map((temple) => (
                <tr key={temple.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <p className="font-medium text-gray-900">{temple.name}</p>
                    <p className="text-sm text-gray-500">/{temple.slug}</p>
                  </td>
                  <td className="p-4 text-gray-600">
                    {temple.address || "No address"}
                  </td>
                  <td className="p-4 text-gray-600">
                    {temple.templeType || "N/A"}
                  </td>
                  <td className="p-4">
                    {temple.isVerified ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/temples/${temple.id}/edit`} className="text-blue-600 hover:text-blue-900 font-medium text-sm mr-4">
                      Edit
                    </Link>
                    <Link href={`/admin/temples/${temple.id}/verify`} className="text-green-600 hover:text-green-900 font-medium text-sm">
                      {temple.isVerified ? 'Review' : 'Verify'}
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
