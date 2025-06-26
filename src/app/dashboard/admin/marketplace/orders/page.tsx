"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type Order = {
  id: string
  customer: string
  total: number
  status: "pending" | "shipped" | "delivered"
  date: string
}

const dummyOrders: Order[] = [
  { id: "ORD001", customer: "John Doe", total: 45.99, status: "pending", date: "2025-06-15" },
  { id: "ORD002", customer: "Jane Smith", total: 89.50, status: "shipped", date: "2025-06-14" },
  { id: "ORD003", customer: "Ali Mahamat", total: 120.00, status: "delivered", date: "2025-06-13" },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const router = useRouter()

  useEffect(() => {
    setOrders(dummyOrders)
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">All Orders</h1>
      <table className="min-w-full bg-white border rounded shadow text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-3">Order ID</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id} className="border-t hover:bg-gray-50 transition">
              <td className="px-4 py-3">{order.id}</td>
              <td className="px-4 py-3">{order.customer}</td>
              <td className="px-4 py-3">${order.total.toFixed(2)}</td>
              <td className="px-4 py-3 capitalize">{order.status}</td>
              <td className="px-4 py-3">{order.date}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => router.push(`/dashboard/admin/marketplace/orders/${order.id}`)}
                  className="text-blue-600 hover:underline"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
