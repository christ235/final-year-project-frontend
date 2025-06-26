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

interface BusDetails {
  id: string
  company: string
  busType: string
  departureTime: string
  arrivalTime: string
  duration: string
  price: number
  fareType?: string
}

interface SelectedBus {
  busId: string
  trip: TripData
  busDetails: BusDetails
  fareType?: string
}

interface PassengerInfo {
  id: string
  title: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  nationality: string
  idType: string
  idNumber: string
  email: string
  phone: string
  isMainPassenger: boolean
}

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  nationality: string
  idNumber: string
}

export default function PassengerDetailsPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const tripType = searchParams.get('type') as "one-way" | "round-trip" || "one-way"
  
  const [loading, setLoading] = useState(true)
  const [selectedOutbound, setSelectedOutbound] = useState<SelectedBus | null>(null)
  const [selectedReturn, setSelectedReturn] = useState<SelectedBus | null>(null)
  const [passengers, setPassengers] = useState<PassengerInfo[]>([])
  const [currentPassengerIndex, setCurrentPassengerIndex] = useState(0)
  const [totalPassengers, setTotalPassengers] = useState(1)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  // Mock user profile - in real app, get from auth context
  const [userProfile] = useState<UserProfile>({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    phone: "+235 70 123 456",
    dateOfBirth: "1990-05-15",
    nationality: "Chad",
    idNumber: "ID123456789"
  })

  useEffect(() => {
    // Load selected buses from session storage
    const timer = setTimeout(() => {
      const outbound = sessionStorage.getItem('selectedOutbound')
      const returnBus = sessionStorage.getItem('selectedReturn')
      
      if (outbound) {
        const outboundData = JSON.parse(outbound)
        setSelectedOutbound(outboundData)
        setTotalPassengers(outboundData.trip.passengers)
        
        // Initialize passengers array
        const passengersArray = Array.from({ length: outboundData.trip.passengers }, (_, i) => ({
          id: `passenger-${i + 1}`,
          title: "",
          firstName: "",
          lastName: "",
          dateOfBirth: "",
          gender: "",
          nationality: "Chad",
          idType: "national-id",
          idNumber: "",
          email: i === 0 ? userProfile.email : "",
          phone: i === 0 ? userProfile.phone : "",
          isMainPassenger: i === 0
        }))
        
        setPassengers(passengersArray)
      }
      
      if (returnBus) {
        setSelectedReturn(JSON.parse(returnBus))
      }
      
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  const handleInputChange = (field: string, value: string) => {
    const updatedPassengers = [...passengers]
    updatedPassengers[currentPassengerIndex] = {
      ...updatedPassengers[currentPassengerIndex],
      [field]: value
    }
    setPassengers(updatedPassengers)
    
    // Clear error for this field
    if (errors[`${currentPassengerIndex}-${field}`]) {
      const newErrors = { ...errors }
      delete newErrors[`${currentPassengerIndex}-${field}`]
      setErrors(newErrors)
    }
  }

  const fillMyDetails = () => {
    const updatedPassengers = [...passengers]
    updatedPassengers[currentPassengerIndex] = {
      ...updatedPassengers[currentPassengerIndex],
      title: "Mr",
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      dateOfBirth: userProfile.dateOfBirth,
      gender: "male",
      nationality: userProfile.nationality,
      idNumber: userProfile.idNumber,
      email: userProfile.email,
      phone: userProfile.phone
    }
    setPassengers(updatedPassengers)
  }

  const validateCurrentPassenger = () => {
    const passenger = passengers[currentPassengerIndex]
    const newErrors: {[key: string]: string} = {}
    
    const requiredFields = ['title', 'firstName', 'lastName', 'dateOfBirth', 'gender', 'nationality', 'idNumber']
    if (passenger.isMainPassenger) {
      requiredFields.push('email', 'phone')
    }
    
    requiredFields.forEach(field => {
      if (!passenger[field as keyof PassengerInfo]) {
        newErrors[`${currentPassengerIndex}-${field}`] = `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`
      }
    })
    
    // Email validation
    if (passenger.email && !/\S+@\S+\.\S+/.test(passenger.email)) {
      newErrors[`${currentPassengerIndex}-email`] = 'Please enter a valid email address'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const goToNextPassenger = () => {
    if (validateCurrentPassenger()) {
      if (currentPassengerIndex < totalPassengers - 1) {
        setCurrentPassengerIndex(currentPassengerIndex + 1)
      }
    }
  }

  const goToPreviousPassenger = () => {
    if (currentPassengerIndex > 0) {
      setCurrentPassengerIndex(currentPassengerIndex - 1)
    }
  }

  const handleContinue = () => {
    // Validate all passengers
    let allValid = true
    passengers.forEach((_, index) => {
      setCurrentPassengerIndex(index)
      if (!validateCurrentPassenger()) {
        allValid = false
      }
    })
    
    if (allValid) {
      // Save passenger data and continue to seat selection
      sessionStorage.setItem('passengerDetails', JSON.stringify(passengers))
      router.push(`/dashboard/customer/travel/seat-selection?type=${tripType}`)
    } else {
      alert("Please fill in all required information for all passengers")
    }
  }

  const goBackToSearch = () => {
    router.push("/dashboard/customer/travel/search-results")
  }

  const getTotalPrice = () => {
    let total = 0
    if (selectedOutbound) {
      total += selectedOutbound.busDetails.price * totalPassengers
    }
    if (selectedReturn) {
      total += selectedReturn.busDetails.price * totalPassengers
    }
    return total
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">👤 Preparing passenger form...</p>
        </div>
      </div>
    )
  }

  if (!selectedOutbound) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold text-red-800 mb-2">❌ No Booking Found</h2>
          <p className="text-red-600 mb-4">Please select your buses first</p>
          <button
            onClick={() => router.push("/dashboard/customer/travel/search")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            🔍 Start New Search
          </button>
        </div>
      </div>
    )
  }

  const currentPassenger = passengers[currentPassengerIndex]

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Ethiopian Airlines Style Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-700 text-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">👤 Passenger Details</h1>
            <div className="text-green-100">
              <p className="text-lg font-medium">
                Complete your {tripType === "one-way" ? "one-way" : "round-trip"} booking
              </p>
              <p className="text-sm opacity-90">
                Step 3 of 5 • {totalPassengers} passenger{totalPassengers > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          <button
            onClick={goBackToSearch}
            className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition backdrop-blur border border-white/30"
          >
            ← Back to Buses
          </button>
        </div>

        {/* Ethiopian Airlines Style Progress Bar */}
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center text-white">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold">✓</div>
            <span className="ml-2 font-medium">Search</span>
          </div>
          <div className="w-8 h-px bg-white/40"></div>
          <div className="flex items-center text-white">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold">✓</div>
            <span className="ml-2 font-medium">Select Buses</span>
          </div>
          <div className="w-8 h-px bg-white/40"></div>
          <div className="flex items-center text-yellow-300">
            <div className="w-6 h-6 rounded-full bg-yellow-300 text-black flex items-center justify-center text-xs font-bold">3</div>
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

      {/* Booking Summary */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Your Booking Summary</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Outbound */}
          <div className="border rounded-lg p-4 bg-blue-50">
            <h3 className="font-semibold text-blue-800 mb-2">
              🚌 {tripType === "round-trip" ? "Outbound Journey" : "Your Journey"}
            </h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>{selectedOutbound.busDetails.company}</strong> - {selectedOutbound.busDetails.busType}</p>
              <p>📍 {selectedOutbound.trip.from} → {selectedOutbound.trip.to}</p>
              <p>📅 {selectedOutbound.trip.date}</p>
              <p>🕐 {selectedOutbound.busDetails.departureTime} - {selectedOutbound.busDetails.arrivalTime}</p>
              <p>💰 {selectedOutbound.busDetails.price.toLocaleString()} FCFA × {totalPassengers}</p>
            </div>
          </div>

          {/* Return */}
          {tripType === "round-trip" && selectedReturn && (
            <div className="border rounded-lg p-4 bg-green-50">
              <h3 className="font-semibold text-green-800 mb-2">🔄 Return Journey</h3>
              <div className="text-sm text-green-700 space-y-1">
                <p><strong>{selectedReturn.busDetails.company}</strong> - {selectedReturn.busDetails.busType}</p>
                <p>📍 {selectedReturn.trip.from} → {selectedReturn.trip.to}</p>
                <p>📅 {selectedReturn.trip.date}</p>
                <p>🕐 {selectedReturn.busDetails.departureTime} - {selectedReturn.busDetails.arrivalTime}</p>
                <p>💰 {selectedReturn.busDetails.price.toLocaleString()} FCFA × {totalPassengers}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-800">Total Amount:</span>
            <span className="text-2xl font-bold text-green-600">{getTotalPrice().toLocaleString()} FCFA</span>
          </div>
        </div>
      </div>

      {/* Passenger Form */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        {/* Passenger Navigation */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            👤 Passenger {currentPassengerIndex + 1} of {totalPassengers}
            {currentPassenger?.isMainPassenger && (
              <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Main Passenger</span>
            )}
          </h2>
          
          <div className="flex items-center gap-2">
            {totalPassengers > 1 && (
              <>
                <button
                  onClick={goToPreviousPassenger}
                  disabled={currentPassengerIndex === 0}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded disabled:opacity-50"
                >
                  ← Previous
                </button>
                <span className="text-sm text-gray-500">
                  {currentPassengerIndex + 1} / {totalPassengers}
                </span>
                <button
                  onClick={goToNextPassenger}
                  disabled={currentPassengerIndex === totalPassengers - 1}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded disabled:opacity-50"
                >
                  Next →
                </button>
              </>
            )}
          </div>
        </div>

        {/* Auto-fill Button */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">✨ Quick Fill</h3>
              <p className="text-sm text-gray-600">
                {currentPassenger?.isMainPassenger ? 
                  "Use your profile information for this booking" : 
                  "Fill with your personal details"}
              </p>
            </div>
            <button
              onClick={fillMyDetails}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              👤 Use My Details
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <select
              value={currentPassenger?.title || ""}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors[`${currentPassengerIndex}-title`] ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select title</option>
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Ms">Ms</option>
              <option value="Dr">Dr</option>
            </select>
            {errors[`${currentPassengerIndex}-title`] && (
              <p className="text-red-500 text-xs mt-1">{errors[`${currentPassengerIndex}-title`]}</p>
            )}
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              value={currentPassenger?.firstName || ""}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors[`${currentPassengerIndex}-firstName`] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter first name"
            />
            {errors[`${currentPassengerIndex}-firstName`] && (
              <p className="text-red-500 text-xs mt-1">{errors[`${currentPassengerIndex}-firstName`]}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              value={currentPassenger?.lastName || ""}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors[`${currentPassengerIndex}-lastName`] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter last name"
            />
            {errors[`${currentPassengerIndex}-lastName`] && (
              <p className="text-red-500 text-xs mt-1">{errors[`${currentPassengerIndex}-lastName`]}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth *
            </label>
            <input
              type="date"
              value={currentPassenger?.dateOfBirth || ""}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors[`${currentPassengerIndex}-dateOfBirth`] ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors[`${currentPassengerIndex}-dateOfBirth`] && (
              <p className="text-red-500 text-xs mt-1">{errors[`${currentPassengerIndex}-dateOfBirth`]}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender *
            </label>
            <select
              value={currentPassenger?.gender || ""}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors[`${currentPassengerIndex}-gender`] ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors[`${currentPassengerIndex}-gender`] && (
              <p className="text-red-500 text-xs mt-1">{errors[`${currentPassengerIndex}-gender`]}</p>
            )}
          </div>

          {/* Nationality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nationality *
            </label>
            <select
              value={currentPassenger?.nationality || ""}
              onChange={(e) => handleInputChange('nationality', e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors[`${currentPassengerIndex}-nationality`] ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select nationality</option>
              <option value="Chad">Chad</option>
              <option value="Cameroon">Cameroon</option>
              <option value="Central African Republic">Central African Republic</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Sudan">Sudan</option>
              <option value="Other">Other</option>
            </select>
            {errors[`${currentPassengerIndex}-nationality`] && (
              <p className="text-red-500 text-xs mt-1">{errors[`${currentPassengerIndex}-nationality`]}</p>
            )}
          </div>

          {/* ID Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Type *
            </label>
            <select
              value={currentPassenger?.idType || ""}
              onChange={(e) => handleInputChange('idType', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="national-id">National ID</option>
              <option value="passport">Passport</option>
              <option value="driver-license">Driver's License</option>
            </select>
          </div>

          {/* ID Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Number *
            </label>
            <input
              type="text"
              value={currentPassenger?.idNumber || ""}
              onChange={(e) => handleInputChange('idNumber', e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors[`${currentPassengerIndex}-idNumber`] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter ID number"
            />
            {errors[`${currentPassengerIndex}-idNumber`] && (
              <p className="text-red-500 text-xs mt-1">{errors[`${currentPassengerIndex}-idNumber`]}</p>
            )}
          </div>

          {/* Email (Main passenger only) */}
          {currentPassenger?.isMainPassenger && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={currentPassenger?.email || ""}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors[`${currentPassengerIndex}-email`] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter email address"
              />
              {errors[`${currentPassengerIndex}-email`] && (
                <p className="text-red-500 text-xs mt-1">{errors[`${currentPassengerIndex}-email`]}</p>
              )}
            </div>
          )}

          {/* Phone (Main passenger only) */}
          {currentPassenger?.isMainPassenger && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={currentPassenger?.phone || ""}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors[`${currentPassengerIndex}-phone`] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter phone number"
              />
              {errors[`${currentPassengerIndex}-phone`] && (
                <p className="text-red-500 text-xs mt-1">{errors[`${currentPassengerIndex}-phone`]}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={goBackToSearch}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          ← Back to Buses
        </button>
        
        <div className="flex gap-4">
          {totalPassengers > 1 && currentPassengerIndex < totalPassengers - 1 && (
            <button
              onClick={goToNextPassenger}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Next Passenger →
            </button>
          )}
          
          {currentPassengerIndex === totalPassengers - 1 && (
            <button
              onClick={handleContinue}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition font-medium shadow-lg"
            >
              🪑 Continue to Seat Selection
            </button>
          )}
        </div>
      </div>
    </div>
  )
}