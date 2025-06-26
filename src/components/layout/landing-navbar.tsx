"use client"

import { useState } from 'react'
import { useTranslation } from '@/i18n'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import LocaleSwitcher from './locale-switcher'
import { ROUTES } from '@/lib/route'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-gradient-primary text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="font-bold text-2xl tracking-tight">
            <i className="fas fa-link mr-3"></i>ChadLink
          </Link>

          <div className="hidden lg:flex items-center space-x-4">
            <LocaleSwitcher />
            <button
              onClick={() => router.push(ROUTES.login)}
              className="hover:text-yellow-300 flex items-center font-medium px-4 py-3"
              aria-label="Login"
            >
              <i className="fas fa-sign-in-alt mr-2"></i> {t('nav.login')}
            </button>
            <button
              onClick={() => router.push(ROUTES.register)}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100 flex items-center font-medium transition-all duration-300 hover:-translate-y-0.5"
              aria-label="Register"
            >
              <i className="fas fa-user-plus mr-2"></i> {t('nav.register')}
            </button>
          </div>

          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden py-4 space-y-2 border-t border-blue-500">
            <button
              onClick={() => {
                router.push(ROUTES.login)
                setIsMenuOpen(false)
              }}
              className="block w-full text-left px-4 py-2 hover:bg-blue-700 rounded"
              aria-label="Login"
            >
              <i className="fas fa-sign-in-alt mr-2"></i> {t('nav.login')}
            </button>
            <button
              onClick={() => {
                router.push(ROUTES.register)
                setIsMenuOpen(false)
              }}
              className="block w-full text-left px-4 py-2 hover:bg-blue-700 rounded"
              aria-label="Register"
            >
              <i className="fas fa-user-plus mr-2"></i> {t('nav.register')}
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}