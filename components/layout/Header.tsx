'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { FileText, LogOut, User } from 'lucide-react'

export const Header = () => {
  const router = useRouter()
  const { user, signOut } = useAuth()
  
  const handleGetStarted = () => {
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/auth/signup')
    }
  }

  return (
    <header className="bg-black shadow-lg border-b-2 border-green-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-3 group">
            <div className="bg-gray-900 border-2 border-green-500 rounded p-2 group-hover:bg-gray-800 transition-colors">
              <FileText className="text-green-400" size={24} />
            </div>
            <div>
              <span className="text-xl font-bold text-green-400 font-mono block leading-tight">
                CMR ASSIGNMENT
              </span>
              <span className="text-xs text-gray-500 font-mono">
                {'>'} Handwriting System
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-4">
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
                  <span className="text-sm text-gray-400 font-mono">{user.email}</span>
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
        </div>
      </div>
    </header>
  )
}
