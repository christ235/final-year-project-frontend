"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import classNames from 'classnames'

interface SidebarProps {
  isOpen: boolean
  toggle: () => void
}

const navItems = [
  { name: 'Dashboard', icon: 'fas fa-tachometer-alt', href: '/dashboard/admin' },
  { name: 'Users', icon: 'fas fa-users', href: '/dashboard/admin/users' },
  { name: 'Public Transport', icon: 'fas fa-bus', href: '/dashboard/admin/transport' },
  { name: 'Analytics', icon: 'fas fa-chart-line', href: '/dashboard/admin/analytics' },
  { name: 'Marketplace', icon: 'fas fa-store', href: '/dashboard/admin/marketplace' },
  { name: 'Products', icon: 'fas fa-box-open', href: '/dashboard/admin/marketplace/products' },
  { name: 'Orders', icon: 'fas fa-receipt', href: '/dashboard/admin/marketplace/orders' },
  { name: 'Vendors', icon: 'fas fa-user-tie', href: '/dashboard/admin/marketplace/vendors' },
  { name: 'Couriers', icon: 'fas fa-motorcycle', href: '/dashboard/admin/couriers' },
  { name: 'Drivers', icon: 'fas fa-id-badge', href: '/dashboard/admin/drivers' },
  // Extra items for testing
  { name: 'Settings', icon: 'fas fa-cog', href: '/dashboard/admin/settings' },
  { name: 'Reports', icon: 'fas fa-chart-bar', href: '/dashboard/admin/reports' },
  { name: 'Notifications', icon: 'fas fa-bell', href: '/dashboard/admin/notifications' },
  { name: 'Security', icon: 'fas fa-shield-alt', href: '/dashboard/admin/security' },
  { name: 'Billing', icon: 'fas fa-credit-card', href: '/dashboard/admin/billing' },
  { name: 'Support', icon: 'fas fa-headset', href: '/dashboard/admin/support' },
]

export default function Sidebar({ isOpen, toggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className="bg-white shadow-md h-full w-full flex flex-col">
  
      {/* Scrollable Middle Section */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4 space-y-1">
          {navItems.map(item => (
            <Link 
              key={item.href} 
              href={item.href} 
              className={classNames(
                'flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200',
                {
                  'bg-blue-100 text-blue-700 font-semibold': pathname === item.href
                }
              )}
            >
              <i className={`${item.icon} mr-3 w-5 text-center`}></i>
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Fixed Footer */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <div className="text-xs text-gray-500 text-center">
          Admin v1.0.0
        </div>
      </div>
    </div>
  )
}