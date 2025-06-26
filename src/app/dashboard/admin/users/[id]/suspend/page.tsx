"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { ROUTES } from "@/lib/route"

export default function SuspendUserPage() {
  const { id } = useParams()
  const router = useRouter()
  const [reason, setReason] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(`🚫 Suspended user ${id} for reason: ${reason}`)

    // After processing, go back to user profile
    router.push(ROUTES.adminUserProfile(id as string))
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-red-700">Suspend User</h2>
        <Link href={ROUTES.adminUserProfile(id as string)} className="text-sm text-gray-600 hover:underline">
          ← Back to Profile
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <p className="mb-4 text-gray-700">You are about to suspend this user. Please provide a reason:</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            rows={4}
            className="w-full border rounded-lg p-3"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. suspicious activity, multiple complaints..."
          />

          <div className="flex gap-4">
            <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium">
              Confirm Suspension
            </button>
            <button
              type="button"
              onClick={() => router.push(ROUTES.adminUserProfile(id as string))}
              className="px-6 py-2 rounded-lg border"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
