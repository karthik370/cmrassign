'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import Link from 'next/link'
import { FileText, Type, Plus, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useProjects } from '@/hooks/useProjects'
import { useFonts } from '@/hooks/useFonts'

const MAX_PROJECTS = 5

export default function DashboardPage() {
  const { projects, loading: projectsLoading } = useProjects()
  const { fonts, loading: fontsLoading } = useFonts()
  
  const hasReachedLimit = projects.length >= MAX_PROJECTS

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
          <main className="flex-1 p-4 sm:p-6 md:p-8 relative">
            <div className="max-w-6xl mx-auto">
              {/* Glass header */}
              <div className="mb-6 md:mb-8 p-4 md:p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-sm md:text-base text-gray-300">
                  Welcome back! Here's an overview of your account.
                </p>
              </div>

              {/* Stats - Glassmorphism */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="group p-4 md:p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:scale-110 transition-transform duration-300">
                      <Type className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white mb-1">
                        {fontsLoading ? '...' : fonts.length}
                      </p>
                      <p className="text-sm text-gray-300">Fonts</p>
                    </div>
                  </div>
                </div>
                
                <div className="group p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/50 group-hover:scale-110 transition-transform duration-300">
                      <FileText className="text-white" size={28} />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white mb-1">
                        {projectsLoading ? '...' : projects.length}
                        <span className="text-lg text-gray-400">/{MAX_PROJECTS}</span>
                      </p>
                      <p className="text-sm text-gray-300">Projects</p>
                    </div>
                  </div>
                </div>
                
                <div className="group p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/50">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/50 group-hover:scale-110 transition-transform duration-300">
                      <FileText className="text-white" size={28} />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white mb-1">
                        {projectsLoading
                          ? '...'
                          : projects.filter((p) => p.status === 'completed').length}
                      </p>
                      <p className="text-sm text-gray-300">Completed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions - Glassmorphism */}
              <div className="p-4 md:p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  <Link href="/instructions">
                    <Button className="w-full h-14 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg">
                      <BookOpen size={20} className="mr-2" />
                      How to Create Font
                    </Button>
                  </Link>
                  <Link href="/fonts/upload">
                    <Button className="w-full h-14 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg">
                      <Type size={20} className="mr-2" />
                      Upload Font
                    </Button>
                  </Link>
                  {hasReachedLimit ? (
                    <div>
                      <Button disabled className="w-full h-14 bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-300 opacity-60 cursor-not-allowed">
                        <Plus size={20} className="mr-2" />
                        New Project
                      </Button>
                      <p className="text-xs text-red-300 mt-2 text-center">
                        Maximum {MAX_PROJECTS} projects reached
                      </p>
                    </div>
                  ) : (
                    <Link href="/projects/new">
                      <Button className="w-full h-14 bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/50 font-semibold">
                        <Plus size={20} className="mr-2" />
                        New Project
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Recent Projects - Glassmorphism */}
              <div className="p-4 md:p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    Recent Projects
                  </h2>
                  <Link href="/projects">
                    <Button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300">
                      View All
                    </Button>
                  </Link>
                </div>
                {projectsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-12 px-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                    <p className="text-gray-300 mb-4">
                      No projects yet. Create your first project to get started!
                    </p>
                    <Link href="/projects/new">
                      <Button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-purple-500/50">
                        <Plus size={18} className="mr-2" />
                        Create First Project
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {projects.slice(0, 5).map((project) => (
                      <Link
                        key={project.id}
                        href={`/projects/${project.id}/editor`}
                        className="block group"
                      >
                        <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-102 hover:shadow-xl">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 group-hover:scale-110 transition-transform duration-300">
                                <FileText className="text-purple-300" size={24} />
                              </div>
                              <div>
                                <p className="font-semibold text-white mb-1">
                                  {project.name}
                                </p>
                                <p className="text-sm text-gray-400">
                                  {project.page_count} pages
                                </p>
                              </div>
                            </div>
                            <span
                              className={`px-4 py-2 text-xs font-semibold rounded-full backdrop-blur-sm ${
                                project.status === 'completed'
                                  ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              }`}
                            >
                              {project.status}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
