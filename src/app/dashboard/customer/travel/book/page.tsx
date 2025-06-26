"use client"

import { useState, ChangeEvent, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/i18n"

const cities = ["N'Djamena", "Moundou", "Sarh", "Abéché", "Bongor"]

interface TripData {
  from: string
  to: string
  date: string
  passengers: number
}

export default function BookTicketPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [tripType, setTripType] = useState<"one-way" | "round-trip">("one-way")
  const [currentStep, setCurrentStep] = useState<"outbound" | "return">("outbound")
  
  const [outboundTrip, setOutboundTrip] = useState<TripData>({
    from: "",
    to: "",
    date: "",
    passengers: 1
  })

  const [returnTrip, setReturnTrip] = useState<TripData>({
    from: "",
    to: "",
    date: "",
    passengers: 1
  })

  // Filter cities to exclude the selected "from" city
  const getAvailableToCities = (fromCity: string) => {
    return cities.filter(city => city !== fromCity)
  }

  // Filter cities to exclude the selected "to" city
  const getAvailableFromCities = (toCity: string) => {
    return cities.filter(city => city !== toCity)
  }

  const handleTripTypeChange = (type: "one-way" | "round-trip") => {
    setTripType(type)
    setCurrentStep("outbound")
    
    // If switching to round-trip, auto-fill return trip
    if (type === "round-trip" && outboundTrip.from && outboundTrip.to) {
      setReturnTrip({
        ...returnTrip,
        from: outboundTrip.to,
        to: outboundTrip.from,
        passengers: outboundTrip.passengers
      })
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const processedValue = name === 'passengers' ? parseInt(value) || 1 : value

    if (currentStep === "outbound") {
      const newOutbound = { ...outboundTrip, [name]: processedValue }
      
      // If changing "from" and "to" is the same, clear "to"
      if (name === "from" && value === outboundTrip.to) {
        newOutbound.to = ""
      }
      
      // If changing "to" and "from" is the same, clear "from"
      if (name === "to" && value === outboundTrip.from) {
        newOutbound.from = ""
      }
      
      setOutboundTrip(newOutbound)
      
      // Auto-update return trip cities and passengers for round-trip
      if (tripType === "round-trip") {
        if (name === "from") {
          setReturnTrip(prev => ({ ...prev, to: processedValue as string }))
        } else if (name === "to") {
          setReturnTrip(prev => ({ ...prev, from: processedValue as string }))
        } else if (name === "passengers") {
          setReturnTrip(prev => ({ ...prev, passengers: processedValue as number }))
        }
      }
    } else {
      const newReturn = { ...returnTrip, [name]: processedValue }
      
      // If changing "from" and "to" is the same, clear "to"
      if (name === "from" && value === returnTrip.to) {
        newReturn.to = ""
      }
      
      // If changing "to" and "from" is the same, clear "from"
      if (name === "to" && value === returnTrip.from) {
        newReturn.from = ""
      }
      
      setReturnTrip(newReturn)
    }
  }

  const handleSubmitOutbound = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (tripType === "one-way") {
      console.log("One-way trip:", outboundTrip)
      router.push("/dashboard/customer/travel/book/search-results-one-way")
    } else {
      // Move to return trip step
      setCurrentStep("return")
    }
  }

  const handleSubmitReturn = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("Round-trip booking:", { outbound: outboundTrip, return: returnTrip })
    router.push("/dashboard/customer/travel/book/search-results")
  }

  const goBackToOutbound = () => {
    setCurrentStep("outbound")
  }

  const getCurrentTripData = () => currentStep === "outbound" ? outboundTrip : returnTrip
  const getCurrentSubmitHandler = () => currentStep === "outbound" ? handleSubmitOutbound : handleSubmitReturn

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header with Progress */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Book a Ticket</h1>
        
        {/* Trip Type Toggle */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => handleTripTypeChange("one-way")}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              tripType === "one-way" 
                ? "bg-blue-600 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            One Way
          </button>
          <button
            type="button"
            onClick={() => handleTripTypeChange("round-trip")}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              tripType === "round-trip" 
                ? "bg-blue-600 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Round Trip
          </button>
        </div>

        {/* Progress Indicator for Round Trip */}
        {tripType === "round-trip" && (
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className={`flex items-center ${currentStep === "outbound" ? "text-blue-600" : "text-green-600"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                currentStep === "outbound" ? "bg-blue-600" : "bg-green-600"
              }`}>
                1
              </div>
              <span className="ml-2 font-medium">Outbound Trip</span>
            </div>
            
            <div className={`w-12 h-1 ${currentStep === "return" ? "bg-blue-600" : "bg-gray-300"}`}></div>
            
            <div className={`flex items-center ${currentStep === "return" ? "text-blue-600" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                currentStep === "return" ? "bg-blue-600" : "bg-gray-300"
              }`}>
                2
              </div>
              <span className="ml-2 font-medium">Return Trip</span>
            </div>
          </div>
        )}
      </div>

      {/* Current Trip Form */}
      <form
        onSubmit={getCurrentSubmitHandler()}
        className="bg-white rounded-xl shadow p-6 space-y-4"
      >
        {/* Step Title */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {currentStep === "outbound" ? "🚌 Outbound Journey" : "🚌 Return Journey"}
          </h2>
          {currentStep === "return" && (
            <p className="text-sm text-gray-600 mt-1">
              From {outboundTrip.to} back to {outboundTrip.from}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">From</label>
            <select
              name="from"
              value={getCurrentTripData().from}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select departure city</option>
              {getAvailableFromCities(getCurrentTripData().to).map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">To</label>
            <select
              name="to"
              value={getCurrentTripData().to}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={!getCurrentTripData().from} // Disable until "from" is selected
            >
              <option value="">
                {getCurrentTripData().from ? "Select destination city" : "Select departure city first"}
              </option>
              {getCurrentTripData().from && getAvailableToCities(getCurrentTripData().from).map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">
              {currentStep === "outbound" ? "Departure Date" : "Return Date"}
            </label>
            <input
              type="date"
              name="date"
              value={getCurrentTripData().date}
              onChange={handleInputChange}
              min={currentStep === "return" ? outboundTrip.date : new Date().toISOString().split('T')[0]}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Passengers</label>
            <input
              type="number"
              name="passengers"
              min={1}
              max={10}
              value={getCurrentTripData().passengers}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-between pt-4">
          {currentStep === "return" && (
            <button
              type="button"
              onClick={goBackToOutbound}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              ← Back to Outbound
            </button>
          )}
          
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ml-auto"
          >
            {currentStep === "outbound" 
              ? (tripType === "one-way" ? "Search Buses" : "Continue to Return →")
              : "Search Return Buses"
            }
          </button>
        </div>
      </form>

      {/* Trip Summary for Round Trip */}
      {tripType === "round-trip" && currentStep === "return" && (
        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 mb-2">📋 Trip Summary</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Outbound:</strong> {outboundTrip.from} → {outboundTrip.to} on {outboundTrip.date}</p>
            <p><strong>Passengers:</strong> {outboundTrip.passengers}</p>
          </div>
        </div>
      )}
    </div>
  )
}