'use client'

import { ProjectCard } from './ProjectCard'
import { useProjects } from '@/hooks/useProjects'
import { Loading } from '@/components/ui/Loading'

export const ProjectList = () => {
  const { projects, loading, deleteProject, generatePDF } = useProjects()

  const handleDelete = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject(projectId)
    }
  }

  const handleDownload = async (projectId: string) => {
    const project = projects.find((p) => p.id === projectId)
    if (project?.processed_pdf_url) {
      window.open(project.processed_pdf_url, '_blank')
    }
  }

  if (loading) {
    return <Loading text="Loading projects..." />
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No projects yet. Create your first project to get started!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onDelete={handleDelete}
          onDownload={handleDownload}
        />
      ))}
    </div>
  )
}
