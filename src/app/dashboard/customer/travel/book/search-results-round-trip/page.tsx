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

interface SelectedBus {
  busId: string
  trip: TripData
  busDetails: BusResult
}

export default function RoundTripSearchResultsPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [currentStep, setCurrentStep] = useState<"outbound" | "return">("outbound")
  
  const [outboundTrip] = useState<TripData>({
    from: searchParams.get('from') || "",
    to: searchParams.get('to') || "",
    date: searchParams.get('date') || "",
    passengers: parseInt(searchParams.get('passengers') || "1")
  })

  const [returnTrip] = useState<TripData>({
    from: searchParams.get('to') || "", // Reversed for return
    to: searchParams.get('from') || "", // Reversed for return
    date: searchParams.get('returnDate') || "",
    passengers: parseInt(searchParams.get('passengers') || "1")
  })

  const [selectedOutboundBus, setSelectedOutboundBus] = useState<SelectedBus | null>(null)
  const [outboundBuses, setOutboundBuses] = useState<BusResult[]>([])
  const [returnBuses, setReturnBuses] = useState<BusResult[]>([])
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
        id: `bus-${currentStep}-${i + 1}`, // Different IDs for outbound/return
        company: companies[i % companies.length],
        busType: busTypes[i % busTypes.length],
        departureTime: `${departureHour.toString().padStart(2, '0')}:00`,
        arrivalTime: `${((departureHour + duration) % 24).toString().padStart(2, '0')}:00`,
        duration: `${duration}h ${Math.floor(Math.random() * 60)}m`,
        stops,
        stopLocations: stops > 0 ? [`${currentStep} Stop ${i + 1}`, `${currentStep} Stop ${i + 2}`].slice(0, stops) : [],
        price: Math.round(price),
        availableSeats: 15 + Math.floor(Math.random() * 25),
        amenities: amenities[i % amenities.length],
        rating: 3.5 + (Math.random() * 1.5)
      }
    })
  }

  useEffect(() => {
    console.log("🔄 Loading round-trip buses...")
    console.log("Outbound:", outboundTrip)
    console.log("Return:", returnTrip)
    
    const timer = setTimeout(() => {
      setOutboundBuses(generateMockBuses(outboundTrip))
      setReturnBuses(generateMockBuses(returnTrip))
      setLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const getCurrentBuses = () => {
    const buses = currentStep === "outbound" ? outboundBuses : returnBuses
    let filtered = buses

    // Apply filters (same logic as before)
    if (filterByStops !== "all") {
      if (filterByStops === "0") filtered = filtered.filter(bus => bus.stops === 0)
      else if (filterByStops === "1") filtered = filtered.filter(bus => bus.stops === 1)
      else if (filterByStops === "2+") filtered = filtered.filter(bus => bus.stops >= 2)
    }

    if (filterByTime !== "all") {
      filtered = filtered.filter(bus => {
        const hour = parseInt(bus.departureTime.split(':')[0])
        if (filterByTime === "morning") return hour >= 6 && hour < 12
        if (filterByTime === "afternoon") return hour >= 12 && hour < 18
        if (filterByTime === "evening") return hour >= 18 || hour < 6
        return true
      })
    }

    if (filterByBusType !== "all") {
      filtered = filtered.filter(bus => bus.busType === filterByBusType)
    }

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

  const getCurrentTrip = () => currentStep === "outbound" ? outboundTrip : returnTrip

  const handleSelectBus = (bus: BusResult) => {
    if (currentStep === "outbound") {
      console.log("✅ Outbound bus selected:", bus.id)
      setSelectedOutboundBus({
        busId: bus.id,
        trip: outboundTrip,
        busDetails: bus
      })
      setCurrentStep("return")
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      console.log("🔄 Return bus selected:", bus.id)
      
      // Save both buses to sessionStorage
      const outboundData = {
        busId: selectedOutboundBus!.busId,
        trip: selectedOutboundBus!.trip,
        busDetails: selectedOutboundBus!.busDetails
      }
      
      const returnData = {
        busId: bus.id,
        trip: returnTrip,
        busDetails: bus
      }
      
      sessionStorage.setItem('selectedOutbound', JSON.stringify(outboundData))
      sessionStorage.setItem('selectedReturn', JSON.stringify(returnData))
      
      console.log("💾 Saved outbound:", outboundData)
      console.log("💾 Saved return:", returnData)
      
      // Navigate to passenger details
      router.push(`/dashboard/customer/travel/passenger-details?type=round-trip`)
    }
  }

  const goBackToOutbound = () => {
    setCurrentStep("outbound")
    setSelectedOutboundBus(null)
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
          <p className="text-gray-600">🔄 Searching for round-trip buses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Round-Trip Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-700 text-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {currentStep === "outbound" ? "🚌 Select Outbound Bus" : "🔄 Select Return Bus"}
            </h1>
            <div className="text-green-100">
              <p className="text-lg font-medium">
                {getCurrentTrip().from} → {getCurrentTrip().to}
              </p>
              <p className="text-sm opacity-90">
                📅 {getCurrentTrip().date} • 👥 {getCurrentTrip().passengers} passenger(s)
              </p>
            </div>
          </div>
          
          <button
            onClick={goBackToSearch}
            className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition backdrop-blur border border-white/30"
          >
            ← Modify Search
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 text-sm mb-4">
          <div className="flex items-center text-white">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold">✓</div>
            <span className="ml-2 font-medium">Search</span>
          </div>
          <div className="w-8 h-px bg-white/40"></div>
          <div className="flex items-center text-yellow-300">
            <div className="w-6 h-6 rounded-full bg-yellow-300 text-black flex items-center justify-center text-xs font-bold">2</div>
            <span className="ml-2 font-medium">Select Buses</span>
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

        {/* Round-trip Sub-Progress */}
        <div className="flex items-center gap-4 pt-4 border-t border-white/20">
          <div className={`flex items-center ${currentStep === "outbound" ? "text-yellow-300" : "text-green-300"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
              currentStep === "outbound" ? "bg-yellow-300 text-black" : "bg-green-500 text-white"
            }`}>
              {selectedOutboundBus ? "✓" : "1"}
            </div>
            <span className="ml-2 font-medium">Outbound Journey</span>
          </div>
          
          <div className={`w-12 h-1 ${currentStep === "return" ? "bg-yellow-300" : "bg-white/30"}`}></div>
          
          <div className={`flex items-center ${currentStep === "return" ? "text-yellow-300" : "text-white/60"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
              currentStep === "return" ? "bg-yellow-300 text-black" : "bg-white/20 text-white"
            }`}>
              2
            </div>
            <span className="ml-2 font-medium">Return Journey</span>
          </div>
        </div>
      </div>

      {/* Selected Outbound Summary */}
      {currentStep === "return" && selectedOutboundBus && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 rounded-r-lg p-4 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-green-800 mb-2 flex items-center">
                <span className="text-green-600 mr-2">✅</span>
                Selected Outbound Bus
              </h3>
              <div className="text-sm text-green-700 space-y-1">
                <p><strong>{selectedOutboundBus.busDetails.company}</strong> - {selectedOutboundBus.busDetails.busType}</p>
                <p>🕐 {selectedOutboundBus.busDetails.departureTime} - {selectedOutboundBus.busDetails.arrivalTime}</p>
                <p>💰 {selectedOutboundBus.busDetails.price.toLocaleString()} FCFA per person</p>
              </div>
            </div>
            <button
              onClick={goBackToOutbound}
              className="text-sm text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Change Bus
            </button>
          </div>
        </div>
      )}

      {/* Rest of the UI - Filters and Bus Results (same as one-way) */}
      {/* ... Include the same filters and bus results sections ... */}
      
      {/* Bus Results */}
      <div className="space-y-4">
        {getCurrentBuses().map((bus) => (
          <div key={bus.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                {/* Bus card content - same structure as one-way */}
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
                    {currentStep === "outbound" ? "✅ Select Outbound" : "🎫 Select Return"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}