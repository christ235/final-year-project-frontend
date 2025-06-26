"use client"
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import LocaleSwitcher from './locale-switcher'

interface TopNavbarProps {
  onMenuClick?: () => void
}

export default function Top({ onMenuClick }: TopNavbarProps) {
  const router = useRouter()

  const handleLogout = () => {
    // example logout: remove token, redirect to home
    localStorage.removeItem('token')
    router.push('/')
  }

  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo + Mobile Menu Button */}
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md hover:bg-blue-600 transition-colors mr-3"
              aria-label="Toggle sidebar"
            >
              <i className="fas fa-bars text-lg"></i>
            </button>

            {/* Logo */}
            <Link href="/customer" className="font-bold text-2xl flex items-center">
              <i className="fas fa-link mr-2"></i>ChadLink
            </Link>
          </div>

          {/* Right side - Navigation Items */}
          <div className="flex items-center space-x-4">
            {/* Locale Switcher - Always visible */}
            <LocaleSwitcher />

            {/* Logout Button - Hidden on mobile, visible on desktop */}
            <button
              onClick={handleLogout}
              className="hidden lg:flex items-center bg-gray-500 hover:bg-blue-500 px-4 py-2 rounded text-white transition-colors"
            >
              <i className="fas fa-sign-out-alt mr-2"></i> Logout
            </button>

            {/* Mobile Menu Button (Alternative position) */}
            <button
              onClick={handleLogout}
              className="lg:hidden p-2 rounded-md hover:bg-red-600 bg-red-500 transition-colors"
              aria-label="Logout"
            >
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}