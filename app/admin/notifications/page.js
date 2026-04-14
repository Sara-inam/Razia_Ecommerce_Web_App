import { Suspense } from "react";
import AdminNotifications from "@/components/admin/AdminNotifications";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminNotifications />
    </Suspense>
  );
}