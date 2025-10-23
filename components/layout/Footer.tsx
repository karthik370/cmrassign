'use client'

export const Footer = () => {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Handwriting PDF Generator. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-gray-600 hover:text-primary-600">
              Help
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-primary-600">
              Privacy
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-primary-600">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
