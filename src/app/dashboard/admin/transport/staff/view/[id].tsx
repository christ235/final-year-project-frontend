"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FaArrowLeft } from "react-icons/fa"
import Loader from "@/components/common/admin/loading"

type Staff = {
  id: number
  fullName: string
  email: string
  phone?: string
  role: string
  agency: string
  status: "active" | "inactive"
  photoUrl: string
}

const mockStaff: Staff[] = [
  {
    id: 1,
    fullName: "Abdoulaye Oumar",
    email: "abdoulaye@sttl.td",
    phone: "+235 66000000",
    agency: "N'Djamena",
    role: "Dispatcher",
    status: "active",
    photoUrl: "https://i.pravatar.cc/150?img=12"
  },
  {
    id: 2,
    fullName: "Fadila Mahamat",
    email: "fadila@sttl.td",
    phone: "+235 66222222",
    agency: "Moundou",
    role: "Driver",
    status: "inactive",
    photoUrl: "https://i.pravatar.cc/150?img=30"
  },
  {
    id: 3,
    fullName: "Gamar Ahmed",
    email: "gamar@sttl.td",
    phone: "+235 66444444",
    agency: "Sarh",
    role: "Agency Manager",
    status: "active",
    photoUrl: "https://i.pravatar.cc/150?img=23"
  }
]

export default function StaffDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [staff, setStaff] = useState<Staff | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      const found = mockStaff.find((s) => s.id === Number(id))
      setStaff(found || null)
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [id])

  if (loading) return <Loader />

  if (!staff) {
    return (
      <div className="p-6">
        <p className="text-red-500">Staff not found.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-blue-600 hover:underline"
        >
          ← Go back
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
      >
        <FaArrowLeft />
        Back
      </button>

      {/* Header */}
      <div className="flex items-center gap-6 bg-white p-6 rounded-xl shadow">
        <img
          src={staff.photoUrl}
          alt={staff.fullName}
          className="w-24 h-24 rounded-full object-cover border border-gray-300"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{staff.fullName}</h1>
          <p className="text-sm text-gray-500">{staff.role} at {staff.agency}</p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-sm text-gray-500 mb-1">Email</h3>
          <p className="font-medium text-gray-800">{staff.email}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-sm text-gray-500 mb-1">Phone</h3>
          <p className="font-medium text-gray-800">{staff.phone || "N/A"}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-sm text-gray-500 mb-1">Agency</h3>
          <p className="font-medium text-gray-800">{staff.agency}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-sm text-gray-500 mb-1">Status</h3>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              staff.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {staff.status}
          </span>
        </div>
      </div>
    </div>
  )
}
