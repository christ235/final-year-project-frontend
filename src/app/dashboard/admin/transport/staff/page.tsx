"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "@/i18n"
import Loader from "@/components/common/admin/loading"
import Link from "next/link"

type Staff = {
  id: number
  name: string
  role: string
  agency: string
  status: "Active" | "Suspended"
}

const mockStaff: Staff[] = [
  { id: 1, name: "Adam Mbaiguinam", role: "Dispatcher", agency: "N'Djamena", status: "Active" },
  { id: 2, name: "Fatime Barka", role: "Driver", agency: "Moundou", status: "Active" },
  { id: 3, name: "Ibrahim Zakaria", role: "Agency Manager", agency: "Sarh", status: "Suspended" },
]

export default function TransportStaffPage() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [staffList, setStaffList] = useState<Staff[]>(mockStaff)
  const [filter, setFilter] = useState<string>("All")
  const [search, setSearch] = useState<string>("")

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const filteredStaff = staffList.filter((staff) => {
    const matchRole = filter === "All" || staff.role === filter
    const matchSearch = staff.name.toLowerCase().includes(search.toLowerCase())
    return matchRole && matchSearch
  })

  if (loading) return <Loader />

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Manage Staff</h1>
        <Link
          href="/dashboard/admin/transport/staff/assign"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Assign Staff
        </Link>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3 flex-wrap">
        {["All", "Dispatcher", "Agency Manager", "Driver", "Maintenance Staff", "Support Staff"].map(role => (
          <button
            key={role}
            onClick={() => setFilter(role)}
            className={`px-4 py-2 rounded-full border ${
              filter === role ? "bg-blue-600 text-white" : "text-gray-700 border-gray-300"
            } transition`}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div>
        <input
          type="text"
          placeholder="Search staff by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Staff Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left bg-white shadow rounded-xl">
          <thead className="bg-gray-100 text-sm font-medium text-gray-700">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Role</th>
              <th className="p-4">Agency</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map((staff) => (
              <tr key={staff.id} className="border-t">
                <td className="p-4 font-semibold">{staff.name}</td>
                <td className="p-4">{staff.role}</td>
                <td className="p-4">{staff.agency}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      staff.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {staff.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <Link
                    href={`/dashboard/admin/transport/staff/${staff.id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    className="text-red-600 hover:underline text-sm"
                    onClick={() => alert(`Suspend ${staff.name}`)}
                  >
                    Suspend
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredStaff.length === 0 && (
          <p className="text-center py-6 text-gray-500">No staff found for your search.</p>
        )}
      </div>
    </div>
  )
}
