'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { ProjectList } from '@/components/project/ProjectList'
import { Button } from '@/components/ui/Button'
import { Plus, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useProjects } from '@/hooks/useProjects'

const MAX_PROJECTS = 5

export default function ProjectsPage() {
  const { projects } = useProjects()
  const projectCount = projects.length
  const hasReachedLimit = projectCount >= MAX_PROJECTS

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        {/* Animated background */}
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 -z-10" />
        <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-8 relative">
            <div className="max-w-6xl mx-auto">
              {/* Glass header */}
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8 p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    My Projects
                  </h1>
                  <p className="text-gray-300">
                    View and manage your PDF projects ({projectCount}/{MAX_PROJECTS})
                  </p>
                </div>
                {hasReachedLimit ? (
                  <div className="text-right">
                    <Button disabled className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-300 opacity-60 cursor-not-allowed h-12 px-6">
                      <Plus size={20} className="mr-2" />
                      New Project
                    </Button>
                    <p className="text-xs text-red-300 mt-2 flex items-center gap-1 justify-end">
                      <AlertCircle size={14} />
                      Maximum {MAX_PROJECTS} projects limit reached
                    </p>
                  </div>
                ) : (
                  <Link href="/projects/new">
                    <Button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/50 font-semibold h-12 px-6">
                      <Plus size={20} className="mr-2" />
                      New Project
                    </Button>
                  </Link>
                )}
              </div>

              <ProjectList />
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
