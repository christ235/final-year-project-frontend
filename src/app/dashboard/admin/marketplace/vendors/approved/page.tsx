"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useTranslation } from "@/i18n"
import { exportToCSV } from "@/lib/exportToExcel"

interface Vendor {
  id: number
  name: string
  shopName: string
  email: string
  approvedAt: string
}

export default function ApprovedVendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    const timer = setTimeout(() => {
      setVendors([
        {
          id: 1,
          name: "Alice Doumra",
          shopName: "Doumra Tech",
          email: "alice@chadlink.td",
          approvedAt: "2025-06-10"
        },
        {
          id: 2,
          name: "Ngarsouledé",
          shopName: "Ngars Shop",
          email: "ngars@chadlink.td",
          approvedAt: "2025-06-05"
        }
      ])
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

   const handleDownload = () => {
        const formatted = vendors.map(v => ({
          Name: v.name,
          "Shop Name": v.shopName,
          Email: v.email,
          "Rejected On": v.approvedAt,
          Status: "Rejected",
        }))
        exportToCSV(formatted, "Pending_Vendors")
      }

  return (
    <div className="p-6 space-y-6">
      {/* Header Styled Like AdminMarketplaceDashboard */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-2xl shadow-md text-center">
        <h1 className="text-3xl font-bold mb-2"> Approved Vendors</h1>
        <p className="text-green-100">
          {t("admin.vendors.approvedSubtitle") || "Vendors approved to sell on ChadLink."}
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
        <div className="text-center py-12 text-blue-600 font-medium animate-pulse">
          Loading approved vendors...
        </div>
      ) : vendors.length === 0 ? (
        <p className="text-gray-600">No approved vendors found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Vendor</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Shop Name</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Approved On</th>
                <th className="px-6 py-3 text-right font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{vendor.name}</td>
                  <td className="px-6 py-4">{vendor.shopName}</td>
                  <td className="px-6 py-4">{vendor.email}</td>
                  <td className="px-6 py-4">{vendor.approvedAt}</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/dashboard/admin/marketplace/vendors/${vendor.id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      View
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
