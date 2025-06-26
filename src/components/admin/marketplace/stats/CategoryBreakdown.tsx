"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { useTranslation } from "@/i18n"

const dummyData = [
  { name: "Electronics", value: 320 },
  { name: "Clothing", value: 210 },
  { name: "Groceries", value: 120 },
  { name: "Books", value: 90 },
  { name: "Home Decor", value: 60 },
]

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#6366F1"]

export default function CategoryBreakdown() {
  const { t } = useTranslation()
  const [data, setData] = useState(dummyData)

  // Simulate fetching from API
  useEffect(() => {
    // TODO: Replace with API call
    // fetch("/api/admin/analytics/categories")
    //   .then(res => res.json())
    //   .then(setData)
  }, [])

  return (
    <div className="bg-white shadow-md rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        {t("marketplace.stats.categoryBreakdown")}
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name }) => name}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-6 space-y-2 text-sm text-gray-600">
        {data.map((category, i) => (
          <li key={i} className="flex items-center">
            <span
              className="inline-block w-3 h-3 rounded-full mr-3"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            ></span>
            <span className="flex-1">{category.name}</span>
            <span className="font-semibold">{category.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
