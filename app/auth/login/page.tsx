import { LoginForm } from '@/components/auth/LoginForm'
import { FileText } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <FileText className="text-primary-600" size={32} />
            <span className="text-2xl font-bold text-gray-900">
              Handwriting PDF
            </span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back! Please enter your details.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
