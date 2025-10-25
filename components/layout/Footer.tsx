'use client'

export const Footer = () => {
  return (
    <footer className="bg-black border-t-2 border-green-500 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="font-mono">
            <p className="text-sm text-gray-400">
              <span className="text-green-400">© {new Date().getFullYear()} CMR Assignment</span> 
              <span className="text-gray-600"> // </span>
              <span className="text-gray-500">Handwriting System v1.0</span>
            </p>
            <p className="text-xs text-gray-600 mt-1">
              $ echo "All rights reserved" | grep -i assignment
            </p>
          </div>
          <div className="flex gap-6 font-mono">
            <a href="#" className="text-sm text-green-400 hover:text-green-300 transition-colors">
              {'>'} HELP
            </a>
            <a href="#" className="text-sm text-green-400 hover:text-green-300 transition-colors">
              {'>'} PRIVACY
            </a>
            <a href="#" className="text-sm text-green-400 hover:text-green-300 transition-colors">
              {'>'} TERMS
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
