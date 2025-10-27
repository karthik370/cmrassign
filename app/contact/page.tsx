import { Header } from '@/components/layout/Header'
import { Mail, MessageSquare, MapPin, Clock } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 mb-8">
            Have questions or need assistance? We're here to help!
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Contact Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
              
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Mail className="text-purple-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
                  <a href="mailto:37karthikreddy@gmail.com" className="text-purple-600 hover:underline">
                    37karthikreddy@gmail.com
                  </a>
                  <p className="text-sm text-gray-600 mt-1">
                    We typically respond within 24 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <MessageSquare className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">General Inquiries</h3>
                  <a href="mailto:37karthikreddy@gmail.com" className="text-blue-600 hover:underline">
                    37karthikreddy@gmail.com
                  </a>
                  <p className="text-sm text-gray-600 mt-1">
                    For business partnerships and collaborations
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Clock className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Response Time</h3>
                  <p className="text-gray-700">
                    Monday - Friday: 9:00 AM - 6:00 PM IST
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Weekend messages will be answered on the next business day
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <MapPin className="text-orange-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                  <p className="text-gray-700">
                    India
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Operating remotely across India
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Help Section */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Help</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">📚 Frequently Asked Questions</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    Find answers to common questions about using CMR Assignment.
                  </p>
                  <a href="/instructions" className="text-purple-600 hover:underline text-sm font-medium">
                    View Instructions →
                  </a>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">🔧 Technical Issues</h3>
                  <p className="text-sm text-gray-700">
                    If you're experiencing technical problems:
                  </p>
                  <ul className="text-sm text-gray-700 list-disc pl-5 mt-2 space-y-1">
                    <li>Clear your browser cache</li>
                    <li>Try a different browser</li>
                    <li>Check your internet connection</li>
                    <li>Contact support if issue persists</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">💳 Billing Questions</h3>
                  <p className="text-sm text-gray-700">
                    For payment or subscription inquiries, email us with your account details.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="border-t pt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send Us a Message</h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="How can we help?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Tell us more about your inquiry..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl font-semibold"
              >
                Send Message
              </button>
            </form>
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> For urgent issues, please email us directly at{' '}
              <a href="mailto:37karthikreddy@gmail.com" className="underline">
                37karthikreddy@gmail.com
              </a>
              {' '}for a faster response.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
