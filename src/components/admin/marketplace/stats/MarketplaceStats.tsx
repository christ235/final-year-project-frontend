"use client"

import { useEffect, useState } from "react"

const dummyStats = [
  {
    label: "Total Products",
    value: 1280,
    icon: "fas fa-box-open",
    bg: "bg-blue-100 text-blue-600",
  },
  {
    label: "Pending Approvals",
    value: 42,
    icon: "fas fa-hourglass-half",
    bg: "bg-yellow-100 text-yellow-600",
  },
  {
    label: "Registered Vendors",
    value: 320,
    icon: "fas fa-store",
    bg: "bg-green-100 text-green-600",
  },
  {
    label: "Total Orders",
    value: 1125,
    icon: "fas fa-shopping-cart",
    bg: "bg-purple-100 text-purple-600",
  },
]

export default function MarketplaceStats() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="min-h-[130px] rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
      {dummyStats.map((stat, idx) => (
        <div
          key={idx}
          className="w-full h-full p-5 rounded-xl shadow bg-white flex flex-col items-center justify-center space-y-4 hover:shadow-md transition min-h-[150px] text-center"
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${stat.bg}`}>
            <i className={`${stat.icon} text-xl`}></i>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-gray-800">{stat.value.toLocaleString()}</h3>
          </div>
        </div>
      ))}
    </div>
  )
}
