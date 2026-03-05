"use client";

export default function DashboardPage() {
  // Example stats
  const stats = [
    { title: "Total Products", value: 24, color: "green" },
    { title: "Total Orders", value: 10, color: "blue" },
    { title: "Total Users", value: 15, color: "yellow" },
    { title: "Revenue", value: "Rs 120,000", color: "purple" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-green-700 mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const colors = {
            green: "bg-green-100 text-green-700",
            blue: "bg-blue-100 text-blue-700",
            yellow: "bg-yellow-100 text-yellow-700",
            purple: "bg-purple-100 text-purple-700",
          };

          return (
            <div
              key={idx}
              className={`p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ${colors[stat.color]} flex flex-col justify-between`}
            >
              <h2 className="text-lg font-semibold">{stat.title}</h2>
              <p className="mt-4 text-3xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Recent Activity
        </h2>
        <div className="bg-white rounded-xl shadow p-4">
          <ul className="divide-y divide-gray-200">
            <li className="py-3 flex justify-between items-center">
              <span>New order placed by John Doe</span>
              <span className="text-sm text-gray-500">2 hrs ago</span>
            </li>
            <li className="py-3 flex justify-between items-center">
              <span>New user registered: Sara Inam</span>
              <span className="text-sm text-gray-500">5 hrs ago</span>
            </li>
            <li className="py-3 flex justify-between items-center">
              <span>Product "Leather Bag" stock updated</span>
              <span className="text-sm text-gray-500">1 day ago</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Charts / Extra Sections (Optional) */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
          <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
            [Chart Placeholder]
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
          <ul className="divide-y divide-gray-200">
            <li className="py-2 flex justify-between">
              <span>Leather Bag</span>
              <span>Rs 2,500</span>
            </li>
            <li className="py-2 flex justify-between">
              <span>Canvas Bag</span>
              <span>Rs 1,800</span>
            </li>
            <li className="py-2 flex justify-between">
              <span>Handbag Classic</span>
              <span>Rs 3,200</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}