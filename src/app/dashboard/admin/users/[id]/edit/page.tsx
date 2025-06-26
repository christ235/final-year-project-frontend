"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"

const roles = ["Buyer", "Seller", "Courier", "Driver", "Admin"]
const statuses = ["Active", "Suspended", "Pending"]

export default function EditUserPage() {
  const { id } = useParams()
  const router = useRouter()

  const [form, setForm] = useState({
    name: "Alice Ngar",
    phone: "+235 66 00 11 22",
    address: "Quartier Chagoua, N'Djamena",
    role: "Buyer",
    status: "Active",
    profilePicture: "/icons/user-avatar.svg",
  })

  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (selectedImage) {
      const objectUrl = URL.createObjectURL(selectedImage)
      setPreviewUrl(objectUrl)
      return () => URL.revokeObjectURL(objectUrl)
    }
  }, [selectedImage])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("✅ Updated User:", form)
    console.log("🖼️ New Image File:", selectedImage)

    const confirmed = window.confirm("Changes saved successfully. Do you want to return to the profile page?")
    if (confirmed) {
      router.push(`/dashboard/admin/users/${id}`)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Edit User</h2>
        <Link href={`/dashboard/admin/users/${id}`} className="text-blue-600 hover:underline text-sm">
          ← Back to Profile
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-6">
        {/* Profile Picture Upload */}
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24">
            <img
              src={previewUrl || form.profilePicture}
              alt="Profile Preview"
              className="w-full h-full rounded-full object-cover border"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Change Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            >
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Save Changes
        </button>
      </form>
    </div>
  )
}
