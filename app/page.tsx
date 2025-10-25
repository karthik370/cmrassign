'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { FileText, Upload, Edit, Download, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function HomePage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const handleGetStarted = () => {
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/auth/signup')
    }
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-black">
        {/* Hero Section - Hacker Style */}
        <section className="bg-gradient-to-b from-gray-900 via-black to-gray-900 py-20 relative overflow-hidden">
          {/* Matrix-style background effect - Client only to avoid hydration error */}
          {mounted && (
            <div className="absolute inset-0 opacity-10">
              <div className="text-green-500 font-mono text-xs animate-pulse">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="whitespace-nowrap overflow-hidden">
                    {Array.from({ length: 100 }).map((_, j) => (
                      <span key={j}>{Math.random() > 0.5 ? '1' : '0'}</span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="container-custom relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              {/* Terminal-style header */}
              <div className="mb-4 flex justify-center">
                <div className="bg-gray-800 border border-green-500 rounded px-4 py-2 font-mono text-green-400 text-sm">
                  <span className="text-green-500">root@cmr:~$</span> init_assignment_generator.sh
                </div>
              </div>
              
              <h1 className="text-6xl font-bold text-green-400 mb-4 font-mono tracking-tight">
                CMR ASSIGNMENT
              </h1>
              <div className="text-2xl text-green-300 mb-2 font-mono">
                {'>'} Handwriting PDF Generator
              </div>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                <span className="text-green-500 font-mono">[SYSTEM]</span> Convert digital text to handwritten PDFs instantly.<br/>
                Pre-loaded fonts available + Upload your custom handwriting fonts.<br/>
                <span className="text-cyan-400">Perfect for assignments, forms, and documents.</span>
              </p>
              
              <div className="flex gap-4 justify-center mb-6">
                <Button 
                  size="lg" 
                  onClick={handleGetStarted} 
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-black font-mono font-bold border-2 border-green-400 shadow-lg shadow-green-500/50"
                >
                  <span className="text-black">{'>'}</span> {user ? 'ACCESS DASHBOARD' : 'INITIALIZE SYSTEM'}
                </Button>
                <Link href="/instructions">
                  <Button 
                    size="lg" 
                    className="bg-gray-800 hover:bg-gray-700 text-green-400 font-mono border-2 border-green-500"
                  >
                    <span>{'>'}</span> DOCUMENTATION
                  </Button>
                </Link>
              </div>
              
              {/* Terminal output style */}
              <div className="bg-gray-900 border border-green-500 rounded-lg p-4 text-left font-mono text-sm max-w-2xl mx-auto">
                <div className="text-green-400">
                  <span className="text-green-500">$</span> Features:
                </div>
                <div className="text-gray-400 ml-4 space-y-1">
                  <div>✓ 50+ Pre-loaded Handwriting Fonts</div>
                  <div>✓ Upload Custom Fonts (TTF/OTF)</div>
                  <div>✓ Real-time PDF Editor</div>
                  <div>✓ Instant Download</div>
                  <div className="text-cyan-400">✓ Assignment Ready Output</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Hacker Style */}
        <section className="py-20 bg-gray-900">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-green-400 mb-2 font-mono">
                {'>'} EXECUTION PROTOCOL
              </h2>
              <p className="text-gray-400 font-mono text-sm">// 4-step deployment sequence</p>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-black border border-green-500 p-6 rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all">
                <div className="w-16 h-16 bg-gray-800 border-2 border-green-500 rounded flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-green-400" size={32} />
                </div>
                <h3 className="font-mono font-bold text-lg mb-2 text-green-300 text-center">STEP 1: SELECT_FONT</h3>
                <p className="text-gray-400 text-sm text-center font-mono">
                  Choose from 50+ pre-loaded fonts OR upload custom TTF/OTF
                </p>
              </div>
              <div className="bg-black border border-green-500 p-6 rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all">
                <div className="w-16 h-16 bg-gray-800 border-2 border-green-500 rounded flex items-center justify-center mx-auto mb-4">
                  <Upload className="text-green-400" size={32} />
                </div>
                <h3 className="font-mono font-bold text-lg mb-2 text-green-300 text-center">STEP 2: UPLOAD_PDF</h3>
                <p className="text-gray-400 text-sm text-center font-mono">
                  Upload your assignment PDF document
                </p>
              </div>
              <div className="bg-black border border-green-500 p-6 rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all">
                <div className="w-16 h-16 bg-gray-800 border-2 border-green-500 rounded flex items-center justify-center mx-auto mb-4">
                  <Edit className="text-green-400" size={32} />
                </div>
                <h3 className="font-mono font-bold text-lg mb-2 text-green-300 text-center">STEP 3: GENERATE_TEXT</h3>
                <p className="text-gray-400 text-sm text-center font-mono">
                  Type/paste content, apply handwriting style
                </p>
              </div>
              <div className="bg-black border border-green-500 p-6 rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all">
                <div className="w-16 h-16 bg-gray-800 border-2 border-green-500 rounded flex items-center justify-center mx-auto mb-4">
                  <Download className="text-green-400" size={32} />
                </div>
                <h3 className="font-mono font-bold text-lg mb-2 text-green-300 text-center">STEP 4: EXPORT_PDF</h3>
                <p className="text-gray-400 text-sm text-center font-mono">
                  Download completed assignment-ready PDF
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section - Hacker Style */}
        <section className="bg-black py-20 border-t border-green-500">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-green-400 mb-2 font-mono">
                {'>'} SYSTEM_ADVANTAGES
              </h2>
              <p className="text-gray-400 font-mono text-sm">// Optimized for performance</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-900 border border-green-500 p-6 rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all">
                <CheckCircle className="text-green-400 mb-4" size={32} />
                <h3 className="font-mono font-bold text-lg mb-2 text-green-300">INSTANT_DEPLOYMENT</h3>
                <p className="text-gray-400 font-mono text-sm">
                  Zero latency. Real-time PDF generation. No server queues.
                </p>
              </div>
              <div className="bg-gray-900 border border-green-500 p-6 rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all">
                <CheckCircle className="text-green-400 mb-4" size={32} />
                <h3 className="font-mono font-bold text-lg mb-2 text-green-300">FONT_LIBRARY</h3>
                <p className="text-gray-400 font-mono text-sm">
                  50+ pre-loaded handwriting fonts + custom upload support (TTF/OTF).
                </p>
              </div>
              <div className="bg-gray-900 border border-green-500 p-6 rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all">
                <CheckCircle className="text-green-400 mb-4" size={32} />
                <h3 className="font-mono font-bold text-lg mb-2 text-green-300">ASSIGNMENT_READY</h3>
                <p className="text-gray-400 font-mono text-sm">
                  Professional output. Authentic handwriting. CMR approved.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Hacker Style */}
        <section className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
          {/* Animated lines */}
          <div className="absolute inset-0 opacity-20">
            <div className="h-px bg-green-500 animate-pulse"></div>
          </div>
          
          <div className="container-custom text-center relative z-10">
            <div className="bg-gray-900 border-2 border-green-500 rounded-lg p-12 max-w-3xl mx-auto shadow-2xl shadow-green-500/20">
              <div className="font-mono text-green-400 text-sm mb-4">
                $ system.status --check
              </div>
              <h2 className="text-4xl font-bold text-green-400 mb-4 font-mono">
                {'>'} READY_TO_EXECUTE?
              </h2>
              <p className="text-xl text-gray-300 mb-8 font-mono">
                Deploy your first assignment in {'<'} 60 seconds
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={handleGetStarted} 
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-black font-mono font-bold border-2 border-green-400 shadow-lg shadow-green-500/50 text-lg px-8"
                >
                  {'>'} {user ? 'ACCESS_SYSTEM()' : 'INITIALIZE_NOW()'}
                </Button>
              </div>
              <div className="mt-6 text-cyan-400 font-mono text-sm">
                [INFO] One-time payment • Lifetime access • No subscriptions
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
