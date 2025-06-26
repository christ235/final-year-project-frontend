"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTranslation } from "@/i18n"

interface TripData {
  from: string
  to: string
  date: string
  passengers: number
}

interface BusResult {
  id: string
  company: string
  busType: string
  departureTime: string
  arrivalTime: string
  duration: string
  stops: number
  stopLocations: string[]
  price: number
  availableSeats: number
  amenities: string[]
  rating: number
}

export default function OneWaySearchResultsPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [trip] = useState<TripData>({
    from: searchParams.get('from') || "",
    to: searchParams.get('to') || "",
    date: searchParams.get('date') || "",
    passengers: parseInt(searchParams.get('passengers') || "1")
  })

  const [buses, setBuses] = useState<BusResult[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<"price" | "time" | "duration" | "rating">("price")
  const [filterByStops, setFilterByStops] = useState<"all" | "0" | "1" | "2+">("all")
  const [filterByTime, setFilterByTime] = useState<"all" | "morning" | "afternoon" | "evening">("all")
  const [filterByBusType, setFilterByBusType] = useState<"all" | "Standard" | "AC Deluxe" | "VIP" | "Sleeper">("all")

  // Mock bus data generation
  const generateMockBuses = (tripData: TripData): BusResult[] => {
    const companies = ["Express Transport", "City Lines", "Comfort Travel", "Swift Bus", "Premium Coach"]
    const busTypes = ["Standard", "AC Deluxe", "VIP", "Sleeper", "Executive"]
    const amenities = [
      ["WiFi", "AC", "Charging Port"],
      ["AC", "Entertainment", "Snacks"],
      ["WiFi", "AC", "Reclining Seats", "Charging Port"],
      ["Sleeper Beds", "AC", "Meals", "WiFi"],
      ["Premium Seats", "AC", "Entertainment", "Meals", "WiFi"]
    ]

    return Array.from({ length: 8 }, (_, i) => {
      const departureHour = 6 + (i * 2)
      const duration = 6 + Math.floor(Math.random() * 4)
      const stops = Math.floor(Math.random() * 4)
      const price = 15000 + (Math.random() * 25000)
      
      return {
        id: `bus-${i + 1}`,
        company: companies[i % companies.length],
        busType: busTypes[i % busTypes.length],
        departureTime: `${departureHour.toString().padStart(2, '0')}:00`,
        arrivalTime: `${((departureHour + duration) % 24).toString().padStart(2, '0')}:00`,
        duration: `${duration}h ${Math.floor(Math.random() * 60)}m`,
        stops,
        stopLocations: stops > 0 ? [`Stop ${i + 1}`, `Stop ${i + 2}`].slice(0, stops) : [],
        price: Math.round(price),
        availableSeats: 15 + Math.floor(Math.random() * 25),
        amenities: amenities[i % amenities.length],
        rating: 3.5 + (Math.random() * 1.5)
      }
    })
  }

  useEffect(() => {
    console.log("🚌 Loading one-way buses for:", trip)
    const timer = setTimeout(() => {
      setBuses(generateMockBuses(trip))
      setLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const getFilteredBuses = () => {
    let filtered = buses

    // Filter by stops
    if (filterByStops !== "all") {
      if (filterByStops === "0") filtered = filtered.filter(bus => bus.stops === 0)
      else if (filterByStops === "1") filtered = filtered.filter(bus => bus.stops === 1)
      else if (filterByStops === "2+") filtered = filtered.filter(bus => bus.stops >= 2)
    }

    // Filter by time
    if (filterByTime !== "all") {
      filtered = filtered.filter(bus => {
        const hour = parseInt(bus.departureTime.split(':')[0])
        if (filterByTime === "morning") return hour >= 6 && hour < 12
        if (filterByTime === "afternoon") return hour >= 12 && hour < 18
        if (filterByTime === "evening") return hour >= 18 || hour < 6
        return true
      })
    }

    // Filter by bus type
    if (filterByBusType !== "all") {
      filtered = filtered.filter(bus => bus.busType === filterByBusType)
    }

    // Sort buses
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "price": return a.price - b.price
        case "time": return a.departureTime.localeCompare(b.departureTime)
        case "duration": return parseInt(a.duration) - parseInt(b.duration)
        case "rating": return b.rating - a.rating
        default: return 0
      }
    })
  }

  const handleSelectBus = (bus: BusResult) => {
    console.log("🎫 One-way bus selected:", bus.id)
    
    // Save selected bus to sessionStorage
    const selectedBus = {
      busId: bus.id,
      trip: trip,
      busDetails: bus
    }
    
    sessionStorage.setItem('selectedOutbound', JSON.stringify(selectedBus))
    console.log("💾 Saved to sessionStorage:", selectedBus)
    
    // Navigate to passenger details
    router.push(`/dashboard/customer/travel/book/passenger-details?type=one-way`)
  }

  const goBackToSearch = () => {
    router.back()
  }

  const clearAllFilters = () => {
    setSortBy("price")
    setFilterByStops("all")
    setFilterByTime("all")
    setFilterByBusType("all")
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">🔍 Searching for one-way buses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* One-Way Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-700 text-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">🚌 One-Way Journey</h1>
            <div className="text-green-100">
              <p className="text-lg font-medium">{trip.from} → {trip.to}</p>
              <p className="text-sm opacity-90">📅 {trip.date} • 👥 {trip.passengers} passenger(s)</p>
            </div>
          </div>
          
          <button
            onClick={goBackToSearch}
            className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition backdrop-blur border border-white/30"
          >
            ← Modify Search
          </button>
        </div>

        {/* Simple Progress Bar for One-Way */}
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center text-white">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold">✓</div>
            <span className="ml-2 font-medium">Search</span>
          </div>
          <div className="w-8 h-px bg-white/40"></div>
          <div className="flex items-center text-yellow-300">
            <div className="w-6 h-6 rounded-full bg-yellow-300 text-black flex items-center justify-center text-xs font-bold">2</div>
            <span className="ml-2 font-medium">Select Bus</span>
          </div>
          <div className="w-8 h-px bg-white/40"></div>
          <div className="flex items-center text-white/60">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">3</div>
            <span className="ml-2 font-medium">Passenger Details</span>
          </div>
          <div className="w-8 h-px bg-white/40"></div>
          <div className="flex items-center text-white/60">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">4</div>
            <span className="ml-2 font-medium">Seats</span>
          </div>
          <div className="w-8 h-px bg-white/40"></div>
          <div className="flex items-center text-white/60">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">5</div>
            <span className="ml-2 font-medium">Payment</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Filter & Sort Results</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">{getFilteredBuses().length} buses available</span>
            <span className="text-gray-400">•</span>
            <button
              onClick={clearAllFilters}
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Clear all filters
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="price">💰 Price (Low to High)</option>
              <option value="time">🕐 Departure Time</option>
              <option value="duration">⏱️ Duration (Shortest)</option>
              <option value="rating">⭐ Rating (Highest)</option>
            </select>
          </div>

          {/* Stops Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number of stops</label>
            <select
              value={filterByStops}
              onChange={(e) => setFilterByStops(e.target.value as any)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All stops</option>
              <option value="0">🚀 Non-stop only</option>
              <option value="1">1️⃣ 1 stop max</option>
              <option value="2+">2️⃣ 2+ stops</option>
            </select>
          </div>

          {/* Time Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Departure time</label>
            <select
              value={filterByTime}
              onChange={(e) => setFilterByTime(e.target.value as any)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">Any time</option>
              <option value="morning">🌅 Morning (6AM-12PM)</option>
              <option value="afternoon">☀️ Afternoon (12PM-6PM)</option>
              <option value="evening">🌙 Evening (6PM-6AM)</option>
            </select>
          </div>

          {/* Bus Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bus type</label>
            <select
              value={filterByBusType}
              onChange={(e) => setFilterByBusType(e.target.value as any)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All types</option>
              <option value="Standard">🚌 Standard</option>
              <option value="AC Deluxe">❄️ AC Deluxe</option>
              <option value="VIP">⭐ VIP</option>
              <option value="Sleeper">🛏️ Sleeper</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bus Results */}
      <div className="space-y-4">
        {getFilteredBuses().map((bus) => (
          <div key={bus.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                {/* Bus Info */}
                <div className="lg:col-span-2">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{bus.company}</h3>
                      <p className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full inline-block">
                        {bus.busType}
                      </p>
                    </div>
                    <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                      <span className="text-yellow-500 text-lg">⭐</span>
                      <span className="text-sm font-medium text-gray-700 ml-1">{bus.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2">
                    {bus.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Time & Duration */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-4 mb-3">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-800">{bus.departureTime}</p>
                      <p className="text-sm text-gray-600 font-medium">{trip.from}</p>
                    </div>
                    
                    <div className="flex flex-col items-center px-4">
                      <p className="text-sm font-medium text-gray-700">{bus.duration}</p>
                      <div className="w-20 h-px bg-gray-400 my-2 relative">
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <p className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                        {bus.stops === 0 ? "🚀 Non-stop" : `${bus.stops} stop${bus.stops > 1 ? 's' : ''}`}
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-800">{bus.arrivalTime}</p>
                      <p className="text-sm text-gray-600 font-medium">{trip.to}</p>
                    </div>
                  </div>

                  {/* Stop Locations */}
                  {bus.stops > 0 && (
                    <p className="text-xs text-gray-500">
                      📍 via {bus.stopLocations.join(", ")}
                    </p>
                  )}
                </div>

                {/* Price & Book */}
                <div className="text-center lg:text-right">
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">from</p>
                    <p className="text-3xl font-bold text-green-600 mb-1">
                      {bus.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">FCFA per person</p>
                    <p className="text-xs text-orange-600 font-medium mt-1">
                      🔥 {bus.availableSeats} seats left
                    </p>
                  </div>

                  <button
                    onClick={() => handleSelectBus(bus)}
                    className="w-full lg:w-auto px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                  >
                    🎫 Select & Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {getFilteredBuses().length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No buses match your filters</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search criteria or clear some filters</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={clearAllFilters}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              🔄 Clear All Filters
            </button>
            <button
              onClick={goBackToSearch}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              🔍 New Search
            </button>
          </div>
        </div>
      )}
    </div>
  )
}