"use client"


import { useRouter } from "next/navigation"
import { ROUTES } from "@/lib/route"
import Loader from "@/components/common/admin/loading"
import { useEffect, useState } from "react"

export default function AdminDashboardPage() {
  const router = useRouter()
  const navigate = (path: string) => router.push(path) // Same pattern as landing page
  const [loading, setLoading] = useState(true)

    useEffect(() => {
      const timer = setTimeout(() => setLoading(false), 1000)
      return () => clearTimeout(timer)
    }, [])
  
    if (loading) return <Loader />

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow-md text-center">
        <h2 className="text-3xl font-bold mb-2">Welcome to ChadLink Admin Dashboard</h2>
        <p className="text-blue-100">Full control over platform operations, users, and services.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Users" value="1,240" icon="fas fa-users" color="bg-blue-100 text-blue-600" />
        <StatCard title="Vendors" value="135" icon="fas fa-store" color="bg-green-100 text-green-600" />
        <StatCard title="Couriers" value="88" icon="fas fa-motorcycle" color="bg-yellow-100 text-yellow-600" />
        <StatCard title="Drivers" value="102" icon="fas fa-id-badge" color="bg-purple-100 text-purple-600" />
      </div>

      {/* Services */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ServiceCard
          title="Marketplace"
          description="Manage products, sellers, and customer orders"
          icon="fas fa-shopping-cart"
          onClick={() => navigate(ROUTES.adminMarketplace)}
          color="text-green-600"
        />
        <ServiceCard
          title="Logistics"
          description="Track deliveries, couriers and scheduled drops"
          icon="fas fa-truck"
          onClick={() => navigate(ROUTES.adminCouriers)}
          color="text-yellow-600"
        />
        <ServiceCard
          title="Bus Booking"
          description="Oversee routes, bookings, and drivers"
          icon="fas fa-bus"
          onClick={() => navigate(ROUTES.adminDrivers)}
          color="text-blue-600"
        />
      </div>

      {/* Quick Links */}
      <div className="bg-white border p-6 rounded-xl shadow-sm">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Quick Management Links</h3>
        <ul className="grid md:grid-cols-2 gap-4 text-blue-600 font-medium">
          <li>
            <button 
              onClick={() => navigate(ROUTES.adminUsers)}
              className="flex items-center hover:text-blue-800 transition-colors"
            >
              <i className="fas fa-users mr-2"></i> Manage Users
            </button>
          </li>
          <li>
            <button 
              onClick={() => navigate(ROUTES.adminVendors)}
              className="flex items-center hover:text-blue-800 transition-colors"
            >
              <i className="fas fa-store mr-2"></i> Approve Vendors
            </button>
          </li>
          <li>
            <button 
              onClick={() => navigate(ROUTES.adminCouriers)}
              className="flex items-center hover:text-blue-800 transition-colors"
            >
              <i className="fas fa-motorcycle mr-2"></i> Assign Couriers
            </button>
          </li>
          <li>
            <button 
              onClick={() => navigate(ROUTES.adminOrders)}
              className="flex items-center hover:text-blue-800 transition-colors"
            >
              <i className="fas fa-receipt mr-2"></i> View Orders
            </button>
          </li>
          <li>
            <button 
              onClick={() => navigate(ROUTES.adminAgencies)}
              className="flex items-center hover:text-blue-800 transition-colors"
            >
              <i className="fas fa-building mr-2"></i> Manage Agencies
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}

// 🟦 Reusable stat box
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

// 💡 Reusable service box
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