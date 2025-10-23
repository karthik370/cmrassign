'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FileText, Type, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Fonts', href: '/fonts', icon: Type },
  { name: 'Projects', href: '/projects', icon: FileText },
  { name: 'Instructions', href: '/instructions', icon: BookOpen },
]

export const Sidebar = () => {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r min-h-screen">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
