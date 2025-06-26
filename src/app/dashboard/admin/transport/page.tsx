"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "@/i18n"
import Loader from "@/components/common/admin/loading"
import StatCard from "@/components/admin/transport/StatCard"
import ActionCard from "@/components/admin/transport/ActionCard"

export default function PublicTransportAdminDashboard() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)

  // Mock stats (replace with real API data later)
  const stats = {
    staff: 12,
    activeRoutes: 18,
    pendingApprovals: 4,
    bookings: 873,
  }

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <Loader />

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white p-6 rounded-2xl shadow-md text-center">
        <h1 className="text-3xl font-bold mb-2">Public Transport Admin</h1>
        <p className="text-blue-100">
          {t("dashboard.transport.subtitle") || "Assign roles and oversee transport operations across the system."}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Staff" value={stats.staff} color="blue" />
        <StatCard label="Active Routes" value={stats.activeRoutes} color="green" />
        <StatCard label="Pending Approvals" value={stats.pendingApprovals} color="yellow" />
        <StatCard label="Total Bookings" value={stats.bookings} color="purple" />
      </div>

      {/* Admin Actions */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        <ActionCard
          href="/dashboard/admin/transport/staff"
          title="Manage Staff"
          description="Assign managers for routes, drivers, buses, and schedules."
          gradient="bg-gradient-to-br from-pink-500 to-pink-700"
          ariaLabel="Manage Staff"
        />
        <ActionCard
          href="/dashboard/admin/transport/roles"
          title="Staff Role Overview"
          description="View who is responsible for each operational section."
          gradient="bg-gradient-to-br from-indigo-500 to-indigo-700"
          ariaLabel="Staff Role Overview"
        />
        <ActionCard
          href="/dashboard/admin/transport/approvals"
          title="Pending Approvals"
          description="Approve route changes, new staff requests, and schedules."
          gradient="bg-gradient-to-br from-yellow-500 to-yellow-600"
          ariaLabel="Pending Approvals"
        />
        <ActionCard
          href="/dashboard/admin/transport/reports"
          title="Reports"
          description="View performance reports for all transport activities."
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-700"
          ariaLabel="Transport Reports"
        />
        <ActionCard
          href="/dashboard/admin/transport/logs"
          title="Activity Logs"
          description="Track actions performed by staff across the system."
          gradient="bg-gradient-to-br from-gray-600 to-gray-800"
          ariaLabel="Activity Logs"
        />
      </div>
    </div>
  )
}
