'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FileText, Type, BookOpen, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Fonts', href: '/fonts', icon: Type },
  { name: 'Projects', href: '/projects', icon: FileText },
  { name: 'Instructions', href: '/instructions', icon: BookOpen },
]

export const Sidebar = () => {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const sidebarContent = () => (
    <>
      {/* Glassmorphism background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-purple-900/90 to-blue-900/95 backdrop-blur-xl" />
      
      {/* Animated orbs */}
      <div className="absolute top-20 -left-20 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 -right-20 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
      
      {/* Close button for mobile */}
      <button
        onClick={() => setIsMobileMenuOpen(false)}
        className="lg:hidden absolute top-4 right-4 z-50 p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all"
      >
        <X size={24} />
      </button>
      
      <nav className="relative p-4 space-y-2 pt-16 lg:pt-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden',
                isActive
                  ? 'bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg shadow-purple-500/50'
                  : 'text-gray-300 hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20'
              )}
            >
              {/* Animated background on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/10 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className={cn(
                "relative z-10 p-2 rounded-lg transition-all duration-300",
                isActive 
                  ? "bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg" 
                  : "bg-white/10 group-hover:bg-white/20"
              )}>
                <item.icon size={20} className={cn(
                  "transition-all duration-300",
                  isActive ? "text-white" : "text-gray-300 group-hover:text-white"
                )} />
              </div>
              <span className={cn(
                "relative z-10 transition-all duration-300 font-medium",
                isActive ? "text-white" : "text-gray-300 group-hover:text-white"
              )}>
                {item.name}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-l-full shadow-lg shadow-purple-500/50" />
              )}
            </Link>
          )
        })}
      </nav>
      
      {/* Bottom glass card */}
      <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
        <div className="text-xs text-gray-300 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
            <span>System Active</span>
          </div>
          <div className="text-gray-400">CMR Assignment v1.0</div>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 min-h-screen relative overflow-hidden">
        {sidebarContent()}
      </aside>

      {/* Mobile Sidebar (Overlay) */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <aside className="lg:hidden fixed top-0 left-0 w-64 h-screen relative overflow-hidden z-50">
            {sidebarContent()}
          </aside>
        </>
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-30 p-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/50 hover:scale-110 transition-transform"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </>
  )
}
