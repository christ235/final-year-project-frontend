"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"
import { useEffect, useState } from "react"

const dummySalesData = [
  { month: "Jan", revenue: 3200 },
  { month: "Feb", revenue: 4200 },
  { month: "Mar", revenue: 3850 },
  { month: "Apr", revenue: 5100 },
  { month: "May", revenue: 6100 },
  { month: "Jun", revenue: 5600 },
  { month: "Jul", revenue: 6700 },
  { month: "Aug", revenue: 7300 },
  { month: "Sep", revenue: 6900 },
  { month: "Oct", revenue: 7400 },
  { month: "Nov", revenue: 7900 },
  { month: "Dec", revenue: 8200 },
]

export default function SalesChart() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timeout)
  }, [])

  if (loading) {
    return <div className="h-72 bg-gray-100 rounded-xl animate-pulse" />
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Monthly Revenue</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={dummySalesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" stroke="#8884d8" />
          <YAxis stroke="#8884d8" />
          <Tooltip contentStyle={{ borderRadius: 10 }} />
          <Line type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={3} dot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
