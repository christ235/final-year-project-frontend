"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useTranslation } from "@/i18n"
import { exportToCSV } from "@/lib/exportToExcel"

interface RejectedVendor {
  id: number
  name: string
  email: string
  shopName: string
  rejectedAt: string
}

export default function RejectedVendorsPage() {
  const [rejectedVendors, setRejectedVendors] = useState<RejectedVendor[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    const timer = setTimeout(() => {
      setRejectedVendors([
        {
          id: 5,
          name: "Zakaria B.",
          email: "zakaria@chadlink.td",
          shopName: "Zakaria Deals",
          rejectedAt: "2025-06-10",
        },
        {
          id: 6,
          name: "Nour Djamal",
          email: "nour@chadlink.td",
          shopName: "Nour Bazaar",
          rejectedAt: "2025-06-12",
        },
      ])
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

   const handleDownload = () => {
      const formatted = rejectedVendors.map(v => ({
        Name: v.name,
        "Shop Name": v.shopName,
        Email: v.email,
        "Rejected On": v.rejectedAt,
        Status: "Rejected",
      }))
      exportToCSV(formatted, "Pending_Vendors")
    }
  

  return (
    <div className="p-6 space-y-6">
      {/* Header styled like AdminMarketplaceDashboard */}
      <div className="bg-red-600 to-pink-600 text-white p-6 rounded-2xl shadow-md text-center">
        <h1 className="text-3xl font-bold mb-2"> Rejected Vendors</h1>
        <p className="text-red-100">
          {t("admin.vendors.rejectedSubtitle") || "Vendors whose applications have been declined."}
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
        <div className="text-center py-12 text-red-500 font-medium animate-pulse">
          Loading rejected vendors...
        </div>
      ) : rejectedVendors.length === 0 ? (
        <p className="text-gray-600">No rejected vendors found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Vendor</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Shop Name</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Rejected On</th>
                <th className="px-6 py-3 text-right font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rejectedVendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{vendor.name}</td>
                  <td className="px-6 py-4">{vendor.shopName}</td>
                  <td className="px-6 py-4">{vendor.email}</td>
                  <td className="px-6 py-4">{vendor.rejectedAt}</td>
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
