import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, FileText } from 'lucide-react';

export function TermsPage() {
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
              <FileText className="size-8" />
              <div>
                <CardTitle>Terms & Conditions</CardTitle>
                <p className="text-sm text-indigo-100 mt-1">
                  Last updated: December 3, 2025
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <section>
              <h3 className="mb-3">1. Acceptance of Terms</h3>
              <p className="text-slate-600">
                By registering for and using the Skyline Residences WiFi service, you agree to
                comply with and be bound by these Terms and Conditions. If you do not agree to
                these terms, please do not use the service.
              </p>
            </section>

            <section>
              <h3 className="mb-3">2. Service Description</h3>
              <p className="text-slate-600 mb-2">
                Skyline Residences provides high-speed internet WiFi access to registered tenants.
                The service includes:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600 ml-4">
                <li>100 Mbps internet connectivity</li>
                <li>500 GB monthly data allowance</li>
                <li>24/7 network availability</li>
                <li>Support for up to 3 concurrent devices</li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3">3. Registration and Account</h3>
              <p className="text-slate-600 mb-2">
                To access the WiFi service, you must:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600 ml-4">
                <li>Provide accurate and complete registration information</li>
                <li>Be a current tenant of Skyline Residences</li>
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Notify the admin immediately of any unauthorized use</li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3">4. Payment Terms</h3>
              <p className="text-slate-600 mb-2">
                Payment for WiFi service is required monthly in advance:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600 ml-4">
                <li>Payment must be completed before service activation</li>
                <li>Accepted payment methods: bank transfer or cash payment</li>
                <li>Payment verification may take 2-4 business hours</li>
                <li>Service will be suspended upon expiry without renewal</li>
                <li>No refunds for partial months</li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3">5. Acceptable Use Policy</h3>
              <p className="text-slate-600 mb-2">
                You agree NOT to use the service for:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600 ml-4">
                <li>Illegal activities or content</li>
                <li>Distributing malware, viruses, or harmful software</li>
                <li>Unauthorized access to other networks or systems</li>
                <li>Excessive bandwidth consumption that affects other users</li>
                <li>Commercial purposes without prior approval</li>
                <li>Sharing account credentials with non-residents</li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3">6. Data Usage and Fair Use</h3>
              <p className="text-slate-600">
                The service includes a 500 GB monthly data allowance. Excessive usage beyond fair
                use limits may result in speed throttling or additional charges. Unused data does
                not roll over to the next month.
              </p>
            </section>

            <section>
              <h3 className="mb-3">7. Service Availability</h3>
              <p className="text-slate-600">
                While we strive for 24/7 availability, we do not guarantee uninterrupted service.
                Maintenance windows will be announced in advance when possible. We are not liable
                for service interruptions due to circumstances beyond our control.
              </p>
            </section>

            <section>
              <h3 className="mb-3">8. Privacy and Data Collection</h3>
              <p className="text-slate-600">
                We collect and store necessary information for service provision, including personal
                details and usage data. Please refer to our Privacy Policy for detailed information
                on data handling and protection.
              </p>
            </section>

            <section>
              <h3 className="mb-3">9. Suspension and Termination</h3>
              <p className="text-slate-600 mb-2">
                We reserve the right to suspend or terminate your access if:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600 ml-4">
                <li>Payment is not received by the due date</li>
                <li>You violate these Terms and Conditions</li>
                <li>You engage in prohibited activities</li>
                <li>Your tenancy at Skyline Residences ends</li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3">10. Limitation of Liability</h3>
              <p className="text-slate-600">
                Skyline Residences and its administrators shall not be liable for any indirect,
                incidental, or consequential damages arising from the use or inability to use the
                WiFi service, including but not limited to data loss or business interruption.
              </p>
            </section>

            <section>
              <h3 className="mb-3">11. Changes to Terms</h3>
              <p className="text-slate-600">
                We reserve the right to modify these Terms and Conditions at any time. Changes will
                be effective immediately upon posting. Continued use of the service after changes
                constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h3 className="mb-3">12. Contact Information</h3>
              <p className="text-slate-600">
                For questions about these Terms and Conditions, please contact:<br />
                Admin Office: Ground Floor, Room 101<br />
                Email: admin@skyline.com<br />
                Phone: +1234567890
              </p>
            </section>

            <div className="pt-6 border-t">
              <p className="text-sm text-slate-500 text-center">
                By using our service, you acknowledge that you have read, understood, and agree to
                be bound by these Terms and Conditions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
