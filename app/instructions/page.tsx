'use client'

import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { ExternalLink, Download, Upload, Edit, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function InstructionsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              How to Create Your Handwriting Font (FREE)
            </h1>
            <p className="text-gray-600 mb-8">
              Follow these simple steps to create your custom handwriting font using Calligraphr.com
            </p>

            {/* Steps */}
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Go to Calligraphr.com
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Visit the Calligraphr website and create a FREE account. No credit card required!
                    </p>
                    <a
                      href="https://www.calligraphr.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary-600 hover:underline font-medium"
                    >
                      Visit Calligraphr.com
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Download Template
                    </h2>
                    <ul className="text-gray-600 space-y-2 mb-4">
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                        <span>Click "Create Template" in Calligraphr</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                        <span>Select "Minimal Set" (75 characters - FREE tier)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                        <span>Include: Uppercase (A-Z), Lowercase (a-z), Numbers (0-9), Punctuation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                        <span>Download the PDF template</span>
                      </li>
                    </ul>
                    <div className="bg-blue-50 border border-blue-200 rounded p-3">
                      <p className="text-sm text-blue-800">
                        <strong>Tip:</strong> The free tier gives you 75 characters which is perfect for most use cases!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Fill the Template
                    </h2>
                    <p className="text-gray-600 mb-3">Choose one of these methods:</p>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="border rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Option A: Print & Scan</h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Print the template on white paper</li>
                          <li>• Use a black pen (0.5-0.7mm)</li>
                          <li>• Write naturally in each box</li>
                          <li>• Scan at 300+ DPI</li>
                        </ul>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Option B: Digital</h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Use iPad/tablet with stylus</li>
                          <li>• Open PDF in drawing app</li>
                          <li>• Write in each character box</li>
                          <li>• Export as PDF or image</li>
                        </ul>
                      </div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                      <p className="text-sm text-yellow-800">
                        <strong>Important:</strong> Stay within the boundaries and fill ALL boxes for best results!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    4
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Upload to Calligraphr
                    </h2>
                    <ul className="text-gray-600 space-y-2 mb-4">
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                        <span>Go back to Calligraphr.com</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                        <span>Upload your completed template</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                        <span>Review extracted characters (fix any errors)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                        <span>Click "Build Font"</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    5
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Download Your Font
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Wait 1-2 minutes for processing, then download the .ttf file. 
                      Come back here and upload it to start creating PDFs!
                    </p>
                    <Link href="/fonts/upload">
                      <Button>
                        <Upload size={18} className="mr-2" />
                        Upload My Font
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="mt-12 bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Is this really free?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Yes! Calligraphr's free tier gives you 75 characters, which is enough for all letters, 
                    numbers, and basic punctuation. Our app is also completely free.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    What file format should I use?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Calligraphr exports .ttf (TrueType Font) files. Our app supports both .ttf and .otf formats.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Can I upload multiple fonts?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Yes! You can create and upload as many fonts as you want, and choose which one to use for each project.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    How long does it take?
                  </h3>
                  <p className="text-gray-600 text-sm">
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
