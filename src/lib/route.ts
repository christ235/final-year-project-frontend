export const ROUTES = {
  // Landing & Auth routes
  home: "/",
  login: "/auth/login",
  register: "/auth/register",
  exploreRoutes: "/bus-booking/search",
  shop: "/marketplace",
  delivery: "/logistics/create",
  applyVendor: "/apply/vendor",

  // Admin Dashboard routes
  adminDashboard: "/dashboard/admin",
  adminUsers: "/dashboard/admin/users",
  adminUserProfile: (id: string | number) => `/dashboard/admin/users/${id}`,
  adminEditUser: (id: string | number) => `/dashboard/admin/users/${id}/edit`,
  adminSuspendUser: (id: string | number) => `/dashboard/admin/users/${id}/suspend`,
  adminAgencies: "/dashboard/admin/agency",
  adminAnalytics: "/dashboard/admin/analytics",
  adminMarketplace: "/dashboard/admin/marketplace",
  adminProducts: "/dashboard/admin/marketplace/products",
  adminOrders: "/dashboard/admin/marketplace/orders",
  adminVendors: "/dashboard/admin/vendors",
  adminCouriers: "/dashboard/admin/couriers",
  adminDrivers: "/dashboard/admin/drivers",

  // Buyer Dashboard routes
customerDeliveries: "/customer/deliveries",
  customerMarketplace: "/customer/marketplace",
  customerBusBooking: "/dashboard/customer/travel/book",
  customerOrders: "/customer/orders",
  customerSupport: "/customer/support",
  customerSubscriptions: "/customer/subscriptions",
  customerProfile: "/customer/profile",

  // Vendor Dashboard routes
  vendorDashboard: "/dashboard/vendor",
  vendorProducts: "/dashboard/vendor/products",
  vendorOrders: "/dashboard/vendor/orders",
  vendorAnalytics: "/dashboard/vendor/analytics",
  vendorProfile: "/dashboard/vendor/shop-profile",

  // Courier Dashboard routes
  courierDashboard: "/dashboard/courier",
  courierDeliveries: "/dashboard/courier/deliveries",
  courierEarnings: "/dashboard/courier/earnings",

  // Driver Dashboard routes
  driverDashboard: "/dashboard/driver",
  driverTrips: "/dashboard/driver/trips",
  driverParcels: "/dashboard/driver/parcels",

  // Marketplace routes
  marketplace: "/marketplace",
  productDetails: (id: string | number) => `/marketplace/product/${id}`,
  cart: "/marketplace/cart",

  // Logistics routes
  createLogistics: "/logistics/create",
  trackPackage: (id: string | number) => `/logistics/track/${id}`,
  logisticsStatus: "/logistics/status",

  // Bus Booking routes
  searchBus: "/bus-booking/search",
  bookTrip: (tripId: string | number) => `/bus-booking/book/${tripId}`,
  tickets: "/bus-booking/tickets",

  // Application routes
  applyCourier: "/apply/courier",
  applyDriver: "/apply/driver",
  applicationStatus: "/apply/status",

  // Support routes
  chatbot: "/support/chatbot",
  contact: "/contact",
}
