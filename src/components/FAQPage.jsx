import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { ArrowLeft, HelpCircle } from 'lucide-react';

export function FAQPage() {
  const navigate = useNavigate();

  const faqs = [
    {
      question: 'How do I register for WiFi access?',
      answer:
        'Click on the "New Tenant? Register" button on the home page and fill out the registration form with your details including full name, room number, ID, phone number, and password. After registration, login and complete the payment verification process.',
    },
    {
      question: 'What payment methods are accepted?',
      answer:
        'We accept two payment methods: (1) Upload proof of payment - you can upload a screenshot or photo of your bank transfer/payment receipt, or (2) Cash payment - pay directly to the admin office and register your cash payment in the system.',
    },
    {
      question: 'How long does payment approval take?',
      answer:
        'Payment approvals are typically processed within 2-4 hours during business hours (9 AM - 6 PM). For payments submitted outside business hours, they will be processed on the next business day.',
    },
    {
      question: 'What happens when my subscription expires?',
      answer:
        'You will receive notifications 7 days before expiry. Once expired, your WiFi access will be suspended until you renew your payment. You can renew directly from your dashboard by uploading a new payment proof.',
    },
    {
      question: 'How do I renew my WiFi subscription?',
      answer:
        'Login to your dashboard and click on "Upload Renewal Payment" in the Renew Subscription section. Upload your payment proof and it will be verified by the admin.',
    },
    {
      question: 'What is the WiFi speed and data limit?',
      answer:
        'All tenants get access to our high-speed 100 Mbps network with a fair usage policy of 500 GB per month. Additional data packages can be purchased if needed.',
    },
    {
      question: 'I forgot my password, what should I do?',
      answer:
        'Contact the admin office at Room 101 (Ground Floor) with your ID and room number. The admin can reset your password after verification.',
    },
    {
      question: 'Can I connect multiple devices?',
      answer:
        'Yes, you can connect up to 3 devices simultaneously per account. This includes smartphones, laptops, tablets, and smart TVs.',
    },
    {
      question: 'What if my payment is rejected?',
      answer:
        'If your payment is rejected, you will be notified with the reason. Common reasons include unclear payment proof or payment amount mismatch. Please upload a clearer proof or contact the admin office for assistance.',
    },
    {
      question: 'How do I check my data usage?',
      answer:
        'Your current data usage is displayed on your tenant dashboard under the "Network Usage" section. This is updated daily.',
    },
    {
      question: 'Who do I contact for technical support?',
      answer:
        'For technical issues, contact our support team at support@skyline.com or call the admin office at +1234567890 during business hours.',
    },
    {
      question: 'Is the network secure?',
      answer:
        'Yes, our network uses WPA3 encryption and requires authentication. Each tenant has a unique account, ensuring secure and private access.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
          <ArrowLeft className="size-4 mr-2" />
          Back to Home
        </Button>

        <Card className="shadow-lg mb-6">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <HelpCircle className="size-8" />
              <div>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <p className="text-sm text-indigo-100 mt-1">
                  Find answers to common questions about our WiFi service
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="mb-2">Still have questions?</h3>
              <p className="text-slate-600 mb-4">
                Contact our admin office or check out our other help pages
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => navigate('/contact')}
                >
                  Contact Us
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/terms')}
                >
                  Terms & Conditions
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
