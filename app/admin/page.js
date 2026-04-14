"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, TrendingUp, Users, Package, ShoppingCart } from "lucide-react";

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/admin/dashboard");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center space-y-4 p-12 bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50"
        >
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-xl font-semibold text-gray-700">Loading Dashboard...</p>
          <div className="space-y-2">
            <div className="h-2 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-pulse w-48" />
            <div className="h-2 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-pulse w-32 delay-200" />
          </div>
        </motion.div>
      </div>
    );
  }

  const stats = [
    { 
      title: "Total Products", 
      value: data?.stats?.totalProducts || 0, 
      color: "from-emerald-500 to-teal-600",
      icon: Package,
      change: "+12%",
      trend: "up"
    },
    { 
      title: "Total Orders", 
      value: data?.stats?.totalOrders || 0, 
      color: "from-blue-500 to-indigo-600",
      icon: ShoppingCart,
      change: "+28%",
      trend: "up"
    },
    { 
      title: "Total Users", 
      value: data?.stats?.totalUsers || 0, 
      color: "from-purple-500 to-pink-600",
      icon: Users,
      change: "+8%",
      trend: "up"
    },
    { 
      title: "Total Revenue", 
      value: `Rs ${data?.stats?.revenue?.toLocaleString() || 0}`, 
      color: "from-amber-500 to-orange-600",
      icon: TrendingUp,
      change: "+45%",
      trend: "up"
    },
  ];

  const chartData = data?.monthlyRevenue || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 p-8 lg:p-12 space-y-10 overflow-hidden">
      
      {/* ✨ SHIMMER BACKGROUND */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-300/30 to-pink-300/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-300/30 to-blue-300/30 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="flex items-center space-x-4 mb-2">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-lg">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-slate-900 bg-clip-text text-transparent tracking-tight">
              Dashboard
            </h1>
            <p className="text-xl text-slate-600 font-medium mt-1">
              Real-time analytics & insights 🚀
            </p>
          </div>
        </div>
      </motion.div>

      {/* 📊 STATS CARDS */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`group relative overflow-hidden rounded-3xl p-8 text-white shadow-2xl bg-gradient-to-br ${stat.color} hover:shadow-3xl transition-all duration-500 border border-white/20 backdrop-blur-xl`}
            >
              {/* GLASS EFFECT */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
              
              {/* ICON */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="absolute -top-4 -right-4 w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-xl flex items-center justify-center shadow-2xl border border-white/30 group-hover:bg-white/30 transition-all duration-300"
              >
                <Icon className="w-8 h-8" />
              </motion.div>

              {/* CONTENT */}
              <div className="relative z-10">
                <p className="text-slate-200 font-medium text-sm uppercase tracking-wider mb-1 opacity-90">
                  {stat.title}
                </p>
                <p className="text-3xl lg:text-4xl font-black mb-2 leading-tight">
                  {stat.value}
                </p>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-bold ${stat.trend === 'up' ? 'text-emerald-200' : 'text-red-200'}`}>
                    {stat.change}
                  </span>
                  <TrendingUp className={`w-4 h-4 ${stat.trend === 'up' ? 'text-emerald-300 animate-bounce' : 'text-red-300 rotate-180'}`} />
                </div>
              </div>

              {/* BOTTOM GLOW */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/20 to-transparent rounded-b-3xl" />
            </motion.div>
          );
        })}
      </motion.div>

      {/* 📈 CHARTS SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* REVENUE CHART */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900">Revenue Growth</h2>
              <p className="text-slate-500 font-medium">Monthly performance</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="4 4" stroke="#f8fafc" vertical={false} />
              <XAxis 
                dataKey="_id" 
                stroke="#64748b" 
                tickLine={false} 
                axisLine={false}
                tick={{ fontSize: 13, fontWeight: 500 }}
              />
              <YAxis 
                stroke="#64748b" 
                tickLine={false} 
                axisLine={false}
                tick={{ fontSize: 13, fontWeight: 500 }}
                width={60}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "rgba(255,255,255,0.95)",
                  borderRadius: "20px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  backdropFilter: "blur(20px)",
                  fontWeight: 600
                }}
              />
              
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="url(#revenueGradient)"
                strokeWidth={5}
                dot={{
                  strokeWidth: 3,
                  r: 6,
                  stroke: "#ffffff",
                  fill: "#10b981",
                  strokeOpacity: 0.8
                }}
                activeDot={{
                  r: 10,
                  strokeWidth: 4,
                  stroke: "#ffffff",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* ORDERS CHART */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900">Orders Trend</h2>
              <p className="text-slate-500 font-medium">Live tracking</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
              <defs>
                <linearGradient id="ordersGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="4 4" stroke="#f8fafc" vertical={false} />
              <XAxis 
                dataKey="_id" 
                stroke="#64748b" 
                tickLine={false} 
                axisLine={false}
                tick={{ fontSize: 13, fontWeight: 500 }}
              />
              <YAxis 
                stroke="#64748b" 
                tickLine={false} 
                axisLine={false}
                tick={{ fontSize: 13, fontWeight: 500 }}
                width={60}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "rgba(255,255,255,0.95)",
                  borderRadius: "20px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  backdropFilter: "blur(20px)",
                  fontWeight: 600
                }}
              />
              
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="url(#ordersGradient)"
                strokeWidth={5}
                dot={{
                  strokeWidth: 3,
                  r: 6,
                  stroke: "#ffffff",
                  fill: "#3b82f6",
                  strokeOpacity: 0.8
                }}
                activeDot={{
                  r: 10,
                  strokeWidth: 4,
                  stroke: "#ffffff",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.div>

      {/* 🆕 RECENT ORDERS */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/80 backdrop-blur-2xl border border-white/50 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 max-h-[400px] overflow-hidden"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-slate-900 flex items-center space-x-3">
            <ShoppingCart className="w-8 h-8 text-indigo-600" />
            <span>Recent Orders</span>
          </h2>
          <span className="text-sm text-slate-500 font-medium">Live</span>
        </div>

        <div className="space-y-4 max-h-[300px] overflow-y-auto">
          <AnimatePresence>
            {data?.recentOrders?.map((order, i) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ delay: i * 0.1 }}
                className="group flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50/50 hover:from-emerald-50 hover:to-blue-50/70 border border-slate-100 hover:border-emerald-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-slate-900 group-hover:text-emerald-700">
                      {order.user?.name || "Anonymous User"}
                    </p>
                    <p className="text-sm text-slate-500 capitalize">
                      {order.status || "processing"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-emerald-600">
                    Rs {order.total?.toLocaleString() || 0}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">+ Order #{order._id?.slice(-6)}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}