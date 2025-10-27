import { Header } from '@/components/layout/Header'
import Link from 'next/link'

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Refund Policy</h1>
          <p className="text-sm text-gray-600 mb-8">Last Updated: October 26, 2025</p>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Overview</h2>
            <p className="text-gray-700 mb-4">
              At CMR Assignment, customer satisfaction is our top priority. This Refund Policy outlines the conditions under which refunds may be issued for our services.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Free Service</h2>
            <p className="text-gray-700 mb-4">
              Currently, CMR Assignment is a <strong>free service</strong>. As no payment is required to use our handwriting PDF creation tool, refunds are not applicable at this time.
            </p>
            <p className="text-gray-700 mb-4">
              Users can:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Create up to 5 projects without any charges</li>
              <li>Upload custom fonts at no cost</li>
              <li>Generate and download unlimited PDFs</li>
              <li>Cancel their account at any time without penalties</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Future Paid Services</h2>
            <p className="text-gray-700 mb-4">
              If we introduce paid features or premium subscriptions in the future, the following refund policy will apply:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.1 Premium Subscriptions</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>7-Day Money-Back Guarantee:</strong> Full refund available within 7 days of purchase if you are not satisfied</li>
              <li><strong>Cancellation:</strong> Cancel anytime; no further charges will be made</li>
              <li><strong>Partial Refunds:</strong> Prorated refunds may be available for annual subscriptions canceled mid-term</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.2 One-Time Purchases</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Digital Products:</strong> Refundable within 14 days if the product is defective or not as described</li>
              <li><strong>Custom Services:</strong> Refunds available before work begins; partial refunds for work in progress</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Non-Refundable Items</h2>
            <p className="text-gray-700 mb-4">
              The following are NOT eligible for refunds (when applicable to paid services):
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Services already fully rendered</li>
              <li>Downloadable content that has been accessed or downloaded</li>
              <li>Violation of Terms of Service leading to account termination</li>
              <li>Purchases made more than 30 days ago (unless required by law)</li>
              <li>Third-party fees (payment processing, bank charges, etc.)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. How to Request a Refund</h2>
            <p className="text-gray-700 mb-4">
              If paid services become available and you wish to request a refund:
            </p>
            <ol className="list-decimal pl-6 text-gray-700 mb-4">
              <li>Contact us at <strong>support@cmrassignment.com</strong></li>
              <li>Include your account email and transaction details</li>
              <li>Provide a reason for the refund request</li>
              <li>Allow 5-7 business days for review</li>
            </ol>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Refund Processing Time</h2>
            <p className="text-gray-700 mb-4">
              Once a refund is approved:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Credit/Debit Cards:</strong> 5-10 business days</li>
              <li><strong>UPI/Net Banking:</strong> 3-7 business days</li>
              <li><strong>Digital Wallets:</strong> 1-3 business days</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Processing times may vary depending on your bank or payment provider.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Chargebacks</h2>
            <p className="text-gray-700 mb-4">
              If you initiate a chargeback without first contacting us:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Your account may be suspended immediately</li>
              <li>Access to all services will be revoked</li>
              <li>We reserve the right to dispute illegitimate chargebacks</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Please contact our support team first to resolve any billing disputes.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Account Cancellation</h2>
            <p className="text-gray-700 mb-4">
              You may cancel your account at any time:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Free accounts: Cancel anytime with no penalties</li>
              <li>Paid accounts (if applicable): Cancel to prevent future billing; remaining subscription period will stay active</li>
              <li>All your data will be permanently deleted 30 days after cancellation</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Modifications to Policy</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify this Refund Policy at any time. Changes will be posted on this page with an updated "Last Updated" date. Continued use of our services after changes constitutes acceptance of the modified policy.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              For questions about this Refund Policy or to request a refund (when applicable), contact us at:
            </p>
            <p className="text-gray-700 mb-4">
              Email: <a href="mailto:37karthikreddy@gmail.com" className="text-blue-600 hover:underline font-semibold">37karthikreddy@gmail.com</a><br />
              Website: <Link href="/" className="text-blue-600 hover:underline">https://cmrassign.vercel.app</Link>
            </p>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                This Refund Policy is part of our <Link href="/legal/terms" className="text-blue-600 hover:underline">Terms and Conditions</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
