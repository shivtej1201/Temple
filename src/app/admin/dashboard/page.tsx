export default function AdminDashboardPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Temple Platform Admin</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Temples</h2>
          <p className="text-3xl font-semibold mt-2">12,438</p>
          <p className="text-sm text-green-600 mt-2">2,340 Verified</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Upcoming Festivals</h2>
          <p className="text-3xl font-semibold mt-2">87</p>
          <p className="text-sm text-gray-600 mt-2">Next 30 days</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Active Users</h2>
          <p className="text-3xl font-semibold mt-2">12,430</p>
          <p className="text-sm text-green-600 mt-2">MAU</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Pending Content</h2>
          <p className="text-3xl font-semibold mt-2 text-amber-600">32</p>
          <p className="text-sm text-gray-600 mt-2">Requires verification</p>
        </div>
      </div>
    </>
  );
}
