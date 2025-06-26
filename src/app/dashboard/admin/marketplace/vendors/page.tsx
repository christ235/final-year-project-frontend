"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/i18n"
import Loader from "@/components/common/admin/loading"

export default function VendorsMainPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <Loader />

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-blue-600 to-teal-600 text-white p-6 rounded-2xl shadow-md text-center">
        <h1 className="text-3xl font-bold mb-2">Vendor Management</h1>
        <p className="text-blue-100">
          {t("admin.vendors.subtitle") || "Manage, review, and onboard marketplace vendors."}
        </p>
      </div>

      {/* Add Vendor Button */}
      <div className="flex justify-end">
        <button
          onClick={() => router.push("/dashboard/admin/marketplace/vendors/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium shadow"
        >
          ➕ Add Vendor
        </button>
      </div>

      {/* Vendor Status Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <button
          onClick={() => router.push("/dashboard/admin/marketplace/vendors/approved")}
          className="bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 px-6 py-4 rounded-xl shadow-sm text-left transition"
        >
          <h2 className="text-lg font-semibold mb-1">✅ Approved Vendors</h2>
          <p className="text-sm text-green-600">Manage all vendors currently approved to sell on ChadLink.</p>
        </button>

        <button
          onClick={() => router.push("/dashboard/admin/marketplace/vendors/pending")}
          className="bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-xl shadow-sm text-left transition"
        >
          <h2 className="text-lg font-semibold mb-1">🕓 Pending Applications</h2>
          <p className="text-sm text-yellow-600">Review vendors waiting for approval.</p>
        </button>

        <button
          onClick={() => router.push("/dashboard/admin/marketplace/vendors/rejected")}
          className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-sm text-left transition"
        >
          <h2 className="text-lg font-semibold mb-1">❌ Rejected Vendors</h2>
          <p className="text-sm text-red-600">Track vendors rejected within the last month.</p>
        </button>
      </div>
    </div>
  )
}
