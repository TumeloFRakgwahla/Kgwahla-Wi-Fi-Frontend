// RegistrationPage.jsx - Registration form component for new user signup
// This component handles user registration with comprehensive form validation

// Import React hooks for state management
import { useState } from 'react';

// Import React Router hook for navigation
import { useNavigate } from 'react-router';

// Import UI components from shadcn/ui
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';

// Import icons from Lucide React
import { ArrowLeft, UserPlus } from 'lucide-react';

// Import authentication utilities
import { registerUser } from '../utils/auth';

// Import toast for notifications
import { toast } from 'sonner';

export function RegistrationPage() {
  // Navigation hook for redirecting users after registration
  const navigate = useNavigate();

  // State for all form inputs - stores the registration data
  const [formData, setFormData] = useState({
    name: '',
    roomNumber: '',
    idNumber: '',
    phone: '',
    email: '',
    macAddress: '',
    password: '',
    confirmPassword: '',
    expiryDate: '',
  });

  // State for form validation errors - stores error messages for each field
  const [errors, setErrors] = useState({});

  // State for form submission status - shows loading state during submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Full name must be at least 2 characters';
    }

    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = 'Room number is required';
    }

    if (!formData.idNumber.trim()) {
      newErrors.idNumber = 'South African ID number is required';
    } else if (!/^\d{13}$/.test(formData.idNumber.trim())) {
      newErrors.idNumber = 'Please enter a valid 13-digit South African ID number';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Cell phone number is required';
    } else if (!/^(\+27|0)[6-8][0-9]{8}$/.test(formData.phone.replace(/\s|-/g, ''))) {
      newErrors.phone = 'Please enter a valid South African cell phone number ( +27712345678 )';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.macAddress.trim()) {
      newErrors.macAddress = 'Device MAC address is required';
    } else if (!/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(formData.macAddress.trim())) {
      newErrors.macAddress = 'Please enter a valid MAC address (e.g., 00:1B:44:11:3A:B7)';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      // Set default expiry date (1 month from now)
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 1);

      await registerUser({
        name: formData.name,
        roomNumber: formData.roomNumber,
        idNumber: formData.idNumber,
        phone: formData.phone,
        email: formData.email,
        macAddress: formData.macAddress,
        password: formData.password,
        expiryDate: expiryDate.toISOString(),
      });

      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Home
        </Button>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-2">
              <div className="bg-indigo-600 p-2 rounded-full">
                <UserPlus className="size-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-center">Tenant Registration</CardTitle>
            <CardDescription className="text-center">
              Create your account to access WiFi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomNumber">Room Number *</Label>
                <Input
                  id="roomNumber"
                  name="roomNumber"
                  placeholder="A"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  className={errors.roomNumber ? 'border-red-500' : ''}
                />
                {errors.roomNumber && (
                  <p className="text-sm text-red-500">{errors.roomNumber}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="idNumber">South African ID Number *</Label>
                <Input
                  id="idNumber"
                  name="idNumber"
                  placeholder="1234567890123"
                  value={formData.idNumber}
                  onChange={handleChange}
                  className={errors.idNumber ? 'border-red-500' : ''}
                  maxLength={13}
                />
                {errors.idNumber && (
                  <p className="text-sm text-red-500">{errors.idNumber}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">South African Cell Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+27712345678"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="macAddress">Device MAC Address *</Label>
                <Input
                  id="macAddress"
                  name="macAddress"
                  placeholder="00:1B:44:11:3A:B7"
                  value={formData.macAddress}
                  onChange={handleChange}
                  className={errors.macAddress ? 'border-red-500' : ''}
                />
                {errors.macAddress && (
                  <p className="text-sm text-red-500">{errors.macAddress}</p>
                )}
                <div className="text-xs text-gray-600 mt-1">
                  <strong>How to find your MAC address:</strong><br />
                  • Android: Settings → About Phone → Status<br />
                  • iPhone: Settings → General → About<br />
                  • Laptop: Network settings or Command Prompt (ipconfig /all)
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              <Alert>
                <AlertDescription className="text-sm">
                  Required fields. Your information is used only for WiFi access management.
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </Button>

              <div className="text-center text-sm">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-indigo-600 hover:underline"
                >
                  Login here
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
