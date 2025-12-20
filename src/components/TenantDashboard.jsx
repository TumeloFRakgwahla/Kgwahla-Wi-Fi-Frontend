import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import {
  Wifi,
  Calendar,
  CheckCircle,
  Upload,
  LogOut,
  User,
  Home,
  CreditCard,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { getCurrentUser, logout, uploadPayment, getPaymentStatus, isAuthenticated } from '../utils/auth';
import { toast } from 'sonner';
import { API_BASE_URL } from '../constants';

export function TenantDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showUploadSection, setShowUploadSection] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock network usage data
  const [networkUsage] = useState({
    used: 145.5,
    total: 500,
    percentage: 29,
  });

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
    const loadUser = async () => {
      const userData = await getCurrentUser();
      setUser(userData);
    };
    loadUser();
  }, []);

  useEffect(() => {
    // Only start polling if we have a user and backend is likely available
    if (user) {
      // Initial check after a short delay to avoid immediate API calls
      const initialCheck = setTimeout(refreshUserData, 2000);

      // Poll for updates every 30 seconds (much less frequent)
      const interval = setInterval(refreshUserData, 30000);

      return () => {
        clearTimeout(initialCheck);
        clearInterval(interval);
      };
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (user && !user.wifiAccess) {
      navigate('/payment-verification');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully');
    navigate('/login');
  };

  const getDaysUntilExpiry = () => {
    if (!user?.expiryDate) return null;
    const expiry = new Date(user.expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image (JPG, PNG) or PDF file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUploadRenewal = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('proofOfPayment', selectedFile);
      formData.append('type', 'POP'); // Proof of Payment for renewal

      await uploadPayment(formData);

      setShowUploadSection(false);
      setSelectedFile(null);
      toast.success('Renewal payment uploaded successfully! Awaiting admin approval.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const daysUntilExpiry = getDaysUntilExpiry();
  const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 7;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto pt-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-indigo-900">WiFi Dashboard</h1>
            <p className="text-gray-600">Manage your internet access</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="w-full sm:w-auto">
            <LogOut className="size-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Expiry Warning */}
        {isExpiringSoon && daysUntilExpiry !== null && (
          <Alert className="mb-6 border-orange-300 bg-orange-50">
            <AlertCircle className="size-4" />
            <AlertTitle>Payment Expiring Soon</AlertTitle>
            <AlertDescription>
              Your WiFi access will expire in {daysUntilExpiry} {daysUntilExpiry === 1 ? 'day' : 'days'}. 
              Please renew your payment to continue using the service.
            </AlertDescription>
          </Alert>
        )}

        {/* User Info Card */}
        <Card className="mb-6 shadow-lg border-2 border-indigo-200">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="size-5" />
                  {user.name}
                </CardTitle>
                <CardDescription className="text-indigo-50 flex items-center gap-2 mt-1">
                  <Home className="size-4" />
                  Room {user.roomNumber}
                </CardDescription>
              </div>
              <Badge className="bg-green-500 text-white">
                <CheckCircle className="size-3 mr-1" />
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p>{user.phone}</p>
              </div>
              {user.email && (
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p>{user.email}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">ID Number</p>
                <p>{user.idNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Account Status</p>
                <Badge className="bg-green-500">Verified</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grid Layout */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Payment Status */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="size-5 text-indigo-600" />
                Payment Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Current Status</span>
                <Badge className="bg-green-500">
                  <CheckCircle className="size-3 mr-1" />
                  Paid
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Expiry Date</span>
                <span>{formatDate(user.expiryDate)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Days Remaining</span>
                <span className={isExpiringSoon ? 'text-orange-600' : 'text-green-600'}>
                  {daysUntilExpiry !== null ? `${daysUntilExpiry} days` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">WiFi Status</span>
                <span className={user.wifiAccess ? 'text-green-600' : 'text-red-600'}>
                  {user.wifiAccess ? 'Active' : 'Inactive'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* WiFi Status */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="size-5 text-indigo-600" />
                WiFi Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Connection Status</span>
                <Badge className="bg-green-500">
                  <Wifi className="size-3 mr-1" />
                  Connected
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Network</span>
                <span>Skyline_Residences_5G</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Speed</span>
                <span>100 Mbps</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Auto-renewal</span>
                <Badge variant="outline">Manual</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Network Usage */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5 text-indigo-600" />
              Network Usage
            </CardTitle>
            <CardDescription>Current month data consumption</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Data Used</span>
              <span>
                {networkUsage.used} GB / {networkUsage.total} GB
              </span>
            </div>
            <Progress value={networkUsage.percentage} className="h-3" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{networkUsage.percentage}% used</span>
              <span>{networkUsage.total - networkUsage.used} GB remaining</span>
            </div>
          </CardContent>
        </Card>

        {/* Upload Additional Payment */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="size-5 text-indigo-600" />
              Renew Subscription
            </CardTitle>
            <CardDescription>
              Upload payment proof to extend your WiFi access
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showUploadSection ? (
              <Button
                onClick={() => setShowUploadSection(true)}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Upload className="size-4 mr-2" />
                Upload Renewal Payment
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                  <input
                    type="file"
                    id="renewal-upload"
                    className="hidden"
                    accept="image/jpeg,image/png,image/jpg,application/pdf"
                    onChange={handleFileChange}
                    disabled={isSubmitting}
                  />
                  <label htmlFor="renewal-upload" className="cursor-pointer">
                    <Upload className="size-10 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      {selectedFile ? selectedFile.name : 'Click to upload payment proof'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG or PDF (max 5MB)
                    </p>
                  </label>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleUploadRenewal}
                    disabled={!selectedFile || isSubmitting}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  >
                    {isSubmitting ? 'Uploading...' : 'Submit Renewal'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowUploadSection(false);
                      setSelectedFile(null);
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
