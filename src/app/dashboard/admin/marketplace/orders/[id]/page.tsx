"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type OrderDetails = {
  id: string
  customer: string
  items: { name: string; quantity: number; price: number }[]
  total: number
  status: string
  shippingAddress: string
}

const dummyOrder: OrderDetails = {
  id: "ORD001",
  customer: "John Doe",
  total: 45.99,
  status: "pending",
  shippingAddress: "Avenue Charles de Gaulle, N'Djamena",
  items: [
    { name: "Wireless Mouse", quantity: 1, price: 25 },
    { name: "USB Cable", quantity: 2, price: 10.50 }
  ]
}

export default function OrderDetail() {
  const { id } = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<OrderDetails | null>(null)

  useEffect(() => {
    setOrder(dummyOrder)
  }, [id])

  if (!order) return <div className="p-6">Loading order...</div>

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Order #{order.id}</h1>

      <div className="space-y-4">
        <p><strong>Customer:</strong> {order.customer}</p>
        <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
        <p><strong>Status:</strong> {order.status}</p>

        <div>
          <h2 className="text-lg font-semibold mb-2">Items</h2>
          <ul className="list-disc ml-6">
            {order.items.map((item, i) => (
              <li key={i}>
                {item.name} — {item.quantity} × ${item.price.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>

        <p className="font-bold mt-4">Total: ${order.total.toFixed(2)}</p>
      </div>

      <div className="mt-6">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:underline"
        >
          Back to Orders
        </button>
      </div>
    </div>
  )
}
