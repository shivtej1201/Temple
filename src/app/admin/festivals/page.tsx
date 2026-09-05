import Link from "next/link";
import { prisma } from "@/lib/db/prisma";

export default async function AdminFestivalsPage() {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Festivals Master Data</h1>
          <p className="text-gray-600 mt-1">Manage global festival definitions. Occurrences are managed separately.</p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/admin/events" 
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
          >
            Manage Occurrences
          </Link>
          <Link 
            href="/admin/festivals/new" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            + Add Festival
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm uppercase tracking-wider">
              <th className="p-4 font-medium">Festival Name</th>
              <th className="p-4 font-medium">Deity</th>
              <th className="p-4 font-medium">Scope</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td colSpan={4} className="p-8 text-center text-gray-500">
                Database not connected yet. Once connected, festivals will appear here.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
