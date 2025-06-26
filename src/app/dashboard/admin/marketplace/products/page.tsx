"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

type Product = {
  id: string
  name: string
  image: string
  category: string
  price: number
  seller: string
  status: "pending" | "approved" | "rejected"
}

const dummyProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Earbuds",
    image: "/images/products/earbuds.jpg",
    category: "Electronics",
    price: 25.99,
    seller: "TechVendor",
    status: "approved"
  },
  {
    id: "2",
    name: "Modern Chair",
    image: "/images/products/chair.jpg",
    category: "Furniture",
    price: 89.99,
    seller: "ChadHome",
    status: "pending"
  },
  {
    id: "3",
    name: "Organic Honey",
    image: "/images/products/honey.jpg",
    category: "Food",
    price: 14.99,
    seller: "LocalFarm",
    status: "rejected"
  },
]

export default function ProductListPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    setProducts(dummyProducts)
  }, [])

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">All Products</h1>
      </div>

      <div className="overflow-x-auto rounded-xl shadow border bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3">Image</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Seller</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={50}
                    height={50}
                    className="rounded-md object-cover"
                  />
                </td>
                <td className="px-6 py-4 font-medium">{product.name}</td>
                <td className="px-6 py-4">{product.category}</td>
                <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                <td className="px-6 py-4">{product.seller}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      product.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : product.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => router.push(`/dashboard/admin/marketplace/products/${product.id}`)}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>
                  <button className="text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
