"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useTranslation } from "@/i18n"
import Link from "next/link"
import Loader from "@/components/common/admin/loading"

type Staff = {
  id: number
  fullName: string
  email: string
  agency: string
  status: "active" | "inactive"
  photoUrl: string
}

const mockStaff: Staff[] = [
  {
    id: 1,
    fullName: "Abdoulaye Oumar",
    email: "abdoulaye@sttl.td",
    agency: "N'Djamena",
    status: "active",
    photoUrl: "https://i.pravatar.cc/150?img=12"
  },
  {
    id: 2,
    fullName: "Fadila Mahamat",
    email: "fadila@sttl.td",
    agency: "Moundou",
    status: "inactive",
    photoUrl: "https://i.pravatar.cc/150?img=30"
  },
  {
    id: 3,
    fullName: "Gamar Ahmed",
    email: "gamar@sttl.td",
    agency: "Sarh",
    status: "active",
    photoUrl: "https://i.pravatar.cc/150?img=23"
  }
]

export default function RoleStaffPage() {
  const { role } = useParams()
  const { t } = useTranslation()
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setStaff(mockStaff)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [role])

  if (loading) return <Loader />

  return (
    <div className="p-6 space-y-6">
      {/* Back Link */}
      <div className="flex justify-between items-center">
        <Link
          href="/dashboard/admin/transport/roles"
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          ← Back to Staff Roles
        </Link>
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-800 capitalize">{role} Role - Assigned Staff</h1>

      {/* Table */}
      {staff.length === 0 ? (
        <p className="text-gray-500">No staff assigned to this role yet.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full text-left table-auto">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 font-medium">Name</th>
                <th className="py-3 px-4 font-medium">Email</th>
                <th className="py-3 px-4 font-medium">Agency</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((user) => (
                <tr key={user.id} className="border-t hover:bg-blue-50">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={user.photoUrl}
                      alt={user.fullName}
                      className="w-10 h-10 rounded-full object-cover border border-gray-300"
                    />
                    <span>{user.fullName}</span>
                  </td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.agency}</td>
                  <td className="py-3 px-4">
                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                      user.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button className="text-blue-600 hover:underline text-sm mr-4">View</button>
                    <button className="text-red-500 hover:underline text-sm">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
