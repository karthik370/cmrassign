'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { FileText, LogOut, User } from 'lucide-react'

export const Header = () => {
  const { user, signOut } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2">
            <FileText className="text-primary-600" size={28} />
            <span className="text-xl font-bold text-gray-900">
              Handwriting PDF
            </span>
          </Link>

          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-primary-600"
                >
                  Dashboard
                </Link>
                <Link
                  href="/fonts"
                  className="text-gray-700 hover:text-primary-600"
                >
                  Fonts
                </Link>
                <Link
                  href="/projects"
                  className="text-gray-700 hover:text-primary-600"
                >
                  Projects
                </Link>
                <div className="flex items-center gap-2 ml-4 border-l pl-4">
                  <User size={20} className="text-gray-600" />
                  <span className="text-sm text-gray-700">{user.email}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut()}
                  >
                    <LogOut size={18} />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
