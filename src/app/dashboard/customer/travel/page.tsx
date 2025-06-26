"use client"

import { useRouter } from "next/navigation"
import { useTranslation } from "@/i18n"
import Loader from "@/components/common/customer/loading"
import { useEffect, useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const actionCards = [
  {
    title: "Book a Trip",
    description: "Find and book your next intercity trip in Chad.",
    icon: "fas fa-bus",
    tag: "Travel",
    href: "/dashboard/customer/travel/book"
  },
  {
    title: "Manage Bookings",
    description: "View and manage your existing bookings.",
    icon: "fas fa-calendar-check",
    tag: "Bookings",
    href: "/dashboard/customer/travel/bookings"
  },
  {
    title: "Track Your Trips",
    description: "Keep track of your trips and travel history.",
    icon: "fas fa-map-marker-alt",
    tag: "Tracking",
    href: "/dashboard/customer/travel/tracking"
  },
  {
    title: "Travel Tips",
    description: "Get tips for a smooth travel experience in Chad.",
    icon: "fas fa-info-circle",
    tag: "Tips",
    href: "/dashboard/customer/travel/tips"
  }
]

export default function CustomerTravelDashboard() {
  const { t } = useTranslation()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <Loader />

  const filteredCards = actionCards.filter(card =>
    card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.tag.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white p-6 rounded-2xl shadow-md text-center">
        <h1 className="text-3xl font-bold mb-1">STTL - Travel Dashboard</h1>
        <p className="text-white/90">Easily book, manage, and track your intercity travels in Chad.</p>
      </div>

      {/* Search + Filter Row */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search bookings, routes..."
          className="w-full md:w-72 px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <select className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Filter by Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* 📅 Date Picker */}
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            placeholderText="Choose Date"
            className="px-4 py-2 border border-gray-300 rounded-xl text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredCards.map((card, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border-l-4 border-blue-600 cursor-pointer"
            onClick={() => router.push(card.href)}
          >
            <div className="flex items-center gap-3 mb-2">
              <i className={`${card.icon} text-blue-600 text-xl`}></i>
              <h3 className="text-lg font-semibold text-gray-800">{card.title}</h3>
            </div>
            <p className="text-gray-600 text-sm">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
