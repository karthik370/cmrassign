import { Header } from '@/components/layout/Header'
import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-sm text-gray-600 mb-8">Last Updated: October 26, 2025</p>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              Welcome to CMR Assignment. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our handwriting PDF creation service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.1 Personal Information</h3>
            <p className="text-gray-700 mb-4">
              When you register for an account, we collect:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Email Address:</strong> For account creation and authentication</li>
              <li><strong>Password:</strong> Encrypted and stored securely</li>
              <li><strong>Username:</strong> Optional, for personalization</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.2 Usage Data</h3>
            <p className="text-gray-700 mb-4">
              We automatically collect information about how you use our service:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Project Data:</strong> Text content, font selections, and PDF settings</li>
              <li><strong>Uploaded Fonts:</strong> Custom fonts you upload (stored securely)</li>
              <li><strong>Device Information:</strong> Browser type, operating system, IP address</li>
              <li><strong>Log Data:</strong> Access times, pages viewed, errors encountered</li>
              <li><strong>Cookies:</strong> Session cookies for authentication and preferences</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.3 Third-Party Data</h3>
            <p className="text-gray-700 mb-4">
              We use the following third-party services that may collect data:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Supabase:</strong> Database and authentication provider</li>
              <li><strong>Vercel:</strong> Hosting and deployment platform</li>
              <li><strong>SendGrid:</strong> Email delivery service</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              We use your information to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Provide, operate, and maintain our service</li>
              <li>Create and manage your account</li>
              <li>Process and store your projects and fonts</li>
              <li>Send you important service notifications and updates</li>
              <li>Respond to your comments, questions, and support requests</li>
              <li>Improve our service and develop new features</li>
              <li>Detect and prevent fraud, abuse, or security issues</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Data Storage and Security</h2>
            <p className="text-gray-700 mb-4">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Encryption:</strong> All data is encrypted in transit (HTTPS) and at rest</li>
              <li><strong>Password Security:</strong> Passwords are hashed using bcrypt</li>
              <li><strong>Access Controls:</strong> Limited access to personal data by authorized personnel only</li>
              <li><strong>Regular Backups:</strong> Automated backups to prevent data loss</li>
              <li><strong>Secure Hosting:</strong> Data hosted on secure servers (Supabase/Vercel)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Data Retention</h2>
            <p className="text-gray-700 mb-4">
              We retain your data as follows:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Active Accounts:</strong> Data retained while your account is active</li>
              <li><strong>Deleted Accounts:</strong> Data permanently deleted within 30 days of account deletion</li>
              <li><strong>Backups:</strong> Backup data may persist for up to 90 days</li>
              <li><strong>Legal Requirements:</strong> Some data may be retained longer if required by law</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Sharing Your Information</h2>
            <p className="text-gray-700 mb-4">
              We DO NOT sell, trade, or rent your personal information. We may share data only in these circumstances:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Service Providers:</strong> With trusted third parties who help operate our service (Supabase, SendGrid, Vercel)</li>
              <li><strong>Legal Compliance:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
              <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your data</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Your Privacy Rights</h2>
            <p className="text-gray-700 mb-4">
              You have the following rights regarding your personal data:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate data</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Export:</strong> Download your projects and content</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing emails (if applicable)</li>
              <li><strong>Restriction:</strong> Request limitation of data processing</li>
            </ul>
            <p className="text-gray-700 mb-4">
              To exercise these rights, contact us at <strong>support@cmrassignment.com</strong>
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Cookies and Tracking</h2>
            <p className="text-gray-700 mb-4">
              We use cookies to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Authentication:</strong> Keep you logged in (essential cookies)</li>
              <li><strong>Preferences:</strong> Remember your settings (e.g., theme, language)</li>
              <li><strong>Analytics:</strong> Understand how you use our service (optional)</li>
            </ul>
            <p className="text-gray-700 mb-4">
              You can control cookies through your browser settings. Disabling essential cookies may affect functionality.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Third-Party Links</h2>
            <p className="text-gray-700 mb-4">
              Our service may contain links to third-party websites. We are not responsible for their privacy practices. Please review their privacy policies before providing any personal information.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Children's Privacy</h2>
            <p className="text-gray-700 mb-4">
              Our service is not intended for users under 13 years of age. We do not knowingly collect personal information from children. If we discover that a child has provided personal information, we will delete it immediately.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. International Data Transfers</h2>
            <p className="text-gray-700 mb-4">
              Your data may be transferred to and stored on servers located outside your country. By using our service, you consent to such transfers. We ensure appropriate safeguards are in place to protect your data.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">12. Changes to Privacy Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy periodically. We will notify you of significant changes by:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Posting the new policy on this page</li>
              <li>Updating the "Last Updated" date</li>
              <li>Sending an email notification (for major changes)</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Your continued use of the service after changes constitutes acceptance of the updated policy.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">13. Data Breach Notification</h2>
            <p className="text-gray-700 mb-4">
              In the unlikely event of a data breach, we will:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Investigate and contain the breach immediately</li>
              <li>Notify affected users within 72 hours</li>
              <li>Report to relevant authorities as required by law</li>
              <li>Take corrective actions to prevent future breaches</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">14. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              For questions, concerns, or requests regarding this Privacy Policy or your personal data, contact us at:
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Email:</strong> support@cmrassignment.com<br />
              <strong>Website:</strong> <Link href="/" className="text-blue-600 hover:underline">cmrassignment.com</Link>
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">15. Consent</h2>
            <p className="text-gray-700 mb-4">
              By using CMR Assignment, you consent to our Privacy Policy and agree to its terms.
            </p>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                This Privacy Policy is part of our <Link href="/legal/terms" className="text-blue-600 hover:underline">Terms and Conditions</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
