'use client'

import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { ExternalLink, Download, Upload, Edit, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function InstructionsPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 -z-10" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 md:p-8 relative">
          <div className="max-w-4xl mx-auto">
            {/* Glass header */}
            <div className="mb-6 md:mb-8 p-4 md:p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                How to Create Your Handwriting Font (FREE)
              </h1>
              <p className="text-gray-300 text-sm md:text-base lg:text-lg">
                Follow these simple steps to create your custom handwriting font using Calligraphr.com
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-4 md:space-y-6">
              {/* Step 1 */}
              <div className="group p-4 md:p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-102 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg shadow-purple-500/50 group-hover:scale-110 transition-transform duration-300">
                    1
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                      Go to Calligraphr.com
                    </h2>
                    <p className="text-white mb-4">
                      Visit the Calligraphr website and create a FREE account. No credit card required!
                    </p>
                    <a
                      href="https://www.calligraphr.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 rounded-lg transition-all duration-300 font-medium"
                    >
                      Visit Calligraphr.com
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="group p-4 md:p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-102 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg shadow-blue-500/50 group-hover:scale-110 transition-transform duration-300">
                    2
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                      Download Template
                    </h2>
                    <ul className="text-white space-y-2 mb-4">
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-green-400 mt-1 flex-shrink-0" />
                        <span className="text-white">Click "Create Template" in Calligraphr</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-green-400 mt-1 flex-shrink-0" />
                        <span className="text-white">Select "Minimal Set" (75 characters - FREE tier)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-green-400 mt-1 flex-shrink-0" />
                        <span className="text-white">Include: Uppercase (A-Z), Lowercase (a-z), Numbers (0-9), Punctuation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-green-400 mt-1 flex-shrink-0" />
                        <span className="text-white">Download the PDF template</span>
                      </li>
                    </ul>
                    <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-lg p-3">
                      <p className="text-sm text-white">
                        <strong className="text-blue-300">Tip:</strong> The free tier gives you 75 characters which is perfect for most use cases!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="group p-4 md:p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-102 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg shadow-green-500/50 group-hover:scale-110 transition-transform duration-300">
                    3
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                      Fill the Template
                    </h2>
                    <p className="text-white mb-3">Choose one of these methods:</p>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                        <h3 className="font-semibold text-white mb-2">Option A: Print & Scan</h3>
                        <ul className="text-sm text-white space-y-1">
                          <li className="text-white">• Print the template on white paper</li>
                          <li className="text-white">• Use a black pen (0.5-0.7mm)</li>
                          <li className="text-white">• Write naturally in each box</li>
                          <li className="text-white">• Scan at 300+ DPI</li>
                        </ul>
                      </div>
                      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                        <h3 className="font-semibold text-white mb-2">Option B: Digital</h3>
                        <ul className="text-sm text-white space-y-1">
                          <li className="text-white">• Use iPad/tablet with stylus</li>
                          <li className="text-white">• Open PDF in drawing app</li>
                          <li className="text-white">• Write in each character box</li>
                          <li className="text-white">• Export as PDF or image</li>
                        </ul>
                      </div>
                    </div>
                    <div className="bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-3">
                      <p className="text-sm text-white">
                        <strong className="text-yellow-300">Important:</strong> Stay within the boundaries and fill ALL boxes for best results!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="group p-4 md:p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-102 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg shadow-orange-500/50 group-hover:scale-110 transition-transform duration-300">
                    4
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                      Upload to Calligraphr
                    </h2>
                    <ul className="text-white space-y-2 mb-4">
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-green-400 mt-1 flex-shrink-0" />
                        <span className="text-white">Go back to Calligraphr.com</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-green-400 mt-1 flex-shrink-0" />
                        <span className="text-white">Upload your completed template</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-green-400 mt-1 flex-shrink-0" />
                        <span className="text-white">Review extracted characters (fix any errors)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-green-400 mt-1 flex-shrink-0" />
                        <span className="text-white">Click "Build Font"</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="group p-4 md:p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-102 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg shadow-pink-500/50 group-hover:scale-110 transition-transform duration-300">
                    5
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                      Download Your Font
                    </h2>
                    <p className="text-white mb-4">
                      Wait 1-2 minutes for processing, then download the .ttf file. 
                      Come back here and upload it to start creating PDFs!
                    </p>
                    <Link href="/fonts/upload">
                      <Button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/50 font-semibold">
                        <Upload size={18} className="mr-2" />
                        Upload My Font
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="mt-8 md:mt-12 p-4 md:p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-white mb-2">
                    Is this really free?
                  </h3>
                  <p className="text-white text-sm">
                    Yes! Calligraphr's free tier gives you 75 characters, which is enough for all letters, 
                    numbers, and basic punctuation. Our app is also completely free.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">
                    What file format should I use?
                  </h3>
                  <p className="text-white text-sm">
                    Calligraphr exports .ttf (TrueType Font) files. Our app supports both .ttf and .otf formats.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">
                    Can I upload multiple fonts?
                  </h3>
                  <p className="text-white text-sm">
                    Yes! You can create and upload as many fonts as you want, and choose which one to use for each project.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">
                    How long does it take?
                  </h3>
                  <p className="text-white text-sm">
                    Creating the font on Calligraphr takes 5-10 minutes. Once you have the file, 
                    uploading and using it here is instant!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
