"use client"
import { useState } from 'react'
import { useTranslation } from '@/i18n'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const { t } = useTranslation()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeToTerms: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.firstName) newErrors.firstName = t('auth.validation.required')
    if (!formData.lastName) newErrors.lastName = t('auth.validation.required')
    
    if (!formData.email) {
      newErrors.email = t('auth.validation.required')
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.validation.invalidEmail')
    }
    
    if (!formData.password) {
      newErrors.password = t('auth.validation.required')
    } else if (formData.password.length < 8) {
      newErrors.password = t('auth.validation.passwordTooShort')
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.validation.passwordMismatch')
    }
    
    if (!formData.phone) {
      newErrors.phone = t('auth.validation.required')
    } else if (!/^\+?[\d\s-()]{8,}$/.test(formData.phone)) {
      newErrors.phone = t('auth.validation.invalidPhone')
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = t('auth.validation.required')
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
      
      console.log('Registration successful:', formData)
      router.push('/auth/login')
      
    } catch (error) {
      console.error('Registration failed:', error)
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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 via-transparent to-blue-600/5"></div>
      
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-3xl font-bold text-gray-800 hover:text-green-600 transition-colors">
            <i className="fas fa-link mr-3 text-green-600"></i>
            ChadLink
          </Link>
        </div>

        <div className="bg-gray-100 rounded-3xl shadow-[20px_20px_40px_#a3b1c6,-20px_-20px_40px_#ffffff] p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-700 mb-2">{t('auth.signup.title')}</h1>
            <p className="text-gray-600">{t('auth.signup.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="bg-gray-100 rounded-2xl shadow-[inset_10px_10px_20px_#a3b1c6,inset_-10px_-10px_20px_#ffffff] p-1">
                  <input
                    type="text"
                    name="firstName"
                    placeholder={t('auth.signup.firstName')}
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-3 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none rounded-2xl text-sm"
                  />
                </div>
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              
              <div>
                <div className="bg-gray-100 rounded-2xl shadow-[inset_10px_10px_20px_#a3b1c6,inset_-10px_-10px_20px_#ffffff] p-1">
                  <input
                    type="text"
                    name="lastName"
                    placeholder={t('auth.signup.lastName')}
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-3 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none rounded-2xl text-sm"
                  />
                </div>
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <div className="bg-gray-100 rounded-2xl shadow-[inset_10px_10px_20px_#a3b1c6,inset_-10px_-10px_20px_#ffffff] p-1">
                <input
                  type="email"
                  name="email"
                  placeholder={t('auth.signup.email')}
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none rounded-2xl"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-2 ml-4">{errors.email}</p>}
            </div>

            <div>
              <div className="bg-gray-100 rounded-2xl shadow-[inset_10px_10px_20px_#a3b1c6,inset_-10px_-10px_20px_#ffffff] p-1">
                <input
                  type="tel"
                  name="phone"
                  placeholder={t('auth.signup.phone')}
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none rounded-2xl"
                />
              </div>
              {errors.phone && <p className="text-red-500 text-sm mt-2 ml-4">{errors.phone}</p>}
            </div>

            <div>
              <div className="bg-gray-100 rounded-2xl shadow-[inset_10px_10px_20px_#a3b1c6,inset_-10px_-10px_20px_#ffffff] p-1">
                <input
                  type="password"
                  name="password"
                  placeholder={t('auth.signup.password')}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none rounded-2xl"
                />
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-2 ml-4">{errors.password}</p>}
            </div>

            <div>
              <div className="bg-gray-100 rounded-2xl shadow-[inset_10px_10px_20px_#a3b1c6,inset_-10px_-10px_20px_#ffffff] p-1">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder={t('auth.signup.confirmPassword')}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none rounded-2xl"
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-2 ml-4">{errors.confirmPassword}</p>}
            </div>

            <div>
              <label className="flex items-start">
                <div className="relative mt-1">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 bg-gray-100 rounded-lg shadow-[inset_5px_5px_10px_#a3b1c6,inset_-5px_-5px_10px_#ffffff] flex items-center justify-center cursor-pointer ${formData.agreeToTerms ? 'text-green-600' : 'text-transparent'}`}>
                    <i className="fas fa-check text-sm"></i>
                  </div>
                </div>
                <span className="ml-3 text-gray-600 text-sm leading-relaxed">{t('auth.signup.terms')}</span>
              </label>
              {errors.agreeToTerms && <p className="text-red-500 text-sm mt-2 ml-4">{errors.agreeToTerms}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-100 rounded-2xl shadow-[10px_10px_20px_#a3b1c6,-10px_-10px_20px_#ffffff] active:shadow-[inset_5px_5px_10px_#a3b1c6,inset_-5px_-5px_10px_#ffffff] py-4 text-gray-700 font-semibold transition-all duration-200 hover:text-green-600 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600 mr-2"></div>
                  {t('auth.signup.signupButton')}
                </div>
              ) : (
                t('auth.signup.signupButton')
              )}
            </button>
          </form>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              {t('auth.signup.haveAccount')}{' '}
              <Link href="/auth/login" className="text-green-600 hover:text-green-800 font-medium transition-colors">
                {t('auth.signup.signIn')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}