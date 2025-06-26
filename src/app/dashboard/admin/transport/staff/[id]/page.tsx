"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Loader from "@/components/common/admin/loading"
import { useTranslation } from "@/i18n"

const mockStaffData = {
  1: { name: "Adam Mbaiguinam", email: "adam@sttl.td", role: "Dispatcher", agency: "N'Djamena", status: "Active" },
  2: { name: "Fatime Barka", email: "fatime@sttl.td", role: "Driver", agency: "Moundou", status: "Active" },
  3: { name: "Ibrahim Zakaria", email: "ibrahim@sttl.td", role: "Agency Manager", agency: "Sarh", status: "Suspended" },
}

const roles = [
  "Dispatcher",
  "Agency Manager",
  "Driver",
  "Maintenance Staff",
  "Support Staff",
]

const agencies = [
  "N'Djamena",
  "Moundou",
  "Sarh",
  "Abéché",
  "Bongor",
]

export default function EditStaffPage() {
  const router = useRouter()
  const params = useParams()
  const { t } = useTranslation()

  const staffId = params.id as string
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    agency: "",
    status: "Active",
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      const numericStaffId = Number(staffId) as keyof typeof mockStaffData
      const data = mockStaffData[numericStaffId]
      if (data) setFormData(data)
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [staffId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Updated staff:", { id: staffId, ...formData })
    alert(`📧 Email sent to ${formData.email} to join as ${formData.role} at ${formData.agency}.`)
    router.push("/dashboard/admin/transport/staff")
  }

  if (loading) return <Loader />

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Edit Staff Member</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {roles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Agency</label>
          <select
            name="agency"
            value={formData.agency}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {agencies.map((agency) => (
              <option key={agency} value={agency}>{agency}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-400 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}
