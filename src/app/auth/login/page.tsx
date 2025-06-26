"use client"

import { useState } from 'react'
import { useTranslation } from '@/i18n'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const { t } = useTranslation()
  const router = useRouter()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.email) {
      newErrors.email = t('auth.validation.required')
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.validation.invalidEmail')
    }
    if (!formData.password) {
      newErrors.password = t('auth.validation.required')
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      router.push('/admin')
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-yellow-600/5"></div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-4xl font-extrabold text-gray-800 hover:text-blue-600 transition-colors">
            <i className="fas fa-link mr-3 text-blue-600"></i>ChadLink
          </Link>
        </div>

        <div className="bg-white/80 rounded-3xl shadow-xl p-10 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-700 mb-2">{t('auth.login.title')}</h1>
            <p className="text-gray-600">{t('auth.login.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <div className="relative">
                <i className="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="email"
                  name="email"
                  placeholder={t('auth.login.email')}
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1 ml-2">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="password"
                  name="password"
                  placeholder={t('auth.login.password')}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1 ml-2">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="mr-2 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-400"
                />
                <span className="text-sm text-gray-600">{t('auth.login.rememberMe')}</span>
              </label>
              <Link href="/auth/forgot-password" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                {t('auth.login.forgotPassword')}
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {t('auth.login.loginButton')}
                </div>
              ) : (
                t('auth.login.loginButton')
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              {t('auth.login.noAccount')}{' '}
              <Link href="/auth/register" className="text-blue-600 hover:text-blue-800 font-medium">
                {t('auth.login.signUp')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
