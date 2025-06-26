'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const locales = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇹🇩' }
]

export default function LocaleSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentLocale, setCurrentLocale] = useState('en')
  const router = useRouter()
  const pathname = usePathname()

  const handleLanguageChange = (newLocale: string) => {
    setCurrentLocale(newLocale)
    localStorage.setItem('locale', newLocale)
    window.dispatchEvent(new CustomEvent('languageChange', { detail: newLocale }))
    setIsOpen(false)
  }

  const currentLocaleData = locales.find(l => l.code === currentLocale)

  return (
    <div className="relative z-50">
      <button
        className="hover:text-yellow-300 flex items-center font-medium px-4 py-3 transition-colors duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="fas fa-globe mr-2"></i>
        <span className="hidden sm:inline">{currentLocaleData?.name}</span>
        <span className="sm:hidden">{currentLocaleData?.flag}</span>
        <i className="fas fa-chevron-down ml-2 text-xs"></i>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg text-gray-800 border z-50">
          {locales.map((locale, idx) => (
            <button
              key={locale.code}
              className={`w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors flex items-center space-x-3 ${
                currentLocale === locale.code ? 'bg-blue-50 text-blue-600' : ''
              } ${
                idx === 0 ? 'rounded-t-lg' : ''
              } ${
                idx === locales.length - 1 ? 'rounded-b-lg' : ''
              }`}
              onClick={() => handleLanguageChange(locale.code)}
            >
              <span className="text-lg">{locale.flag}</span>
              <span>{locale.name}</span>
              {currentLocale === locale.code && (
                <i className="fas fa-check ml-auto text-blue-600"></i>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
