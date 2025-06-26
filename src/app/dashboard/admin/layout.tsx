"use client"

import { ReactNode, useState } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from '@/components/layout/admin-sidebar'
import TopNavbar from '@/components/layout/admin-topbar'
import AdminFooter from '@/components/layout/admin-footer'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Topbar - Full Width */}
      <header className="flex-shrink-0 z-20 h-16">
        <TopNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      </header>

      {/* Middle Section - Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Between Topbar and Footer */}
        <aside className={`
          fixed lg:static top-16 bottom-16 left-0 z-10 w-64
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex-shrink-0 lg:top-0 lg:bottom-0
        `}>
          <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} />
        </aside>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>

      {/* Footer - Full Width */}
      <footer className="flex-shrink-0 z-20 h-16">
        <AdminFooter />
      </footer>
    </div>
  )
}