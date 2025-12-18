import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Shield } from 'lucide-react';

export function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto pt-8 pb-8">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
          <ArrowLeft className="size-4 mr-2" />
          Back to Home
        </Button>

        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <Shield className="size-8" />
              <div>
                <CardTitle>Privacy Policy</CardTitle>
                <p className="text-sm text-indigo-100 mt-1">
                  Last updated: December 3, 2025
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <section>
              <h3 className="mb-3">1. Introduction</h3>
              <p className="text-slate-600">
                Skyline Residences ("we," "our," or "us") is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your
                information when you use our WiFi management service.
              </p>
            </section>

            <section>
              <h3 className="mb-3">2. Information We Collect</h3>
              <p className="text-slate-600 mb-2">
                We collect the following types of information:
              </p>
              <div className="ml-4 space-y-3">
                <div>
                  <h4 className="mb-1">Personal Information:</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 ml-4">
                    <li>Full name</li>
                    <li>Room number</li>
                    <li>ID number</li>
                    <li>Phone number</li>
                    <li>Email address (optional)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-1">Payment Information:</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 ml-4">
                    <li>Payment receipts and proof of payment</li>
                    <li>Payment method preferences</li>
                    <li>Transaction history</li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-1">Usage Data:</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 ml-4">
                    <li>Data consumption statistics</li>
                    <li>Connection logs</li>
                    <li>Device information</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="mb-3">3. How We Use Your Information</h3>
              <p className="text-slate-600 mb-2">
                We use your information for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600 ml-4">
                <li>Providing and managing WiFi access services</li>
                <li>Processing payments and verifying transactions</li>
                <li>Communicating about service updates and account status</li>
                <li>Monitoring network usage and ensuring fair use</li>
                <li>Providing customer support</li>
                <li>Improving our services and user experience</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3">4. Data Security</h3>
              <p className="text-slate-600">
                We implement appropriate technical and organizational security measures to protect
                your personal information against unauthorized access, alteration, disclosure, or
                destruction. This includes encryption, secure storage, and access controls. However,
                no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h3 className="mb-3">5. Data Sharing and Disclosure</h3>
              <p className="text-slate-600 mb-2">
                We do not sell your personal information. We may share your information only in the
                following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600 ml-4">
                <li>With your consent</li>
                <li>To comply with legal obligations or court orders</li>
                <li>To protect our rights, property, or safety</li>
                <li>With service providers who assist in operating our services (under strict
                  confidentiality agreements)</li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3">6. Data Retention</h3>
              <p className="text-slate-600">
                We retain your personal information for as long as necessary to provide our services
                and comply with legal obligations. When you terminate your tenancy, we will retain
                your data for a period required by law for accounting and legal purposes, after
                which it will be securely deleted.
              </p>
            </section>

            <section>
              <h3 className="mb-3">7. Your Rights</h3>
              <p className="text-slate-600 mb-2">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600 ml-4">
                <li>Access: Request access to your personal data</li>
                <li>Correction: Request correction of inaccurate information</li>
                <li>Deletion: Request deletion of your data (subject to legal requirements)</li>
                <li>Objection: Object to certain processing of your data</li>
                <li>Portability: Request transfer of your data in a portable format</li>
              </ul>
              <p className="text-slate-600 mt-2">
                To exercise these rights, contact our admin office.
              </p>
            </section>

            <section>
              <h3 className="mb-3">8. Cookies and Tracking</h3>
              <p className="text-slate-600">
                Our service uses browser local storage to maintain your login session and user
                preferences. We do not use cookies for tracking or advertising purposes. You can
                clear this data through your browser settings.
              </p>
            </section>

            <section>
              <h3 className="mb-3">9. Third-Party Links</h3>
              <p className="text-slate-600">
                Our service may contain links to third-party websites. We are not responsible for
                the privacy practices of these external sites. We encourage you to review their
                privacy policies.
              </p>
            </section>

            <section>
              <h3 className="mb-3">10. Children's Privacy</h3>
              <p className="text-slate-600">
                Our service is intended for adult tenants. We do not knowingly collect information
                from individuals under 18 years of age without parental consent.
              </p>
            </section>

            <section>
              <h3 className="mb-3">11. Changes to This Privacy Policy</h3>
              <p className="text-slate-600">
                We may update this Privacy Policy from time to time. We will notify you of any
                significant changes by posting the new policy with an updated date. Your continued
                use of the service after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h3 className="mb-3">12. Contact Us</h3>
              <p className="text-slate-600">
                If you have questions or concerns about this Privacy Policy or our data practices,
                please contact us at:<br />
                Admin Office: Ground Floor, Room 101<br />
                Email: privacy@skyline.com<br />
                Phone: +1234567890
              </p>
            </section>

            <div className="pt-6 border-t">
              <p className="text-sm text-slate-500 text-center">
                By using our service, you acknowledge that you have read and understood this Privacy
                Policy and consent to the collection and use of your information as described.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
