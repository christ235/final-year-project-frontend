"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AddVendorPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    shopName: "",
    phone: "",
    address: ""
  })

  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    // Simulate backend submission delay
    setTimeout(() => {
      alert("Vendor submitted successfully!")
      setSubmitting(false)
      router.push("/dashboard/admin/marketplace/vendors/pending")
    }, 1200)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow-md text-center">
        <h1 className="text-3xl font-bold mb-2">➕ Add New Vendor</h1>
        <p className="text-blue-100">Fill in the form below to register a vendor on ChadLink.</p>
      </div>

      {/* Loading Animation */}
      {submitting ? (
        <div className="text-center py-12 text-blue-600 font-medium animate-pulse">
          ⏳ Submitting vendor details...
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow space-y-5 border"
        >
          <div>
            <label htmlFor="name" className="block font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="input input-bordered w-full"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="input input-bordered w-full"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="shopName" className="block font-medium text-gray-700 mb-1">Shop Name</label>
            <input
              type="text"
              id="shopName"
              name="shopName"
              required
              className="input input-bordered w-full"
              value={formData.shopName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              className="input input-bordered w-full"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="address" className="block font-medium text-gray-700 mb-1">Business Address</label>
            <input
              type="text"
              id="address"
              name="address"
              required
              className="input input-bordered w-full"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow"
              disabled={submitting}
            >
              Submit Vendor
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
