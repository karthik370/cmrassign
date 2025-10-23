import Link from 'next/link'
import { FileText, Upload, Edit, Download, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary-50 to-white py-20">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Convert Your Handwriting to PDF
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Create custom handwriting fonts and apply them to PDF documents. 
                Perfect for assignments, forms, and documents.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/auth/signup">
                  <Button size="lg">Get Started Free</Button>
                </Link>
                <Link href="/instructions">
                  <Button size="lg" variant="outline">
                    How It Works
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              How It Works
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-primary-600" size={32} />
                </div>
                <h3 className="font-semibold text-lg mb-2">1. Create Font</h3>
                <p className="text-gray-600 text-sm">
                  Create your handwriting font on Calligraphr.com (FREE)
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="text-primary-600" size={32} />
                </div>
                <h3 className="font-semibold text-lg mb-2">2. Upload</h3>
                <p className="text-gray-600 text-sm">
                  Upload your font file and PDF document
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Edit className="text-primary-600" size={32} />
                </div>
                <h3 className="font-semibold text-lg mb-2">3. Edit</h3>
                <p className="text-gray-600 text-sm">
                  Add text to your PDF using your custom font
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="text-primary-600" size={32} />
                </div>
                <h3 className="font-semibold text-lg mb-2">4. Download</h3>
                <p className="text-gray-600 text-sm">
                  Generate and download your completed PDF
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-gray-50 py-20">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why Choose Us?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <CheckCircle className="text-green-600 mb-4" size={32} />
                <h3 className="font-semibold text-lg mb-2">100% Free</h3>
                <p className="text-gray-600">
                  No hidden costs. Use Calligraphr's free tier and our free service.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <CheckCircle className="text-green-600 mb-4" size={32} />
                <h3 className="font-semibold text-lg mb-2">Easy to Use</h3>
                <p className="text-gray-600">
                  Simple interface with step-by-step instructions.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <CheckCircle className="text-green-600 mb-4" size={32} />
                <h3 className="font-semibold text-lg mb-2">Professional Results</h3>
                <p className="text-gray-600">
                  High-quality PDFs with your authentic handwriting.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Create your first handwriting PDF in minutes
            </p>
            <Link href="/auth/signup">
              <Button size="lg">Sign Up Free</Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
