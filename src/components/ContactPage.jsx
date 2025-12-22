import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { toast } from 'sonner';

export function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://kgwahla-wi-fi-bankemd.vercel.app/api'}/contact/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-5xl mx-auto pt-8">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
          <ArrowLeft className="size-4 mr-2" />
          Back to Home
        </Button>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Contact Form */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-t-lg">
              <CardTitle>Get in Touch</CardTitle>
              <CardDescription className="text-indigo-100">
                Have a question? Send us a message
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="What is this about?"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Your message..."
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  disabled={isSubmitting}
                >
                  <Send className="size-4 mr-2" />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Reach out to us through any of these channels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <MapPin className="size-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="mb-1">Admin Office</h4>
                    <p className="text-sm text-slate-600">
                      Ground Floor, Room 101<br />
                      Skyline Residences<br />
                      123 Main Street, City
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <Phone className="size-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="mb-1">Phone</h4>
                    <p className="text-sm text-slate-600">
                      +1 (234) 567-890<br />
                      Available 24/7 for emergencies
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <Mail className="size-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="mb-1">Email</h4>
                    <p className="text-sm text-slate-600">
                      General: admin@skyline.com<br />
                      Support: support@skyline.com<br />
                      Privacy: privacy@skyline.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <Clock className="size-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="mb-1">Office Hours</h4>
                    <p className="text-sm text-slate-600">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-gradient-to-br from-indigo-500 to-blue-500 text-white">
              <CardContent className="pt-6">
                <h3 className="mb-3">Quick Help</h3>
                <p className="text-sm text-indigo-100 mb-4">
                  Before contacting us, check if your question is answered in our FAQ section.
                </p>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => navigate('/faq')}
                >
                  View FAQs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
