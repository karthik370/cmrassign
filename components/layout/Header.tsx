'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { FileText, LogOut, User, Menu, X } from 'lucide-react'

export const Header = () => {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const handleGetStarted = () => {
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/auth/signup')
    }
  }

  return (
    <header className="bg-black shadow-lg border-b-2 border-green-500 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2 sm:gap-3 group">
            <div className="bg-gray-900 border-2 border-green-500 rounded p-1.5 sm:p-2 group-hover:bg-gray-800 transition-colors">
              <FileText className="text-green-400" size={20} />
            </div>
            <div>
              <span className="text-base sm:text-xl font-bold text-green-400 font-mono block leading-tight">
                CMR ASSIGNMENT
              </span>
              <span className="text-xs text-gray-500 font-mono hidden sm:block">
                {'>'} Handwriting System
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-green-400 hover:text-green-300 font-mono text-sm transition-colors"
                >
                  {'>'} DASHBOARD
                </Link>
                <Link
                  href="/fonts"
                  className="text-green-400 hover:text-green-300 font-mono text-sm transition-colors"
                >
                  {'>'} FONTS
                </Link>
                <Link
                  href="/projects"
                  className="text-green-400 hover:text-green-300 font-mono text-sm transition-colors"
                >
                  {'>'} PROJECTS
                </Link>
                <div className="flex items-center gap-2 ml-4 border-l-2 border-green-500 pl-4">
                  <User size={20} className="text-green-400" />
                  <span className="text-sm text-gray-400 font-mono max-w-[150px] truncate">{user.email}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut()}
                    className="text-red-400 hover:text-red-300 hover:bg-gray-900"
                  >
                    <LogOut size={18} />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button className="bg-gray-800 hover:bg-gray-700 text-green-400 font-mono border border-green-500">
                    {'>'} Sign In
                  </Button>
                </Link>
                <Button 
                  onClick={handleGetStarted}
                  className="bg-green-600 hover:bg-green-700 text-black font-mono font-bold border-2 border-green-400"
                >
                  {'>'} Get Started
                </Button>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded bg-gray-900 border border-green-500 text-green-400 hover:bg-gray-800 transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-gray-900 border-t border-green-500 absolute top-16 left-0 right-0 shadow-2xl z-50">
          <nav className="px-4 py-4 space-y-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-green-400 hover:bg-gray-800 rounded font-mono text-sm border border-green-500/30"
                >
                  {'>'} DASHBOARD
                </Link>
                <Link
                  href="/fonts"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-green-400 hover:bg-gray-800 rounded font-mono text-sm border border-green-500/30"
                >
                  {'>'} FONTS
                </Link>
                <Link
                  href="/projects"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-green-400 hover:bg-gray-800 rounded font-mono text-sm border border-green-500/30"
                >
                  {'>'} PROJECTS
                </Link>
                <div className="pt-3 border-t border-green-500/30">
                  <div className="flex items-center gap-2 px-4 py-2 text-gray-400 font-mono text-sm">
                    <User size={18} className="text-green-400" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <Button
                    onClick={() => {
                      signOut()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full mt-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-500/50 font-mono"
                  >
                    <LogOut size={18} className="mr-2" />
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-gray-800 hover:bg-gray-700 text-green-400 font-mono border border-green-500">
                    {'>'} Sign In
                  </Button>
                </Link>
                <Button 
                  onClick={() => {
                    handleGetStarted()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-black font-mono font-bold border-2 border-green-400"
                >
                  {'>'} Get Started
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
