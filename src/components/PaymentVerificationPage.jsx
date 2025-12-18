import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Upload, DollarSign, CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react';
import { getCurrentUser, logout, uploadPayment, getPaymentStatus, submitCashPayment, isAuthenticated } from '../utils/auth';

const API_BASE_URL = '/api';
import { toast } from 'sonner';

export function PaymentVerificationPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upload');

  const refreshUserData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else if (response.status === 401) {
        // Token expired or invalid, logout
        logout();
        navigate('/login');
      }
      // For other errors (like network issues), don't logout - just log the error
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      // Don't logout on network errors - user might still be valid
    }
  };

  useEffect(() => {
    // Load user data on component mount
    refreshUserData();
  }, []);

  useEffect(() => {
    // Only start polling if we have a user and backend is likely available
    if (user) {
      // Poll for updates every 10 seconds
      const interval = setInterval(refreshUserData, 10000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (user?.wifiAccess) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image (JPG, PNG) or PDF file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl('');
      }
    }
  };

  const handleUploadPayment = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('proofOfPayment', selectedFile);
      formData.append('type', 'POP'); // Proof of Payment

      await uploadPayment(formData);

      toast.success('Payment proof uploaded successfully! Awaiting admin approval.');
      setSelectedFile(null);
      setPreviewUrl('');

      // Refresh payment status
      const payments = await getPaymentStatus();
      const latestPayment = payments[payments.length - 1];
      if (latestPayment?.status === 'approved') {
        toast.success('Payment approved! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCashPayment = async () => {
    setIsSubmitting(true);

    try {
      await submitCashPayment();

      toast.success('Cash payment registered! Awaiting admin confirmation.');

      // Check payment status after a delay
      setTimeout(async () => {
        try {
          const payments = await getPaymentStatus();
          const latestPayment = payments[payments.length - 1];
          if (latestPayment?.status === 'approved') {
            toast.success('Payment confirmed! Redirecting to dashboard...');
            navigate('/dashboard');
          }
        } catch (error) {
          console.error('Failed to check payment status:', error);
        }
      }, 2000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to register cash payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully');
    navigate('/login');
  };

  const getStatusBadge = () => {
    if (user?.wifiAccess) {
      return <Badge className="bg-green-500"><CheckCircle className="size-3 mr-1" />Active</Badge>;
    } else {
      return <Badge className="bg-yellow-500"><Clock className="size-3 mr-1" />Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-3xl mx-auto pt-8">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => navigate('/login')}>
            <ArrowLeft className="size-4 mr-2" />
            Back
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <Card className="shadow-lg mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Welcome, {user?.name}</CardTitle>
                <CardDescription>Room: {user?.roomNumber}</CardDescription>
              </div>
              {getStatusBadge()}
            </div>
          </CardHeader>
        </Card>

        <Alert className="mb-6 border-blue-300 bg-blue-50">
          <Clock className="size-4" />
          <AlertTitle>Payment Required</AlertTitle>
          <AlertDescription>
            Please submit your payment proof or register a cash payment to activate your WiFi access.
          </AlertDescription>
        </Alert>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Payment Verification</CardTitle>
            <CardDescription>
              Choose your payment method to activate WiFi access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">
                  <Upload className="size-4 mr-2" />
                  Upload Proof
                </TabsTrigger>
                <TabsTrigger value="cash">
                  <DollarSign className="size-4 mr-2" />
                  Cash Payment
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-4">
                <Alert>
                  <AlertDescription>
                    Upload a screenshot or photo of your payment receipt. Accepted formats: JPG, PNG, PDF (max 5MB)
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept="image/jpeg,image/png,image/jpg,application/pdf"
                      onChange={handleFileChange}
                      disabled={isSubmitting}
                    />
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="size-12 mx-auto mb-3 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        {selectedFile ? selectedFile.name : 'Click to upload payment proof'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        JPG, PNG or PDF (max 5MB)
                      </p>
                    </Label>
                  </div>

                  {previewUrl && (
                    <div className="mt-4">
                      <p className="text-sm mb-2">Preview:</p>
                      <img
                        src={previewUrl}
                        alt="Payment proof preview"
                        className="max-w-full h-auto max-h-64 rounded-lg border"
                      />
                    </div>
                  )}

                  <Button
                    onClick={handleUploadPayment}
                    disabled={!selectedFile || isSubmitting}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                  >
                    {isSubmitting ? 'Uploading...' : 'Submit Payment Proof'}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="cash" className="space-y-4">
                <Alert>
                  <AlertDescription>
                    Select this option if you've paid in cash to the admin. Your payment will be verified manually.
                  </AlertDescription>
                </Alert>

                <div className="bg-gray-50 p-6 rounded-lg space-y-3">
                  <h4>Cash Payment Instructions:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                    <li>Visit the admin office (Ground Floor, Room 101)</li>
                    <li>Make your monthly WiFi payment</li>
                    <li>Get a receipt from the admin</li>
                    <li>Click the button below to register your payment</li>
                  </ol>
                </div>

                <Button
                  onClick={handleCashPayment}
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  {isSubmitting ? 'Registering...' : 'I Have Paid in Cash'}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
