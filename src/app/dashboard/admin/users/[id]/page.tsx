"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ROUTES } from "@/lib/route"
import Loader from "@/components/common/admin/loading"
import { useEffect, useState } from "react"

// Dummy user detail
const mockUser = {
  id: 1,
  name: "Alice Ngar",
  email: "alice@example.com",
  phone: "+235 66 00 11 22",
  role: "Buyer",
  status: "Active",
  createdAt: "2024-02-15",
  lastLogin: "2025-06-10 09:14",
  address: "Quartier Chagoua, N'Djamena",
  language: "French",
  profilePicture: "/icons/user-avatar.svg"
}

export default function AdminUserProfilePage() {
  const { id } = useParams()
   const [loading, setLoading] = useState(true)

   useEffect(() => {
          const timer = setTimeout(() => setLoading(false), 1000)
          return () => clearTimeout(timer)
        }, [])
      
        if (loading) return <Loader />

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">User Profile</h2>
          <p className="text-gray-500 text-sm">ID: {id}</p>
        </div>
        <Link href={ROUTES.adminUsers} className="text-blue-600 hover:underline text-sm">
          ← Back to Users
        </Link>
      </div>

      {/* Profile Card */}
      <div className="bg-white shadow rounded-xl p-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Avatar */}
        <div className="flex flex-col items-center space-y-4">
          <img
            src={mockUser.profilePicture}
            alt="User avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
          />
          <span className={`text-sm font-medium px-3 py-1 rounded-full ${
            mockUser.status === "Active" ? "bg-green-100 text-green-600"
            : mockUser.status === "Suspended" ? "bg-red-100 text-red-600"
            : "bg-yellow-100 text-yellow-600"
          }`}>
            {mockUser.status}
          </span>
        </div>

        {/* Basic Info */}
        <div className="md:col-span-2 space-y-3">
          <h3 className="text-xl font-bold text-gray-700">{mockUser.name}</h3>
          <p className="text-gray-600"><strong>Email:</strong> {mockUser.email}</p>
          <p className="text-gray-600"><strong>Phone:</strong> {mockUser.phone}</p>
          <p className="text-gray-600"><strong>Role:</strong> {mockUser.role}</p>
          <p className="text-gray-600"><strong>Language:</strong> {mockUser.language}</p>
          <p className="text-gray-600"><strong>Address:</strong> {mockUser.address}</p>
        </div>
      </div>

      {/* Activity Section */}
      <div className="bg-white shadow rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-700 mb-4">Account Activity</h4>
        <ul className="text-gray-600 space-y-2 text-sm">
          <li><strong>Created:</strong> {mockUser.createdAt}</li>
          <li><strong>Last Login:</strong> {mockUser.lastLogin}</li>
        </ul>
      </div>

      {/* Admin Actions */}
      <div className="bg-white shadow rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-700 mb-4">Admin Actions</h4>
        <div className="flex flex-wrap gap-4">
          <Link
            href={ROUTES.adminEditUser(mockUser.id)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Edit User
          </Link>

          <Link
            href={ROUTES.adminSuspendUser(mockUser.id)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Suspend User
          </Link>
        </div>
      </div>
    </div>
  )
}
