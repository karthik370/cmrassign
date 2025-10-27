import { Header } from '@/components/layout/Header'
import Link from 'next/link'

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping & Delivery Policy</h1>
          <p className="text-sm text-gray-600 mb-8">Last Updated: October 27, 2025</p>

          <div className="prose prose-lg max-w-none">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
              <h2 className="text-xl font-semibold text-blue-900 mt-0">📱 Digital Service - No Physical Shipping</h2>
              <p className="text-blue-800 mb-0">
                CMR Assignment is a <strong>100% digital service</strong>. We do not ship any physical products. All services are delivered electronically through our web platform.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Service Delivery Method</h2>
            <p className="text-gray-700 mb-4">
              CMR Assignment provides:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Instant Access:</strong> Create an account and start using the service immediately</li>
              <li><strong>Digital PDF Downloads:</strong> Generate and download handwritten PDFs directly from your browser</li>
              <li><strong>Cloud Storage:</strong> Your projects are stored securely in the cloud and accessible anytime</li>
              <li><strong>No Waiting:</strong> No shipping times or delivery delays</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. How to Access Your Service</h2>
            <p className="text-gray-700 mb-4">
              After signing up:
            </p>
            <ol className="list-decimal pl-6 text-gray-700 mb-4">
              <li>Create an account at <Link href="/auth/signup" className="text-blue-600 hover:underline">cmrassign.vercel.app</Link></li>
              <li>Log in to your dashboard</li>
              <li>Start creating handwritten PDF projects immediately</li>
              <li>Download your completed PDFs with one click</li>
            </ol>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Instant Delivery Guarantee</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-800 font-semibold mb-2">✅ 100% Instant Access</p>
              <p className="text-green-700 mb-0">
                All features are available immediately upon account creation. There are no delivery delays, shipping fees, or waiting periods.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Digital Download Details</h2>
            <p className="text-gray-700 mb-4">
              <strong>PDF Generation & Download:</strong>
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Processing Time:</strong> 5-30 seconds (depending on project size)</li>
              <li><strong>Download Speed:</strong> Depends on your internet connection</li>
              <li><strong>File Format:</strong> Standard PDF (compatible with all devices)</li>
              <li><strong>Download Limit:</strong> Unlimited downloads of your generated PDFs</li>
              <li><strong>Storage:</strong> Projects saved in cloud for 30 days minimum</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. No Shipping Charges</h2>
            <p className="text-gray-700 mb-4">
              Since CMR Assignment is a digital service:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>❌ No shipping fees</li>
              <li>❌ No handling charges</li>
              <li>❌ No delivery delays</li>
              <li>❌ No customs or import duties</li>
              <li>✅ Instant global access from anywhere</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Delivery Confirmation</h2>
            <p className="text-gray-700 mb-4">
              Delivery is confirmed when:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>You successfully create an account (email verification sent)</li>
              <li>You can log in to your dashboard</li>
              <li>You can create and download PDF projects</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Access Issues</h2>
            <p className="text-gray-700 mb-4">
              If you experience any issues accessing the service:
            </p>
            <ol className="list-decimal pl-6 text-gray-700 mb-4">
              <li><strong>Check your email:</strong> Verify your account via the confirmation email</li>
              <li><strong>Clear browser cache:</strong> Sometimes helps with login issues</li>
              <li><strong>Try a different browser:</strong> Chrome, Firefox, or Edge recommended</li>
              <li><strong>Contact support:</strong> Email <a href="mailto:37karthikreddy@gmail.com" className="text-blue-600 hover:underline">37karthikreddy@gmail.com</a></li>
            </ol>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. International Access</h2>
            <p className="text-gray-700 mb-4">
              <strong>Global Availability:</strong> CMR Assignment is accessible worldwide from any country with internet access.
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>No geographic restrictions</li>
              <li>No international shipping complications</li>
              <li>Same service quality everywhere</li>
              <li>24/7 availability (except during maintenance)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. System Requirements</h2>
            <p className="text-gray-700 mb-4">
              To access CMR Assignment, you need:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Device:</strong> Computer, tablet, or smartphone</li>
              <li><strong>Browser:</strong> Chrome, Firefox, Safari, or Edge (latest versions)</li>
              <li><strong>Internet:</strong> Stable internet connection (2+ Mbps recommended)</li>
              <li><strong>Storage:</strong> Space to download PDFs (varies by project size)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Download Problems</h2>
            <p className="text-gray-700 mb-4">
              If your PDF download fails:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Check your internet connection</li>
              <li>Ensure you have storage space on your device</li>
              <li>Try downloading in a different browser</li>
              <li>Disable browser extensions that might block downloads</li>
              <li>Contact support if the issue persists</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. Service Uptime</h2>
            <p className="text-gray-700 mb-4">
              We strive for 99.9% uptime, but occasionally:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Scheduled maintenance may occur (notified in advance)</li>
              <li>Emergency updates for security or bug fixes</li>
              <li>Third-party service interruptions (rare)</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Service status and maintenance windows will be announced via email.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">12. Premium Features (If Applicable)</h2>
            <p className="text-gray-700 mb-4">
              If we introduce paid premium features in the future:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Premium access is granted immediately upon payment confirmation</li>
              <li>No waiting period for feature activation</li>
              <li>Instant upgrade from free to premium tier</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">13. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              For questions about service delivery or access:
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Email:</strong> <a href="mailto:37karthikreddy@gmail.com" className="text-blue-600 hover:underline">37karthikreddy@gmail.com</a><br />
              <strong>Website:</strong> <Link href="/" className="text-blue-600 hover:underline">cmrassign.vercel.app</Link><br />
              <strong>Response Time:</strong> Within 24 hours (Monday-Friday)
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">14. Changes to This Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Shipping & Delivery Policy to reflect changes in our service. Updates will be posted on this page with a revised "Last Updated" date.
            </p>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                This Shipping & Delivery Policy is part of our <Link href="/legal/terms" className="text-blue-600 hover:underline">Terms and Conditions</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
