"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "@/i18n"
import Link from "next/link"
import Loader from "@/components/common/admin/loading"
import MarketplaceStats from "@/components/admin/marketplace/stats/MarketplaceStats"
import SalesChart from "@/components/admin/marketplace/stats/SalesChart"
import CategoryBreakdown from "@/components/admin/marketplace/stats/CategoryBreakdown"

export default function AdminMarketplaceDashboard() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <Loader />

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow-md text-center">
        <h1 className="text-3xl font-bold mb-2">Marketplace Dashboard</h1>
        <p className="text-blue-100">
          {t("admin.marketplace.subtitle") || "Overview of marketplace performance"}
        </p>
      </div>
       <div className="flex gap-4">
          <Link href="/dashboard/admin/marketplace/products" className="btn-outline">
            Manage Products
          </Link>
          <Link href="/dashboard/admin/marketplace/vendors" className="btn-outline">
            Manage Vendors
          </Link>
        </div>
      {/* Stats & Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Import and place MarketplaceStats, SalesChart, CategoryBreakdown, etc. here */}
        <MarketplaceStats/>
        <SalesChart />
        < CategoryBreakdown />
      </div>
    </div>
  )
}
