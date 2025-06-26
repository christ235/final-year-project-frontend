"use client"

import { useRouter } from "next/navigation"
import { ROUTES } from "@/lib/route"
import { useEffect, useState } from "react"
import Loader from "@/components/common/customer/loading"

export default function CustomerDashboardPage() {
  const router = useRouter()
  const navigate = (path: string) => router.push(path)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <Loader />

  return (
    <section className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-2xl shadow-md text-center">
        <h2 className="text-3xl font-bold mb-2">Welcome to ChadLink</h2>
        <p className="text-blue-100">Easily manage your orders, deliveries, and bus bookings in one place.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="My Orders" value="12" icon="fas fa-box" color="bg-green-100 text-green-600" />
        <StatCard title="Deliveries in Transit" value="3" icon="fas fa-shipping-fast" color="bg-yellow-100 text-yellow-600" />
        <StatCard title="Upcoming Trips" value="2" icon="fas fa-ticket-alt" color="bg-blue-100 text-blue-600" />
        <StatCard title="Support Tickets" value="1" icon="fas fa-headset" color="bg-purple-100 text-purple-600" />
      </div>

      {/* Services */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ServiceCard
          title="Track Deliveries"
          description="Follow your parcel live, view status and delivery history."
          icon="fas fa-map-marker-alt"
          onClick={() => navigate(ROUTES.customerDeliveries)}
          color="text-yellow-600"
        />
        <ServiceCard
          title="Order Products"
          description="Browse products and place new orders with ease."
          icon="fas fa-shopping-basket"
          onClick={() => navigate(ROUTES.customerMarketplace)}
          color="text-green-600"
        />
        <ServiceCard
          title="Bus Booking"
          description="View routes, book your next trip, or download tickets."
          icon="fas fa-bus-alt"
          onClick={() => navigate(ROUTES.customerBusBooking)}
          color="text-blue-600"
        />
      </div>

      {/* Quick Links */}
      <div className="bg-white border p-6 rounded-xl shadow-sm">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Quick Access</h3>
        <ul className="grid md:grid-cols-2 gap-4 text-blue-600 font-medium">
          <li>
            <button onClick={() => navigate(ROUTES.customerOrders)} className="flex items-center hover:text-blue-800 transition-colors">
              <i className="fas fa-box-open mr-2"></i> My Orders
            </button>
          </li>
          <li>
            <button onClick={() => navigate(ROUTES.customerSupport)} className="flex items-center hover:text-blue-800 transition-colors">
              <i className="fas fa-headset mr-2"></i> Help & Support
            </button>
          </li>
          <li>
            <button onClick={() => navigate(ROUTES.customerSubscriptions)} className="flex items-center hover:text-blue-800 transition-colors">
              <i className="fas fa-sync-alt mr-2"></i> My Subscriptions
            </button>
          </li>
          <li>
            <button onClick={() => navigate(ROUTES.customerProfile)} className="flex items-center hover:text-blue-800 transition-colors">
              <i className="fas fa-user mr-2"></i> Account Settings
            </button>
          </li>
        </ul>
      </div>
    </section>
  )
}

// Reusable Stat Box
function StatCard({ title, value, icon, color }: { title: string; value: string; icon: string; color: string }) {
  return (
    <div className={`p-5 rounded-xl shadow bg-white flex items-center justify-between`}>
      <div>
        <p className="text-gray-500 text-sm mb-1">{title}</p>
        <h3 className="text-xl font-bold text-gray-800">{value}</h3>
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
        <i className={`${icon} text-lg`}></i>
      </div>
    </div>
  )
}

// Reusable Service Box
function ServiceCard({
  title,
  description,
  icon,
  onClick,
  color
}: {
  title: string
  description: string
  icon: string
  onClick: () => void
  color: string
}) {
  return (
    <button
      onClick={onClick}
      className="block bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 text-left w-full"
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className={`text-2xl ${color}`}>
          <i className={icon}></i>
        </div>
        <h4 className="text-lg font-semibold text-gray-700">{title}</h4>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  )
}
