export default function ModerationDashboardPage() {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Community Moderation</h1>
          <p className="text-gray-600 mt-1">Review reported threads, comments, and reviews.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200 flex items-center justify-between">
          <div>
            <h2 className="text-red-800 text-sm font-medium uppercase tracking-wide">Pending Reports</h2>
            <p className="text-3xl font-bold text-red-900 mt-1">12</p>
          </div>
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex gap-4">
          <button className="text-sm font-semibold text-blue-600 border-b-2 border-blue-600 pb-2">Reported Threads (5)</button>
          <button className="text-sm font-medium text-gray-500 pb-2">Reported Comments (7)</button>
          <button className="text-sm font-medium text-gray-500 pb-2">Spam Reviews (0)</button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-gray-200 text-gray-500 text-sm uppercase tracking-wider">
              <th className="p-4 font-medium w-1/2">Content Snippet</th>
              <th className="p-4 font-medium">Report Reason</th>
              <th className="p-4 font-medium">Author</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
             {/* Mock Row */}
             <tr className="hover:bg-gray-50">
                <td className="p-4">
                  <p className="font-semibold text-gray-900 mb-1">Click here for cheap VIP darshan tickets...</p>
                  <p className="text-xs text-gray-500 line-clamp-1">If you want to skip the line I have an agent who can arrange everything just click this link...</p>
                </td>
                <td className="p-4 text-sm text-red-600 font-medium">
                  Spam / Scam
                </td>
                <td className="p-4 text-sm text-gray-600">
                  user_90321
                </td>
                <td className="p-4 text-right space-x-2">
                  <button className="text-xs font-medium bg-red-100 text-red-700 px-3 py-1.5 rounded hover:bg-red-200 transition-colors">Delete & Ban</button>
                  <button className="text-xs font-medium bg-gray-100 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-200 transition-colors">Ignore</button>
                </td>
             </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
