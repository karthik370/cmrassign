'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import Link from 'next/link'
import { FileText, Type, Plus, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useProjects } from '@/hooks/useProjects'
import { useFonts } from '@/hooks/useFonts'

export default function DashboardPage() {
  const { projects, loading: projectsLoading } = useProjects()
  const { fonts, loading: fontsLoading } = useFonts()

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600 mb-8">
                Welcome back! Here's an overview of your account.
              </p>

              {/* Stats */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Type className="text-primary-600" size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {fontsLoading ? '...' : fonts.length}
                      </p>
                      <p className="text-sm text-gray-600">Fonts</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <FileText className="text-green-600" size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {projectsLoading ? '...' : projects.length}
                      </p>
                      <p className="text-sm text-gray-600">Projects</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {projectsLoading
                          ? '...'
                          : projects.filter((p) => p.status === 'completed').length}
                      </p>
                      <p className="text-sm text-gray-600">Completed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <Link href="/instructions">
                    <Button variant="outline" className="w-full">
                      <BookOpen size={18} className="mr-2" />
                      How to Create Font
                    </Button>
                  </Link>
                  <Link href="/fonts/upload">
                    <Button variant="outline" className="w-full">
                      <Type size={18} className="mr-2" />
                      Upload Font
                    </Button>
                  </Link>
                  <Link href="/projects/new">
                    <Button variant="primary" className="w-full">
                      <Plus size={18} className="mr-2" />
                      New Project
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Recent Projects */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Recent Projects
                  </h2>
                  <Link href="/projects">
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
                {projectsLoading ? (
                  <p className="text-gray-500">Loading...</p>
                ) : projects.length === 0 ? (
                  <p className="text-gray-500">
                    No projects yet. Create your first project to get started!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {projects.slice(0, 5).map((project) => (
                      <Link
                        key={project.id}
                        href={`/projects/${project.id}/editor`}
                        className="block p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="text-gray-400" size={20} />
                            <div>
                              <p className="font-medium text-gray-900">
                                {project.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {project.page_count} pages
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              project.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {project.status}
                          </span>
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
