"use client"

export default function UserFooter() {
  return (
    <footer className="bg-gray-50"> {/* Same background as original */}
      <div className="container mx-auto px-4"> {/* Topbar container structure */}
        <div className="flex justify-center items-center h-16"> {/* Topbar height */}
          {/* Exact same content as your original footer */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-4 bg-white/40 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-white/20">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <i className="fas fa-link text-white text-xs"></i>
                </div>
                <span className="text-sm font-semibold text-gray-700">ChadLink</span>
              </div>

              <div className="w-px h-4 bg-gray-300"></div>

              <div className="flex items-center space-x-4 text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <i className="fas fa-bus text-blue-600"></i>
                  <span>Transport</span>
                </div>
                <div className="flex items-center space-x-1">
                  <i className="fas fa-shopping-cart text-green-600"></i>
                  <span>Shop</span>
                </div>
                <div className="flex items-center space-x-1">
                  <i className="fas fa-truck text-yellow-600"></i>
                  <span>Delivery</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              © 2025 ChadLink. Connecting Communities. Powered by Djad's Innovation.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}