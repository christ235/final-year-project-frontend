"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ROUTES } from "@/lib/route"
import Loader from "@/components/common/admin/loading"

const mockUsers = [
  {
    id: 1,
    name: "Alice Ngar",
    email: "alice@example.com",
    role: "Buyer",
    status: "Active"
  },
  {
    id: 2,
    name: "Moussa Yaya",
    email: "moussa@shop.td",
    role: "Seller",
    status: "Pending"
  },
  {
    id: 3,
    name: "Fatima Djam",
    email: "fatima@courier.td",
    role: "Courier",
    status: "Suspended"
  },
]

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
   const [loading, setLoading] = useState(true)

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

      useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000)
        return () => clearTimeout(timer)
      }, [])
    
      if (loading) return <Loader />

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
          <p className="text-gray-500 text-sm">Manage users by role, status, and actions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full sm:w-80 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex gap-4">
          <select className="px-3 py-2 border rounded-lg shadow-sm text-sm">
            <option value="">All Roles</option>
            <option value="Buyer">Buyer</option>
            <option value="Seller">Seller</option>
            <option value="Courier">Courier</option>
            <option value="Driver">Driver</option>
            <option value="Admin">Admin</option>
          </select>
          <select className="px-3 py-2 border rounded-lg shadow-sm text-sm">
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow border">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-400">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.role}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-600"
                          : user.status === "Pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Link
                      href={ROUTES.adminUserProfile(user.id)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View
                    </Link>
                    <Link
                      href={ROUTES.adminEditUser(user.id)}
                      className="text-yellow-600 hover:underline text-sm"
                    >
                      Edit
                    </Link>
                    <Link
                      href={ROUTES.adminSuspendUser(user.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Suspend
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
