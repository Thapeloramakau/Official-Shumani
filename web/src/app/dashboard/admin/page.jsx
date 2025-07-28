"use client";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, Admin</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <button
          onClick={() => router.push("/dashboard/admin/users")}
          className="bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700"
        >
          Manage Users
        </button>

        <button
          onClick={() => router.push("/dashboard/admin/upload")}
          className="bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700"
        >
          Upload Content
        </button>

        <button
          onClick={() => router.push("/dashboard/admin/all")}
          className="bg-purple-600 text-white px-6 py-4 rounded-lg hover:bg-purple-700"
        >
          View Users
        </button>
      </div>
    </div>
  );
}
