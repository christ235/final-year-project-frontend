"use client"

import { useTranslation } from "@/i18n"
import Link from "next/link"

const roles = [
  { name: "Dispatcher", description: "Manage schedules and drivers" },
  { name: "Driver", description: "View assigned trips and routes" },
  { name: "Agency Manager", description: "Supervise agency operations" },
  { name: "Maintenance Staff", description: "Handle maintenance and reporting" },
  { name: "Support Staff", description: "Assist users and manage bookings" },
]

export default function RoleListPage() {
  const { t } = useTranslation()

  return (
    <div className="p-6 space-y-8">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-2xl shadow-md text-center">
        <h1 className="text-3xl font-bold mb-2">Staff Roles</h1>
        <p className="text-indigo-100">
          {t("admin.transport.roles.subtitle") || "Assign staff by role to manage transport operations effectively."}
        </p>
      </div>

      {/* Role Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <Link
            key={role.name}
            href={`/dashboard/admin/transport/roles/${role.name.toLowerCase().replace(" ", "-")}`}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow hover:shadow-lg hover:border-indigo-500 transition"
          >
            <h3 className="text-xl font-semibold text-indigo-700 mb-2">{role.name}</h3>
            <p className="text-gray-600 text-sm">{role.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
