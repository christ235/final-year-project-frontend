"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useTranslation } from "@/i18n"
import { exportToCSV } from "@/lib/exportToExcel"


interface PendingVendor {
  id: number
  name: string
  email: string
  shopName: string
  submittedAt: string
}

export default function PendingVendorsPage() {
  const [pendingVendors, setPendingVendors] = useState<PendingVendor[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    const timer = setTimeout(() => {
      setPendingVendors([
        {
          id: 3,
          name: "Mariam K.",
          email: "mariam@chadlink.td",
          shopName: "Mariam Express",
          submittedAt: "2025-06-13"
        },
        {
          id: 4,
          name: "Issa Saleh",
          email: "issa@chadlink.td",
          shopName: "Issa Cargo",
          submittedAt: "2025-06-14"
        }
      ])
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

   const handleDownload = () => {
    const formatted = pendingVendors.map(v => ({
      Name: v.name,
      "Shop Name": v.shopName,
      Email: v.email,
      "Submitted On": v.submittedAt,
      Status: "Pending",
    }))
    exportToCSV(formatted, "Pending_Vendors")
  }


  return (
    <div className="p-6 space-y-6">
      {/* Header styled like AdminMarketplaceDashboard */}
      <div className="bg-yellow-100 to-indigo-600 text-white p-6 rounded-2xl shadow-md text-center">
        <h1 className="text-3xl font-bold mb-2 text-yellow-700">Pending Vendor Applications</h1>
        <p className="text-yellow-600">
          {t("admin.vendors.pendingSubtitle") || "Vendors waiting for approval to join ChadLink."}
        </p>
      </div>

        {/* Export Button */}
      <div className="text-right">
        <button
          onClick={handleDownload}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow text-sm"
        >
          ⬇️ Export to Excel
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-blue-500 font-medium animate-pulse">
          Fetching pending vendors...
        </div>
      ) : pendingVendors.length === 0 ? (
        <p className="text-gray-600">No pending applications at this time.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Vendor</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Shop Name</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Submitted On</th>
                <th className="px-6 py-3 text-right font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pendingVendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{vendor.name}</td>
                  <td className="px-6 py-4">{vendor.shopName}</td>
                  <td className="px-6 py-4">{vendor.email}</td>
                  <td className="px-6 py-4">{vendor.submittedAt}</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/dashboard/admin/marketplace/vendors/${vendor.id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Review
                    </Link>
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
