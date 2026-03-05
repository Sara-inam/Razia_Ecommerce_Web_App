"use client";
import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 pt-16 md:pt-6 p-6">
        {children}
      </main>
    </div>
  );
}