import { Header } from '@/components/layout/Header'
import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
          <p className="text-sm text-gray-600 mb-8">Last Updated: October 26, 2025</p>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using CMR Assignment ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use the Service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 mb-4">
              CMR Assignment is a web-based handwriting PDF creation tool that allows users to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Upload or select from pre-installed handwriting fonts</li>
              <li>Create custom handwritten PDF documents</li>
              <li>Manage multiple projects (up to 5 projects per account)</li>
              <li>Download generated PDFs for personal or educational use</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. User Accounts</h2>
            <p className="text-gray-700 mb-4">
              To use the Service, you must create an account. You are responsible for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Providing accurate and complete registration information</li>
              <li>Notifying us immediately of any unauthorized use of your account</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. User Conduct</h2>
            <p className="text-gray-700 mb-4">
              You agree NOT to use the Service to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights of others</li>
              <li>Upload malicious code, viruses, or harmful content</li>
              <li>Impersonate others or misrepresent your affiliation</li>
              <li>Use the Service for commercial purposes without authorization</li>
              <li>Attempt to reverse engineer or hack the Service</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Content Ownership</h2>
            <p className="text-gray-700 mb-4">
              <strong>Your Content:</strong> You retain all rights to the text content you input and the PDFs you generate. We do not claim ownership of your content.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Uploaded Fonts:</strong> You must have the legal right to use any fonts you upload. We are not responsible for copyright infringement related to user-uploaded fonts.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Our Content:</strong> All pre-installed fonts, software, design, and service features are owned by CMR Assignment and protected by copyright laws.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Service Limitations</h2>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Project Limit:</strong> Free accounts are limited to 5 projects</li>
              <li><strong>Storage:</strong> We reserve the right to limit storage space per user</li>
              <li><strong>Usage:</strong> Excessive usage may result in temporary account restrictions</li>
              <li><strong>Availability:</strong> We do not guarantee 100% uptime and may perform maintenance without notice</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              The Service and its original content (excluding user-generated content) are the exclusive property of CMR Assignment. You may not reproduce, distribute, modify, or create derivative works without our written permission.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Termination</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to terminate or suspend your account immediately, without prior notice, for any reason including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Violation of these Terms and Conditions</li>
              <li>Fraudulent or illegal activity</li>
              <li>Requests by law enforcement or government agencies</li>
              <li>Extended periods of inactivity</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Disclaimer of Warranties</h2>
            <p className="text-gray-700 mb-4">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>The Service will be uninterrupted, secure, or error-free</li>
              <li>The results obtained from the Service will be accurate or reliable</li>
              <li>Any errors in the Service will be corrected</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, CMR ASSIGNMENT SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF DATA, USE, PROFITS, OR OTHER INTANGIBLE LOSSES.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. Indemnification</h2>
            <p className="text-gray-700 mb-4">
              You agree to indemnify and hold harmless CMR Assignment from any claims, losses, damages, liabilities, and expenses arising from:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">12. Changes to Terms</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of the Service after changes constitutes acceptance of the modified Terms.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">13. Governing Law</h2>
            <p className="text-gray-700 mb-4">
              These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">14. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              For questions about these Terms, please contact us at:
            </p>
            <p className="text-gray-700 mb-4">
              Email: support@cmrassignment.com<br />
              Website: <Link href="/" className="text-blue-600 hover:underline">cmrassignment.com</Link>
            </p>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                By using CMR Assignment, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
