'use client'

import Link from 'next/link'
import { FileText, Download, Trash2, Edit } from 'lucide-react'
import { Project } from '@/types/project'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'

interface ProjectCardProps {
  project: Project
  onDelete: (projectId: string) => void
  onDownload?: (projectId: string) => void
}

export const ProjectCard = ({ project, onDelete, onDownload }: ProjectCardProps) => {
  const statusColors = {
    draft: 'bg-gray-100 text-gray-700',
    processing: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
  }

  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <FileText className="text-primary-600 mt-1" size={24} />
            <div>
              <h3 className="font-semibold text-gray-900">{project.name}</h3>
              <p className="text-xs text-gray-500 mt-1">
                {project.page_count} pages • {formatDate(project.created_at)}
              </p>
              {project.font && (
                <p className="text-xs text-gray-500">Font: {project.font.name}</p>
              )}
            </div>
          </div>
          <span className={`px-2 py-1 text-xs rounded ${statusColors[project.status]}`}>
            {project.status}
          </span>
        </div>

        <div className="flex gap-2 border-t pt-3">
          <Link href={`/projects/${project.id}/editor`} className="flex-1">
            <Button variant="primary" size="sm" className="w-full">
              <Edit size={16} className="mr-1" />
              Edit
            </Button>
          </Link>
          
          {project.processed_pdf_url && onDownload && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownload(project.id)}
            >
              <Download size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
