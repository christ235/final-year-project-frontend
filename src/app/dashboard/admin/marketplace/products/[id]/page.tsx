"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type Product = {
  id: string
  name: string
  category: string
  price: number
  image: string
  seller: string
  status: "pending" | "approved" | "rejected"
}

const dummyData: Product[] = [
  {
    id: "1",
    name: "Wireless Earbuds",
    category: "Electronics",
    price: 25.99,
    image: "/images/products/earbuds.jpg",
    seller: "TechVendor",
    status: "approved"
  },
  {
    id: "2",
    name: "Modern Chair",
    category: "Furniture",
    price: 89.99,
    image: "/images/products/chair.jpg",
    seller: "ChadHome",
    status: "pending"
  },
]

export default function ProductDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const selected = dummyData.find(p => p.id === id)
    setProduct(selected || null)
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!product) return
    const { name, value } = e.target
    setProduct(prev => prev ? { ...prev, [name]: name === 'price' ? parseFloat(value) : value } : null)
  }

  const handleSave = () => {
    console.log("Updated product:", product)
    alert("Product updated (simulated)")
    router.push("/dashboard/admin/marketplace/products")
  }

  const handleDelete = () => {
    const confirmDelete = confirm("Are you sure you want to delete this product?")
    if (confirmDelete) {
      console.log("Deleted product:", product?.id)
      router.push("/dashboard/admin/marketplace/products")
    }
  }

  if (!product) return <div className="p-6 text-gray-500">Loading product...</div>

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Product Details</h1>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">Product Name</label>
          <input
            name="name"
            value={product.name}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">Category</label>
          <input
            name="category"
            value={product.category}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">Price (USD)</label>
          <input
            name="price"
            type="number"
            value={product.price}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">Status</label>
          <select
            name="status"
            value={product.status}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 transition"
          >
            Delete Product
          </button>
        </div>
      </div>
    </div>
  )
}
