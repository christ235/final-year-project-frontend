"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTranslation } from "@/i18n"

interface PaymentMethod {
  id: string
  name: string
  type: "mobile_money" | "bank_card" | "bank_transfer" | "crypto" | "cash"
  icon: string
  description: string
  fees: {
    percentage: number
    fixed: number
    min: number
    max: number
  }
  processingTime: string
  availability: "available" | "coming_soon" | "maintenance"
  supportedCurrencies: string[]
  requirements: string[]
}

interface PaymentData {
  paymentId: string
  amount: number
  currency: string
  fees: number
  totalAmount: number
  method: PaymentMethod
  status: "pending" | "processing" | "completed" | "failed" | "cancelled"
  reference: string
  transactionId?: string
  bookingReference: string
  customerInfo: {
    name: string
    email: string
    phone: string
  }
  createdAt: string
  updatedAt: string
}

interface BookingData {
  tripType: "one-way" | "round-trip"
  selectedBus: any
  selectedReturn?: any
  passengers: any[]
  contactInfo: any
  selectedSeats?: any[]
  bookingId: string
  totalAmount: number
  createdAt: string
}

interface TicketDeliveryPreference {
  method: "email" | "sms" | "both"
  email?: string
  phone?: string
}

interface BookingOption {
  type: "pay_now" | "book_now_pay_later"
  selected: boolean
}

export default function PaymentPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const tripType = searchParams.get('type') as "one-way" | "round-trip" || "one-way"
  const activityType = searchParams.get('activity') || "travel"
  
  // State Management
  const [loading, setLoading] = useState(true)
  const [bookingData, setBookingData] = useState<BookingData | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null)
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState<"method" | "details" | "confirmation" | "processing" | "success" | "failed" | "booking_success">("method")
  const [paymentDetails, setPaymentDetails] = useState<any>({})
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  // New state for booking options and ticket delivery
  const [bookingOption, setBookingOption] = useState<BookingOption["type"]>("pay_now")
  const [showDeliveryModal, setShowDeliveryModal] = useState(false)
  const [ticketDelivery, setTicketDelivery] = useState<TicketDeliveryPreference>({
    method: "email",
    email: "",
    phone: ""
  })
  const [paymentDeadline, setPaymentDeadline] = useState<Date | null>(null)

  // Payment Methods Configuration
  const paymentMethods: PaymentMethod[] = [
    {
      id: "airtel_money",
      name: "Airtel Money",
      type: "mobile_money",
      icon: "📱",
      description: "Pay securely with Airtel Money mobile wallet",
      fees: { percentage: 1.5, fixed: 0, min: 100, max: 2000 },
      processingTime: "Instant",
      availability: "available",
      supportedCurrencies: ["FCFA", "USD"],
      requirements: ["Valid Airtel Money account", "Sufficient balance", "Phone verification"]
    },
    {
      id: "moov_money",
      name: "Moov Money",
      type: "mobile_money",
      icon: "💰",
      description: "Quick payment with Moov Money wallet",
      fees: { percentage: 1.8, fixed: 0, min: 150, max: 2500 },
      processingTime: "Instant",
      availability: "available",
      supportedCurrencies: ["FCFA"],
      requirements: ["Active Moov Money account", "PIN verification"]
    },
    {
      id: "visa_mastercard",
      name: "Visa/Mastercard",
      type: "bank_card",
      icon: "💳",
      description: "International credit/debit cards",
      fees: { percentage: 2.5, fixed: 500, min: 500, max: 5000 },
      processingTime: "1-3 minutes",
      availability: "available",
      supportedCurrencies: ["FCFA", "USD", "EUR"],
      requirements: ["Valid card", "3D Secure enabled", "International payments enabled"]
    },
    {
      id: "bank_transfer",
      name: "Bank Transfer",
      type: "bank_transfer",
      icon: "🏦",
      description: "Direct bank transfer (BCEAO/BEAC)",
      fees: { percentage: 0.5, fixed: 1000, min: 1000, max: 3000 },
      processingTime: "1-24 hours",
      availability: "available",
      supportedCurrencies: ["FCFA"],
      requirements: ["Bank account", "Account verification", "Transfer reference"]
    },
    {
      id: "orange_money",
      name: "Orange Money",
      type: "mobile_money",
      icon: "🧡",
      description: "Orange Money mobile payment",
      fees: { percentage: 1.2, fixed: 0, min: 100, max: 1500 },
      processingTime: "Instant",
      availability: "coming_soon",
      supportedCurrencies: ["FCFA"],
      requirements: ["Orange Money account", "Account activation"]
    },
    {
      id: "crypto",
      name: "Cryptocurrency",
      type: "crypto",
      icon: "₿",
      description: "Bitcoin, USDT, and other cryptocurrencies",
      fees: { percentage: 1.0, fixed: 0, min: 0, max: 1000 },
      processingTime: "5-30 minutes",
      availability: "coming_soon",
      supportedCurrencies: ["BTC", "USDT", "ETH"],
      requirements: ["Crypto wallet", "Network fees apply"]
    },
    {
      id: "cash_payment",
      name: "Cash Payment",
      type: "cash",
      icon: "💵",
      description: "Pay in cash at our offices or partner locations",
      fees: { percentage: 0, fixed: 0, min: 0, max: 0 },
      processingTime: "Immediate",
      availability: "available",
      supportedCurrencies: ["FCFA"],
      requirements: ["Valid ID", "Booking reference", "Payment within 24 hours"]
    }
  ]

  // Load booking data
  useEffect(() => {
    const loadBookingData = () => {
      try {
        let bookingDataString: string | null = null
        
        if (activityType === "travel") {
          bookingDataString = sessionStorage.getItem('finalBookingData') || 
                             sessionStorage.getItem('bookingData')
        } else {
          bookingDataString = sessionStorage.getItem(`${activityType}BookingData`)
        }

        if (bookingDataString) {
          const parsedData = JSON.parse(bookingDataString) as BookingData
          setBookingData(parsedData)
          console.log("✅ Loaded booking data:", parsedData)
        } else {
          console.error("❌ No booking data found")
          router.push('/dashboard/customer')
        }
      } catch (error) {
        console.error("❌ Error loading booking data:", error)
        router.push('/dashboard/customer')
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(loadBookingData, 1000)
    return () => clearTimeout(timer)
  }, [router, activityType])

  // Calculate payment fees
  const calculateFees = (amount: number, method: PaymentMethod) => {
    const percentageFee = (amount * method.fees.percentage) / 100
    const totalFee = Math.max(
      Math.min(percentageFee + method.fees.fixed, method.fees.max),
      method.fees.min
    )
    return Math.round(totalFee)
  }

  // Handle booking without payment (SCENARIO 2)
  const handleBookingWithoutPayment = async () => {
    if (!bookingData) return

    setIsProcessing(true)
    setCurrentStep("processing")

    try {
      // Calculate payment deadline (48 hours from now)
      const deadline = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      setPaymentDeadline(deadline)

      // Create pending booking
      const pendingBooking = {
        ...bookingData,
        status: "pending_payment",
        paymentDeadline: deadline.toISOString(),
        remindersSent: [],
        createdAt: new Date().toISOString()
      }

      // Save to sessionStorage (simulate API call)
      sessionStorage.setItem('pendingBooking', JSON.stringify(pendingBooking))
      
      // Simulate API call to create booking
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Show booking success without payment
      setCurrentStep("booking_success")
      console.log("📋 Booking created without payment:", pendingBooking)

    } catch (error) {
      console.error("❌ Error creating booking:", error)
      setCurrentStep("failed")
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle payment method selection
  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    if (method.availability !== "available") return
    
    setSelectedPaymentMethod(method)
    const fees = calculateFees(bookingData?.totalAmount || 0, method)
    
    const payment: PaymentData = {
      paymentId: `PAY-${Date.now()}`,
      amount: bookingData?.totalAmount || 0,
      currency: "FCFA",
      fees,
      totalAmount: (bookingData?.totalAmount || 0) + fees,
      method,
      status: "pending",
      reference: `REF-${Date.now()}`,
      bookingReference: bookingData?.bookingId || "",
      customerInfo: {
        name: `${bookingData?.passengers[0]?.firstName} ${bookingData?.passengers[0]?.lastName}`,
        email: bookingData?.contactInfo?.email || "",
        phone: bookingData?.contactInfo?.phone || ""
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    setPaymentData(payment)
    setCurrentStep("details")
  }

  // Handle payment details submission
  const handlePaymentDetailsSubmit = async () => {
    if (!selectedPaymentMethod || !paymentData) return

    const validationErrors = validatePaymentDetails()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setCurrentStep("confirmation")
  }

  // Validate payment details
  const validatePaymentDetails = () => {
    const errors: {[key: string]: string} = {}
    
    if (!selectedPaymentMethod) return errors

    switch (selectedPaymentMethod.type) {
      case "mobile_money":
        if (!paymentDetails.phoneNumber) {
          errors.phoneNumber = "Phone number is required"
        } else if (!/^\+?[0-9]{8,15}$/.test(paymentDetails.phoneNumber)) {
          errors.phoneNumber = "Please enter a valid phone number"
        }
        break
        
      case "bank_card":
        if (!paymentDetails.cardNumber) errors.cardNumber = "Card number is required"
        if (!paymentDetails.expiryDate) errors.expiryDate = "Expiry date is required"
        if (!paymentDetails.cvv) errors.cvv = "CVV is required"
        if (!paymentDetails.cardholderName) errors.cardholderName = "Cardholder name is required"
        break
        
      case "bank_transfer":
        if (!paymentDetails.bankName) errors.bankName = "Bank name is required"
        if (!paymentDetails.accountNumber) errors.accountNumber = "Account number is required"
        break
        
      case "cash":
        if (!paymentDetails.paymentLocation) errors.paymentLocation = "Payment location is required"
        break
    }
    
    return errors
  }

  // Show ticket delivery modal (SCENARIO 1)
  const showTicketDeliveryModal = (): Promise<TicketDeliveryPreference> => {
    return new Promise((resolve) => {
      setTicketDelivery({
        method: "email",
        email: bookingData?.contactInfo?.email || "",
        phone: bookingData?.contactInfo?.phone || ""
      })
      setShowDeliveryModal(true)
      
      // Store resolve function
      ;(window as any).ticketDeliveryResolve = resolve
    })
  }

  const handleTicketDeliveryConfirm = () => {
    setShowDeliveryModal(false)
    if ((window as any).ticketDeliveryResolve) {
      ;(window as any).ticketDeliveryResolve(ticketDelivery)
      delete (window as any).ticketDeliveryResolve
    }
  }

  // Process payment (SCENARIO 1)
  const processPayment = async () => {
    if (!paymentData || !selectedPaymentMethod) return

    setIsProcessing(true)
    setCurrentStep("processing")

    try {
      // Update payment status
      const updatedPayment = {
        ...paymentData,
        status: "processing" as const,
        transactionId: `TXN-${Date.now()}`,
        updatedAt: new Date().toISOString()
      }
      setPaymentData(updatedPayment)

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Simulate success/failure (90% success rate)
      const isSuccess = Math.random() > 0.1

      if (isSuccess) {
        const completedPayment = {
          ...updatedPayment,
          status: "completed" as const,
          updatedAt: new Date().toISOString()
        }
        setPaymentData(completedPayment)
        
        // Save payment data
        sessionStorage.setItem('paymentData', JSON.stringify(completedPayment))
        sessionStorage.setItem('completedBooking', JSON.stringify({
          ...bookingData,
          paymentData: completedPayment,
          status: "confirmed"
        }))

        setCurrentStep("success")

        // SCENARIO 1: Show ticket delivery options
        try {
          const deliveryPreference = await showTicketDeliveryModal()
          console.log("🎫 Sending ticket via:", deliveryPreference.method)
          
          // Here you would call your API to send the ticket
          // await sendTicketToCustomer(completedPayment.bookingReference, deliveryPreference)
          
        } catch (error) {
          console.error("Error with ticket delivery:", error)
        }
        
        // Auto-redirect after 8 seconds (more time for ticket selection)
        setTimeout(() => {
          router.push(`/dashboard/customer/bookings/${bookingData?.bookingId}`)
        }, 8000)
        
      } else {
        const failedPayment = {
          ...updatedPayment,
          status: "failed" as const,
          updatedAt: new Date().toISOString()
        }
        setPaymentData(failedPayment)
        setCurrentStep("failed")
      }
      
    } catch (error) {
      console.error("❌ Payment processing error:", error)
      setCurrentStep("failed")
    } finally {
      setIsProcessing(false)
    }
  }

  // Render payment method details form
  const renderPaymentDetailsForm = () => {
    if (!selectedPaymentMethod) return null

    switch (selectedPaymentMethod.type) {
      case "mobile_money":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {selectedPaymentMethod.name} Phone Number *
              </label>
              <input
                type="tel"
                value={paymentDetails.phoneNumber || ""}
                onChange={(e) => setPaymentDetails({...paymentDetails, phoneNumber: e.target.value})}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+235 XX XX XX XX"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
              )}
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Payment Instructions:</h4>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal ml-4">
                <li>You'll receive a payment prompt on your phone</li>
                <li>Enter your {selectedPaymentMethod.name} PIN</li>
                <li>Confirm the transaction amount</li>
                <li>Payment will be processed instantly</li>
              </ol>
            </div>
          </div>
        )

      case "bank_card":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name *
              </label>
              <input
                type="text"
                value={paymentDetails.cardholderName || ""}
                onChange={(e) => setPaymentDetails({...paymentDetails, cardholderName: e.target.value})}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.cardholderName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Name as on card"
              />
              {errors.cardholderName && (
                <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number *
              </label>
              <input
                type="text"
                value={paymentDetails.cardNumber || ""}
                onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
              {errors.cardNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="text"
                  value={paymentDetails.expiryDate || ""}
                  onChange={(e) => setPaymentDetails({...paymentDetails, expiryDate: e.target.value})}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="MM/YY"
                  maxLength={5}
                />
                {errors.expiryDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV *
                </label>
                <input
                  type="text"
                  value={paymentDetails.cvv || ""}
                  onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value})}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.cvv ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="123"
                  maxLength={4}
                />
                {errors.cvv && (
                  <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
                )}
              </div>
            </div>
          </div>
        )

      case "bank_transfer":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Bank *
              </label>
              <select
                value={paymentDetails.bankName || ""}
                onChange={(e) => setPaymentDetails({...paymentDetails, bankName: e.target.value})}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.bankName ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select your bank</option>
                <option value="BCEAO">BCEAO</option>
                <option value="BEAC">BEAC</option>
                <option value="Commercial Bank Chad">Commercial Bank Chad</option>
                <option value="Ecobank">Ecobank</option>
                <option value="UBA">UBA</option>
              </select>
              {errors.bankName && (
                <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Number *
              </label>
              <input
                type="text"
                value={paymentDetails.accountNumber || ""}
                onChange={(e) => setPaymentDetails({...paymentDetails, accountNumber: e.target.value})}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.accountNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Your account number"
              />
              {errors.accountNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>
              )}
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-medium text-orange-800 mb-2">Transfer Details:</h4>
              <div className="text-sm text-orange-700 space-y-1">
                <p><strong>Bank:</strong> Commercial Bank Chad</p>
                <p><strong>Account Name:</strong> Chad Bus Booking Platform</p>
                <p><strong>Account Number:</strong> 1234567890</p>
                <p><strong>Reference:</strong> {paymentData?.reference}</p>
                <p><strong>Amount:</strong> {paymentData?.totalAmount.toLocaleString()} FCFA</p>
              </div>
            </div>
          </div>
        )

      case "cash":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Location *
              </label>
              <select
                value={paymentDetails.paymentLocation || ""}
                onChange={(e) => setPaymentDetails({...paymentDetails, paymentLocation: e.target.value})}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.paymentLocation ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select payment location</option>
                <option value="N'Djamena Office">N'Djamena Main Office</option>
                <option value="Moundou Office">Moundou Branch</option>
                <option value="Sarh Office">Sarh Branch</option>
                <option value="Abéché Office">Abéché Branch</option>
              </select>
              {errors.paymentLocation && (
                <p className="text-red-500 text-xs mt-1">{errors.paymentLocation}</p>
              )}
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Important Notes:</h4>
              <ul className="text-sm text-yellow-700 space-y-1 list-disc ml-4">
                <li>Payment must be made within 24 hours</li>
                <li>Bring a valid ID and booking reference</li>
                <li>Office hours: 8:00 AM - 6:00 PM</li>
                <li>Receipt will be provided upon payment</li>
              </ul>
            </div>
          </div>
        )

      default:
        return <div>Payment method not supported yet.</div>
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">💳 Loading payment options...</p>
        </div>
      </div>
    )
  }

  if (!bookingData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold text-red-800 mb-2">❌ No Booking Found</h2>
          <p className="text-red-600 mb-4">Please complete your booking first</p>
          <button
            onClick={() => router.push('/dashboard/customer')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            🏠 Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">💳 Secure Payment</h1>
            <div className="text-blue-100">
              <p className="text-lg font-medium">Complete your {activityType} booking</p>
              <p className="text-sm opacity-90">
                Booking Reference: {bookingData.bookingId}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition backdrop-blur border border-white/30"
          >
            ← Back
          </button>
        </div>

        {/* Progress Bar */}
        {activityType === "travel" && (
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
            <div className="flex items-center text-white">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold">✓</div>
              <span className="ml-2 font-medium">Seats</span>
            </div>
            <div className="w-8 h-px bg-white/40"></div>
            <div className="flex items-center text-yellow-300">
              <div className="w-6 h-6 rounded-full bg-yellow-300 text-black flex items-center justify-center text-xs font-bold">5</div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
          </div>
        )}
      </div>

      {/* Payment Steps */}
      {currentStep === "method" && (
        <>
          {/* Booking Summary */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Payment Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Service</span>
                <span className="font-medium">{activityType.charAt(0).toUpperCase() + activityType.slice(1)} Booking</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Booking ID</span>
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{bookingData.bookingId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount</span>
                <span className="font-medium">{bookingData.totalAmount.toLocaleString()} FCFA</span>
              </div>
              <div className="border-t pt-3 flex justify-between items-center text-lg font-bold">
                <span>Total to Pay</span>
                <span className="text-blue-600">{bookingData.totalAmount.toLocaleString()} FCFA</span>
              </div>
            </div>
          </div>

          {/* Booking Options Selection */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">🎯 Choose Your Booking Option</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Pay Now Option */}
              <button
                onClick={() => setBookingOption("pay_now")}
                className={`p-6 border-2 rounded-xl text-left transition-all duration-200 ${
                  bookingOption === "pay_now"
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">💳</span>
                    <div>
                      <h3 className="font-bold text-gray-800">Pay Now</h3>
                      <p className="text-sm text-gray-600">Complete payment immediately</p>
                    </div>
                  </div>
                  {bookingOption === "pay_now" && (
                    <span className="text-blue-500 text-xl">✓</span>
                  )}
                </div>
                
                <div className="text-sm text-gray-700">
                  <div className="flex items-center text-green-600 mb-1">
                    <span className="mr-2">✅</span>
                    <span>Instant booking confirmation</span>
                  </div>
                  <div className="flex items-center text-green-600 mb-1">
                    <span className="mr-2">🎫</span>
                    <span>Immediate ticket delivery</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <span className="mr-2">🔒</span>
                    <span>Guaranteed seat reservation</span>
                  </div>
                </div>
              </button>

              {/* Book Now, Pay Later Option */}
              <button
                onClick={() => setBookingOption("book_now_pay_later")}
                className={`p-6 border-2 rounded-xl text-left transition-all duration-200 ${
                  bookingOption === "book_now_pay_later"
                    ? "border-orange-500 bg-orange-50 shadow-md"
                    : "border-gray-200 hover:border-orange-300"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">📋</span>
                    <div>
                      <h3 className="font-bold text-gray-800">Book Now, Pay Later</h3>
                      <p className="text-sm text-gray-600">Reserve now, pay within 48 hours</p>
                    </div>
                  </div>
                  {bookingOption === "book_now_pay_later" && (
                    <span className="text-orange-500 text-xl">✓</span>
                  )}
                </div>
                
                <div className="text-sm text-gray-700">
                  <div className="flex items-center text-blue-600 mb-1">
                    <span className="mr-2">⏰</span>
                    <span>48 hours to complete payment</span>
                  </div>
                  <div className="flex items-center text-blue-600 mb-1">
                    <span className="mr-2">📧</span>
                    <span>Email & SMS reminders</span>
                  </div>
                  <div className="flex items-center text-orange-600">
                    <span className="mr-2">⚠️</span>
                    <span>Auto-cancel if not paid in time</span>
                  </div>
                </div>
              </button>
            </div>

            {/* Proceed Button */}
            <div className="text-center">
              {bookingOption === "pay_now" ? (
                <p className="text-gray-600 text-sm">Select a payment method below to continue</p>
              ) : (
                <button
                  onClick={handleBookingWithoutPayment}
                  disabled={isProcessing}
                  className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition font-medium shadow-lg"
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Booking...
                    </div>
                  ) : (
                    "📋 Create Booking (Pay Later)"
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Payment Methods - Only show if "pay_now" is selected */}
          {bookingOption === "pay_now" && (
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">💳 Choose Payment Method</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => {
                  const fees = calculateFees(bookingData.totalAmount, method)
                  const totalWithFees = bookingData.totalAmount + fees
                  
                  return (
                    <button
                      key={method.id}
                      onClick={() => handlePaymentMethodSelect(method)}
                      disabled={method.availability !== "available"}
                      className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                        method.availability === "available"
                          ? "border-gray-200 hover:border-blue-500 hover:shadow-md cursor-pointer"
                          : "border-gray-100 bg-gray-50 cursor-not-allowed opacity-60"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{method.icon}</span>
                          <div>
                            <h3 className="font-semibold text-gray-800">{method.name}</h3>
                            <p className="text-sm text-gray-600">{method.description}</p>
                          </div>
                        </div>
                        
                        {method.availability === "coming_soon" && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                            Coming Soon
                          </span>
                        )}
                        
                        {method.availability === "maintenance" && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                            Maintenance
                          </span>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <div className="text-gray-600">
                          <span className="font-medium">{method.processingTime}</span>
                          {fees > 0 && (
                            <>
                              <span className="mx-2">•</span>
                              <span>Fee: {fees.toLocaleString()} FCFA</span>
                            </>
                          )}
                        </div>
                        
                        {method.availability === "available" && (
                          <div className="text-right">
                            <div className="font-bold text-blue-600">
                              {totalWithFees.toLocaleString()} FCFA
                            </div>
                            {fees > 0 && (
                              <div className="text-xs text-gray-500">
                                incl. {fees.toLocaleString()} FCFA fee
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Payment Details */}
      {currentStep === "details" && selectedPaymentMethod && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center mb-6">
            <span className="text-2xl mr-3">{selectedPaymentMethod.icon}</span>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{selectedPaymentMethod.name}</h2>
              <p className="text-gray-600">{selectedPaymentMethod.description}</p>
            </div>
          </div>
          
          {renderPaymentDetailsForm()}
          
          <div className="flex justify-between items-center mt-6 pt-6 border-t">
            <button
              onClick={() => setCurrentStep("method")}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              ← Change Method
            </button>
            
            <button
              onClick={handlePaymentDetailsSubmit}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Continue to Confirmation →
            </button>
          </div>
        </div>
      )}

      {/* Payment Confirmation */}
      {currentStep === "confirmation" && paymentData && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">✅ Confirm Payment</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Payment Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Method</span>
                  <span className="font-medium">{paymentData.method.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-medium">{paymentData.amount.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fees</span>
                  <span className="font-medium">{paymentData.fees.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-blue-600">{paymentData.totalAmount.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Booking Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking ID</span>
                  <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{paymentData.bookingReference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer</span>
                  <span className="font-medium">{paymentData.customerInfo.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium">{paymentData.customerInfo.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone</span>
                  <span className="font-medium">{paymentData.customerInfo.phone}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <div className="flex items-start">
              <div className="text-blue-500 text-xl mr-3">🔒</div>
              <div>
                <h4 className="font-medium text-blue-800 mb-1">Secure Payment</h4>
                <p className="text-sm text-blue-700">
                  Your payment is protected by 256-bit SSL encryption. 
                  By proceeding, you agree to our terms and conditions.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-6 pt-6 border-t">
            <button
              onClick={() => setCurrentStep("details")}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              ← Back to Details
            </button>
            
            <button
              onClick={processPayment}
              disabled={isProcessing}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition font-medium shadow-lg"
            >
              🔒 Pay {paymentData.totalAmount.toLocaleString()} FCFA
            </button>
          </div>
        </div>
      )}

      {/* Processing */}
      {currentStep === "processing" && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing...</h2>
          <p className="text-gray-600 mb-4">
            {bookingOption === "book_now_pay_later" 
              ? "Creating your booking reservation" 
              : "Processing your payment"
            }
          </p>
          <p className="text-sm text-blue-600">Do not close this window or press back button</p>
        </div>
      )}

      {/* SCENARIO 1: Success with Ticket Delivery */}
      {currentStep === "success" && paymentData && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold text-green-600 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">Your booking has been confirmed</p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 max-w-md mx-auto">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID</span>
                <span className="font-mono text-xs bg-white px-2 py-1 rounded">{paymentData.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid</span>
                <span className="font-bold text-green-600">{paymentData.totalAmount.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="font-medium text-green-600">✅ Completed</span>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-700">
              🎫 Your ticket will be delivered via your preferred method
            </p>
          </div>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={() => router.push(`/dashboard/customer/bookings/${bookingData.bookingId}`)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              📋 View Booking Details
            </button>
            <button
              onClick={() => router.push('/dashboard/customer')}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              🏠 Go to Dashboard
            </button>
          </div>
          
          <p className="text-xs text-gray-400 mt-4">Redirecting to booking details in 8 seconds...</p>
        </div>
      )}

      {/* SCENARIO 2: Booking Success Without Payment */}
      {currentStep === "booking_success" && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
          <div className="text-6xl mb-6">📋</div>
          <h2 className="text-3xl font-bold text-orange-600 mb-2">Booking Created Successfully!</h2>
          <p className="text-gray-600 mb-6">Complete your payment to confirm your reservation</p>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6 max-w-md mx-auto">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Booking ID</span>
                <span className="font-mono text-xs bg-white px-2 py-1 rounded">{bookingData?.bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Due</span>
                <span className="font-bold text-orange-600">{bookingData?.totalAmount.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Deadline</span>
                <span className="font-medium text-red-600">
                  {paymentDeadline?.toLocaleDateString()} {paymentDeadline?.toLocaleTimeString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="font-medium text-orange-600">⏳ Pending Payment</span>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="text-sm text-yellow-800 space-y-2">
              <p className="font-medium">⚠️ Important Reminders:</p>
              <ul className="text-left list-disc ml-4 space-y-1">
                <li>Complete payment within <strong>48 hours</strong> to confirm your booking</li>
                <li>We'll send you <strong>email and SMS reminders</strong></li>
                <li>Booking will be <strong>automatically cancelled</strong> if not paid in time</li>
                <li>Your seats are <strong>temporarily reserved</strong></li>
              </ul>
            </div>
          </div>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                setCurrentStep("method")
                setBookingOption("pay_now")
              }}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              💳 Pay Now
            </button>
            <button
              onClick={() => router.push(`/dashboard/customer/bookings/${bookingData?.bookingId}`)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              📋 View Booking
            </button>
            <button
              onClick={() => router.push('/dashboard/customer')}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              🏠 Go to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Failed */}
      {currentStep === "failed" && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
          <div className="text-6xl mb-6">😞</div>
          <h2 className="text-3xl font-bold text-red-600 mb-2">
            {bookingOption === "book_now_pay_later" ? "Booking Failed" : "Payment Failed"}
          </h2>
          <p className="text-gray-600 mb-6">
            {bookingOption === "book_now_pay_later" 
              ? "Something went wrong while creating your booking"
              : "Something went wrong with your payment"
            }
          </p>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 max-w-md mx-auto text-left">
            <h4 className="font-medium text-red-800 mb-2">Common Issues:</h4>
            <ul className="text-sm text-red-700 space-y-1 list-disc ml-4">
              <li>Network connectivity issues</li>
              <li>Server temporarily unavailable</li>
              <li>Booking information incomplete</li>
              <li>System maintenance in progress</li>
            </ul>
          </div>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setCurrentStep("method")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              🔄 Try Again
            </button>
            <button
              onClick={() => router.push('/dashboard/customer')}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              🏠 Go to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Ticket Delivery Modal */}
      {showDeliveryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">🎫 Ticket Delivery</h3>
            <p className="text-gray-600 mb-6">How would you like to receive your ticket?</p>
            
            <div className="space-y-4 mb-6">
              {/* Email Option */}
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="email"
                  checked={ticketDelivery.method === "email"}
                  onChange={(e) => setTicketDelivery({...ticketDelivery, method: e.target.value as any})}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">📧</span>
                    <span className="font-medium">Email</span>
                  </div>
                  <p className="text-sm text-gray-600">{ticketDelivery.email}</p>
                </div>
              </label>
              
              {/* SMS Option */}
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="sms"
                  checked={ticketDelivery.method === "sms"}
                  onChange={(e) => setTicketDelivery({...ticketDelivery, method: e.target.value as any})}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">📱</span>
                    <span className="font-medium">SMS</span>
                  </div>
                  <p className="text-sm text-gray-600">{ticketDelivery.phone}</p>
                </div>
              </label>
              
              {/* Both Option */}
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="both"
                  checked={ticketDelivery.method === "both"}
                  onChange={(e) => setTicketDelivery({...ticketDelivery, method: e.target.value as any})}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">📧📱</span>
                    <span className="font-medium">Both Email & SMS</span>
                  </div>
                  <p className="text-sm text-gray-600">Maximum security</p>
                </div>
              </label>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeliveryModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
              >
                Skip
              </button>
              <button
                onClick={handleTicketDeliveryConfirm}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Badge */}
      <div className="flex justify-center">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center">
            <span className="text-green-500 mr-1">🔒</span>
            <span>SSL Secured</span>
          </div>
          <div className="flex items-center">
            <span className="text-blue-500 mr-1">🛡️</span>
            <span>PCI Compliant</span>
          </div>
          <div className="flex items-center">
            <span className="text-purple-500 mr-1">✅</span>
            <span>Verified Platform</span>
          </div>
        </div>
      </div>
    </div>
  )
}