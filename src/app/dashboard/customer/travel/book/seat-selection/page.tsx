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

interface PassengerInfo {
  id: string
  title: "Mr" | "Mrs" | "Ms" | "Dr"
  firstName: string
  lastName: string
  dateOfBirth: string
  nationality: string
  idType: "passport" | "national-id" | "driver-license"
  idNumber: string
  phone: string
  email: string
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
}

interface ContactInfo {
  email: string
  phone: string
  alternatePhone?: string
  address: {
    street: string
    city: string
    country: string
  }
}

interface BookingData {
  tripType: "one-way" | "round-trip"
  selectedBus: SelectedBus
  passengers: PassengerInfo[]
  contactInfo: ContactInfo
  bookingId: string
  totalAmount: number
  createdAt: string
}

interface Seat {
  id: string
  number: string
  type: "window" | "aisle" | "middle"
  status: "available" | "occupied" | "selected" | "reserved"
  price: number
  position: {
    row: number
    column: number
  }
  features: string[]
}

export default function SeatSelectionPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const tripType = searchParams.get('type') as "one-way" | "round-trip" || "one-way"
  
  // State Management
  const [bookingData, setBookingData] = useState<BookingData | null>(null)
  const [seats, setSeats] = useState<Seat[]>([])
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [seatMapView, setSeatMapView] = useState<"2D" | "3D">("2D")

  // Bus layout configuration
  const busConfig = {
    totalSeats: 45,
    rows: 15,
    seatsPerRow: 3, // 2 left + 1 right (aisle in middle)
    layout: "2+1" // Premium bus layout
  }

  // Generate mock seat data
  const generateSeatMap = (busDetails: BusResult): Seat[] => {
    const seatTypes: Array<"window" | "aisle" | "middle"> = ["window", "aisle", "window"]
    const features = [
      ["Reclining", "Power Outlet"],
      ["Extra Legroom", "Power Outlet"], 
      ["Window View", "Reclining"],
      ["Premium Comfort", "Power Outlet", "WiFi"],
      ["Standard Comfort"]
    ]

    const seats: Seat[] = []
    let seatNumber = 1

    for (let row = 1; row <= busConfig.rows; row++) {
      for (let col = 1; col <= busConfig.seatsPerRow; col++) {
        // Skip middle column (aisle)
        if (col === 2) continue

        const seatId = `${busDetails.id}-seat-${seatNumber}`
        const isOccupied = Math.random() < 0.3 // 30% occupied
        const isReserved = Math.random() < 0.1 // 10% reserved
        
        let status: Seat['status'] = "available"
        if (isOccupied) status = "occupied"
        else if (isReserved) status = "reserved"

        // Premium seats (first 3 rows) cost more
        const seatPrice = row <= 3 
          ? busDetails.price * 1.2 
          : busDetails.price

        seats.push({
          id: seatId,
          number: seatNumber.toString().padStart(2, '0'),
          type: col === 1 ? "window" : col === 3 ? "window" : "aisle",
          status,
          price: Math.round(seatPrice),
          position: { row, column: col > 2 ? col - 1 : col },
          features: features[Math.floor(Math.random() * features.length)]
        })

        seatNumber++
      }
    }

    return seats
  }

  // Load booking data and generate seats
  useEffect(() => {
    const loadBookingData = () => {
      try {
        const bookingDataString = sessionStorage.getItem('bookingData')
        if (bookingDataString) {
          const parsedData = JSON.parse(bookingDataString) as BookingData
          setBookingData(parsedData)
          
          // Generate seat map
          const seatMap = generateSeatMap(parsedData.selectedBus.busDetails)
          setSeats(seatMap)
          
          console.log("✅ Loaded booking data:", parsedData)
          console.log("🎫 Generated seat map:", seatMap)
          setLoading(false)
        } else {
          console.error("❌ No booking data found")
          router.push('/dashboard/customer/travel/book')
        }
      } catch (error) {
        console.error("❌ Error loading booking data:", error)
        router.push('/dashboard/customer/travel/book')
      }
    }

    const timer = setTimeout(loadBookingData, 1000) // Simulate loading
    return () => clearTimeout(timer)
  }, [router])

  // Handle seat selection
  const handleSeatSelect = (seat: Seat) => {
    if (seat.status === "occupied" || seat.status === "reserved") {
      return // Can't select occupied/reserved seats
    }

    const isAlreadySelected = selectedSeats.some(s => s.id === seat.id)
    const requiredSeats = bookingData?.passengers.length || 1

    if (isAlreadySelected) {
      // Deselect seat
      setSelectedSeats(prev => prev.filter(s => s.id !== seat.id))
      setSeats(prev => prev.map(s => 
        s.id === seat.id ? { ...s, status: "available" } : s
      ))
    } else {
      // Select seat (if not at limit)
      if (selectedSeats.length < requiredSeats) {
        setSelectedSeats(prev => [...prev, seat])
        setSeats(prev => prev.map(s => 
          s.id === seat.id ? { ...s, status: "selected" } : s
        ))
      }
    }
  }

  // Calculate total cost
  const getTotalCost = () => {
    if (!bookingData) return 0
    const seatsCost = selectedSeats.reduce((sum, seat) => sum + seat.price, 0)
    return seatsCost
  }

  // Handle booking confirmation
  const handleConfirmBooking = async () => {
    if (!bookingData || selectedSeats.length !== bookingData.passengers.length) {
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare final booking data
      const finalBookingData = {
        ...bookingData,
        selectedSeats: selectedSeats.map(seat => ({
          seatId: seat.id,
          seatNumber: seat.number,
          price: seat.price,
          features: seat.features
        })),
        totalAmount: getTotalCost(),
        updatedAt: new Date().toISOString()
      }

      // Save final booking data
      sessionStorage.setItem('finalBookingData', JSON.stringify(finalBookingData))
      console.log("💾 Final booking data saved:", finalBookingData)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Navigate to payment
      router.push(`/dashboard/customer/travel/book/payment?type=${tripType}`)
      
    } catch (error) {
      console.error("❌ Error confirming booking:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get seat color class
  const getSeatColorClass = (seat: Seat) => {
    switch (seat.status) {
      case "available":
        return "bg-green-100 border-green-300 text-green-800 hover:bg-green-200 cursor-pointer"
      case "selected":
        return "bg-blue-500 border-blue-600 text-white cursor-pointer"
      case "occupied":
        return "bg-red-200 border-red-300 text-red-800 cursor-not-allowed"
      case "reserved":
        return "bg-yellow-200 border-yellow-300 text-yellow-800 cursor-not-allowed"
      default:
        return "bg-gray-200 border-gray-300 text-gray-600"
    }
  }

  if (loading || !bookingData) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">🎫 Loading seat selection...</p>
        </div>
      </div>
    )
  }

  const requiredSeats = bookingData.passengers.length
  const availableSeats = seats.filter(s => s.status === "available").length

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-700 text-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">🎫 Select Your Seats</h1>
            <div className="text-green-100">
              <p className="text-lg font-medium">
                {bookingData.selectedBus.trip.from} → {bookingData.selectedBus.trip.to}
              </p>
              <p className="text-sm opacity-90">
                🚌 {bookingData.selectedBus.busDetails.company} • {bookingData.selectedBus.busDetails.busType}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition backdrop-blur border border-white/30"
          >
            ← Back to Details
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center text-white">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold">✓</div>
            <span className="ml-2 font-medium">Search</span>
          </div>
          <div className="w-8 h-px bg-white/40"></div>
          <div className="flex items-center text-white">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold">✓</div>
            <span className="ml-2 font-medium">Select Bus</span>
          </div>
          <div className="w-8 h-px bg-white/40"></div>
          <div className="flex items-center text-white">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold">✓</div>
            <span className="ml-2 font-medium">Passenger Details</span>
          </div>
          <div className="w-8 h-px bg-white/40"></div>
          <div className="flex items-center text-yellow-300">
            <div className="w-6 h-6 rounded-full bg-yellow-300 text-black flex items-center justify-center text-xs font-bold">4</div>
            <span className="ml-2 font-medium">Seats</span>
          </div>
          <div className="w-8 h-px bg-white/40"></div>
          <div className="flex items-center text-white/60">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">5</div>
            <span className="ml-2 font-medium">Payment</span>
          </div>
        </div>
      </div>

      {/* Selection Summary */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{selectedSeats.length}</div>
            <div className="text-sm text-gray-600">Selected</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{requiredSeats}</div>
            <div className="text-sm text-gray-600">Required</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{availableSeats}</div>
            <div className="text-sm text-gray-600">Available</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{getTotalCost().toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total FCFA</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Seat Map */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">🚌 Bus Seat Map</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setSeatMapView("2D")}
                  className={`px-3 py-1 rounded text-sm font-medium transition ${
                    seatMapView === "2D" 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  2D View
                </button>
                <button
                  onClick={() => setSeatMapView("3D")}
                  className={`px-3 py-1 rounded text-sm font-medium transition ${
                    seatMapView === "3D" 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  3D View
                </button>
              </div>
            </div>

            {/* Driver Section */}
            <div className="mb-4 text-center">
              <div className="bg-gray-800 text-white px-4 py-2 rounded-lg inline-block">
                🚗 Driver
              </div>
            </div>

            {/* Seat Grid */}
            <div className="space-y-2">
              {Array.from({ length: busConfig.rows }, (_, rowIndex) => {
                const rowNumber = rowIndex + 1
                const rowSeats = seats.filter(seat => seat.position.row === rowNumber)
                
                return (
                  <div key={rowIndex} className="flex items-center justify-center gap-2">
                    {/* Row Number */}
                    <div className="w-8 text-center text-sm font-medium text-gray-500">
                      {rowNumber.toString().padStart(2, '0')}
                    </div>
                    
                    {/* Left Side Seats */}
                    <div className="flex gap-1">
                      {rowSeats
                        .filter(seat => seat.position.column === 1)
                        .map(seat => (
                          <button
                            key={seat.id}
                            onClick={() => handleSeatSelect(seat)}
                            className={`w-12 h-12 rounded-lg border-2 text-xs font-bold transition-all duration-200 ${getSeatColorClass(seat)}`}
                            disabled={seat.status === "occupied" || seat.status === "reserved"}
                            title={`Seat ${seat.number} - ${seat.type} - ${seat.features.join(", ")}`}
                          >
                            {seat.number}
                          </button>
                        ))}
                    </div>

                    {/* Aisle */}
                    <div className="w-8 text-center text-xs text-gray-400">
                      │
                    </div>

                    {/* Right Side Seat */}
                    <div className="flex gap-1">
                      {rowSeats
                        .filter(seat => seat.position.column === 2)
                        .map(seat => (
                          <button
                            key={seat.id}
                            onClick={() => handleSeatSelect(seat)}
                            className={`w-12 h-12 rounded-lg border-2 text-xs font-bold transition-all duration-200 ${getSeatColorClass(seat)}`}
                            disabled={seat.status === "occupied" || seat.status === "reserved"}
                            title={`Seat ${seat.number} - ${seat.type} - ${seat.features.join(", ")}`}
                          >
                            {seat.number}
                          </button>
                        ))}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 border border-blue-600 rounded"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-200 border border-red-300 rounded"></div>
                <span>Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-200 border border-yellow-300 rounded"></div>
                <span>Reserved</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selection Details */}
        <div className="space-y-6">
          {/* Selected Seats */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🎫 Selected Seats</h3>
            
            {selectedSeats.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No seats selected yet<br/>
                <span className="text-sm">Please select {requiredSeats} seat{requiredSeats > 1 ? 's' : ''}</span>
              </p>
            ) : (
              <div className="space-y-3">
                {selectedSeats.map((seat, index) => (
                  <div key={seat.id} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div>
                      <div className="font-medium text-blue-800">
                        Seat {seat.number}
                      </div>
                      <div className="text-sm text-blue-600">
                        {seat.type} • {seat.features.join(", ")}
                      </div>
                      <div className="text-xs text-blue-500">
                        For: {bookingData.passengers[index]?.firstName} {bookingData.passengers[index]?.lastName}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-800">
                        {seat.price.toLocaleString()}
                      </div>
                      <div className="text-xs text-blue-600">FCFA</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Booking Summary */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Booking Summary</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Base Price per seat</span>
                <span className="font-medium">{bookingData.selectedBus.busDetails.price.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Selected seats</span>
                <span className="font-medium">{selectedSeats.length} / {requiredSeats}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Seat charges</span>
                <span className="font-medium">{selectedSeats.reduce((sum, seat) => sum + seat.price, 0).toLocaleString()} FCFA</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total Amount</span>
                <span className="text-green-600">{getTotalCost().toLocaleString()} FCFA</span>
              </div>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirmBooking}
            disabled={selectedSeats.length !== requiredSeats || isSubmitting}
            className={`w-full py-4 rounded-lg font-medium transition-all duration-300 ${
              selectedSeats.length === requiredSeats && !isSubmitting
                ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing Booking...
              </div>
            ) : selectedSeats.length === requiredSeats ? (
              `💳 Proceed to Payment (${getTotalCost().toLocaleString()} FCFA)`
            ) : (
              `Select ${requiredSeats - selectedSeats.length} more seat${requiredSeats - selectedSeats.length > 1 ? 's' : ''}`
            )}
          </button>
        </div>
      </div>

      {/* Important Information */}
      <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-4">
        <div className="flex items-start">
          <div className="text-amber-500 text-xl mr-3">💡</div>
          <div>
            <h3 className="font-bold text-amber-800 mb-1">Seat Selection Tips</h3>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Window seats offer scenic views but limited aisle access</li>
              <li>• Premium seats (rows 1-3) offer extra comfort for a small fee</li>
              <li>• Seats are assigned based on selection order</li>
              <li>• You can change seat selection before payment</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}