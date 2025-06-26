"use client"

import Footer from '@/components/layout/footer-landing'
import LandingNavbar from '@/components/layout/landing-navbar'
import { useTranslation } from '@/i18n'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ROUTES } from '@/lib/route'

// Optional: you can move this out to components/ui/StatsCard.tsx
const StatsCard = ({ value, label }: { value: string; label: string }) => (
  <div className="stats-card bg-transparent">
    <h2 className="text-6xl font-bold mb-2">{value}</h2>
    <p className="text-xl opacity-90 font-medium">{label}</p>
  </div>
)

export default function LandingPage() {
  const { t, isLoading } = useTranslation()
  const router = useRouter()

  const navigate = (path: string) => router.push(path)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <LandingNavbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-primary text-white py-20 relative overflow-hidden hero-pattern">
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-5xl font-bold mb-6 tracking-tight">{t('hero.welcome')}</h1>
                <p className="text-xl mb-4 opacity-90 font-medium">{t('hero.subtitle')}</p>
                <p className="mb-8 opacity-80 text-lg">{t('hero.description')}</p>
                <div className="flex gap-4 flex-col sm:flex-row">
                  <button
                    onClick={() => navigate(ROUTES.register)}
                    className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-300 hover:-translate-y-1 shadow-lg"
                    aria-label="Get Started"
                  >
                    {t('hero.getStarted')}
                  </button>
                  <button
                    onClick={() => navigate(ROUTES.login)}
                    className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 hover:-translate-y-1"
                    aria-label="Login"
                  >
                    {t('hero.login')}
                  </button>
                </div>
              </motion.div>

              {/* Hero Icons */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ delay: 0.3, duration: 0.5 }} 
                className="lg:block hidden"
              >
                <div className="grid grid-cols-2 gap-8">
                  <div className="bg-white bg-opacity-10 rounded-full w-32 h-32 flex items-center justify-center" aria-label="Transport">
                    <i className="fas fa-bus text-4xl text-blue-600" />
                  </div>
                  <div className="bg-white bg-opacity-10 rounded-full w-32 h-32 flex items-center justify-center" aria-label="Shopping">
                    <i className="fas fa-shopping-cart text-4xl text-green-600" />
                  </div>
                  <div className="bg-white bg-opacity-10 rounded-full w-32 h-32 col-span-2 mx-auto flex items-center justify-center" aria-label="Delivery">
                    <i className="fas fa-truck text-4xl text-yellow-600" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6 }} 
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-4 text-gray-800">{t('services.title')}</h2>
              <p className="text-xl text-gray-600 font-medium">{t('services.subtitle')}</p>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {/* Transport */}
            <ServiceCard
              icon="fa-bus"
              color="blue"
              title={t('services.transportation')}
              desc={t('services.transportationDesc')}
              onClick={() => navigate(ROUTES.exploreRoutes)}
              label={t('services.exploreRoutes')}
            />

            {/* E-Commerce */}
            <ServiceCard
              icon="fa-shopping-cart"
              color="green"
              title={t('services.ecommerce')}
              desc={t('services.ecommerceDesc')}
              onClick={() => navigate(ROUTES.shop)}
              label={t('services.startShopping')}
            />

            {/* Delivery */}
            <ServiceCard
              icon="fa-truck"
              color="yellow"
              title={t('services.delivery')}
              desc={t('services.deliveryDesc')}
              onClick={() => navigate(ROUTES.delivery)}
              label={t('services.requestDelivery')}
            />
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 text-center max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6 }} 
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6 text-gray-800">{t('cta.title')}</h2>
              <p className="text-xl text-gray-600 mb-8 font-medium">{t('cta.subtitle')}</p>

              <div className="flex justify-center gap-6 flex-col sm:flex-row">
                <button
                  onClick={() => navigate(ROUTES.register)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:-translate-y-1 shadow-lg"
                >
                  {t('cta.joinCustomer')}
                </button>
                <button
                  onClick={() => navigate(ROUTES.applyVendor)}
                  className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 hover:-translate-y-1"
                >
                  {t('cta.becomePartner')}
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-gradient-primary text-white py-20">
          <div className="container mx-auto px-4 grid lg:grid-cols-4 md:grid-cols-2 gap-8 text-center">
            <StatsCard value="3" label={t('stats.services')} />
            <StatsCard value="24/7" label={t('stats.availability')} />
            <StatsCard value="3" label={t('stats.languages')} />
            <StatsCard value="1" label={t('stats.platform')} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function ServiceCard({ icon, color, title, desc, onClick, label }: {
  icon: string
  color: string
  title: string
  desc: string
  onClick: () => void
  label: string
}) {
  return (
    <motion.div 
      className={`bg-white rounded-xl shadow-lg border-2 p-8 text-center hover:-translate-y-2 transition-all duration-300 hover:border-${color}-600`} 
      whileHover={{ scale: 1.02 }}
    >
      <div className={`service-icon mb-6 w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-${color}-50`}>
        <i className={`fas ${icon} text-4xl text-${color}-600`} />
      </div>
      <h4 className="text-2xl font-semibold mb-4 text-gray-800">{title}</h4>
      <p className="text-gray-600 mb-6 leading-relaxed">{desc}</p>
      <button
        onClick={onClick}
        className={`bg-gradient-to-r from-${color}-600 to-${color}-700 text-white px-6 py-3 rounded-lg hover:from-${color}-700 hover:to-${color}-800 transition-all duration-300 shadow-lg font-medium`}
      >
        {label}
      </button>
    </motion.div>
  )
}
