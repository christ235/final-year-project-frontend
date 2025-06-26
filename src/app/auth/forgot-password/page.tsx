"use client"
import { useState } from 'react'
import { useTranslation } from '@/i18n'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const { t } = useTranslation()
  
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError(t('auth.validation.required'))
      return
    }
    
    if (!validateEmail(email)) {
      setError(t('auth.validation.invalidEmail'))
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Reset link sent to:', email)
      setIsSuccess(true)
      
    } catch (error) {
      console.error('Reset failed:', error)
      setError('Failed to send reset link. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (error) setError('')
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-yellow-50 to-orange-100 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/5 via-transparent to-orange-600/5"></div>
        
        <div className="relative w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center text-3xl font-bold text-gray-800 hover:text-yellow-600 transition-colors">
              <i className="fas fa-link mr-3 text-yellow-600"></i>
              ChadLink
            </Link>
          </div>

          <div className="bg-gray-100 rounded-3xl shadow-[20px_20px_40px_#a3b1c6,-20px_-20px_40px_#ffffff] p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full shadow-[10px_10px_20px_#a3b1c6,-10px_-10px_20px_#ffffff] flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-check text-3xl text-green-600"></i>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-700 mb-4">Email Sent!</h1>
            <p className="text-gray-600 mb-8">{t('auth.forgotPassword.success')}</p>
            
            <Link 
              href="/auth/login"
              className="inline-block w-full bg-gray-100 rounded-2xl shadow-[10px_10px_20px_#a3b1c6,-10px_-10px_20px_#ffffff] active:shadow-[inset_5px_5px_10px_#a3b1c6,inset_-5px_-5px_10px_#ffffff] py-4 text-gray-700 font-semibold transition-all duration-200 hover:text-yellow-600"
            >
              {t('auth.forgotPassword.backToLogin')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-yellow-50 to-orange-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/5 via-transparent to-orange-600/5"></div>
      
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-3xl font-bold text-gray-800 hover:text-yellow-600 transition-colors">
            <i className="fas fa-link mr-3 text-yellow-600"></i>
            ChadLink
          </Link>
        </div>

        <div className="bg-gray-100 rounded-3xl shadow-[20px_20px_40px_#a3b1c6,-20px_-20px_40px_#ffffff] p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full shadow-[10px_10px_20px_#a3b1c6,-10px_-10px_20px_#ffffff] flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-key text-2xl text-yellow-600"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-700 mb-2">{t('auth.forgotPassword.title')}</h1>
            <p className="text-gray-600">{t('auth.forgotPassword.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="bg-gray-100 rounded-2xl shadow-[inset_10px_10px_20px_#a3b1c6,inset_-10px_-10px_20px_#ffffff] p-1">
                <input
                  type="email"
                  placeholder={t('auth.forgotPassword.email')}
                  value={email}
                  onChange={handleEmailChange}
                  className="w-full px-4 py-4 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none rounded-2xl"
                />
              </div>
              {error && <p className="text-red-500 text-sm mt-2 ml-4">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-100 rounded-2xl shadow-[10px_10px_20px_#a3b1c6,-10px_-10px_20px_#ffffff] active:shadow-[inset_5px_5px_10px_#a3b1c6,inset_-5px_-5px_10px_#ffffff] py-4 text-gray-700 font-semibold transition-all duration-200 hover:text-yellow-600 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600 mr-2"></div>
                  {t('auth.forgotPassword.resetButton')}
                </div>
              ) : (
                t('auth.forgotPassword.resetButton')
              )}
            </button>
          </form>

          <div className="text-center mt-8">
            <Link href="/auth/login" className="text-yellow-600 hover:text-yellow-800 font-medium transition-colors">
              <i className="fas fa-arrow-left mr-2"></i>
              {t('auth.forgotPassword.backToLogin')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}