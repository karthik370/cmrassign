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
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    My Projects
                  </h1>
                  <p className="text-gray-600">
                    View and manage your PDF projects ({projectCount}/{MAX_PROJECTS})
                  </p>
                </div>
                {hasReachedLimit ? (
                  <div className="text-right">
                    <Button disabled className="opacity-60 cursor-not-allowed">
                      <Plus size={18} className="mr-2" />
                      New Project
                    </Button>
                    <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                      <AlertCircle size={14} />
                      Maximum 5 projects limit reached
                    </p>
                  </div>
                ) : (
                  <Link href="/projects/new">
                    <Button>
                      <Plus size={18} className="mr-2" />
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
