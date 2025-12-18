// LoginPage.jsx - User Login Form Component
// This component creates a login form where users can enter their credentials
// It handles form validation, API calls, and navigation after successful login

// Import React hooks for managing component state
import { useState } from 'react'; // useState helps us store and update data in the component

// Import React Router for page navigation
import { useNavigate } from 'react-router'; // useNavigate lets us change pages programmatically

// Import pre-built UI components (like buttons, inputs, cards)
import { Button } from './ui/button'; // Button component for clickable actions
import { Input } from './ui/input'; // Input field for text entry
import { Label } from './ui/label'; // Label for describing form fields
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'; // Card layout components

// Import icons from Lucide React (free icon library)
import { ArrowLeft, LogIn } from 'lucide-react'; // Icons for back button and login

// Import our custom authentication functions
import { loginUser, getCurrentUser } from '../utils/auth'; // Functions to handle login API calls

// Import toast notifications for user feedback
import { toast } from 'sonner'; // Shows success/error messages to users

export function LoginPage() {
  // Hook for navigating to different pages
  const navigate = useNavigate();

  // Form input state - stores what the user types
  const [identifier, setIdentifier] = useState(''); // Can be email or phone number
  const [password, setPassword] = useState(''); // User's password

  // Loading state - shows spinner when submitting form
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Error state - stores validation or API error messages
  const [errors, setErrors] = useState({});

  // FORM VALIDATION FUNCTION
  // Checks if the user filled out the form correctly before sending to server
  const validateForm = () => {
    const newErrors = {}; // Object to store any validation errors

    // Check if user entered something in the identifier field
    if (!identifier.trim()) {
      newErrors.identifier = 'Phone number or email is required';
    }

    // Check if user entered a password
    if (!password) {
      newErrors.password = 'Password is required';
    }

    // Save errors to state and return true if form is valid (no errors)
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // FORM SUBMISSION HANDLER
  // This function runs when user clicks the Login button
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop the browser from refreshing the page

    // First check if form is valid
    if (!validateForm()) {
      return; // Stop here if there are validation errors
    }

    // Show loading spinner and disable form
    setIsSubmitting(true);

    try {
      // Call our login API function with user's credentials
      const { user } = await loginUser(identifier, password);

      // Show success message to user
      toast.success('Login successful!');

      // Decide where to send the user based on their WiFi access status
      if (user?.wifiAccess) {
        // User has paid and WiFi is enabled - go to main dashboard
        navigate('/dashboard');
      } else {
        // User hasn't paid yet - go to payment verification page
        navigate('/payment-verification');
      }

    } catch (error) {
      // Login failed - show error message
      toast.error(error instanceof Error ? error.message : 'Login failed');
      setErrors({ general: 'Invalid credentials. Please try again.' });
    } finally {
      // Always hide loading spinner when done (success or failure)
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
                <LogIn className="size-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Login to access your WiFi dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="identifier">Phone Number or Email</Label>
                <Input
                  id="identifier"
                  name="identifier"
                  placeholder="Phone or email"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    setErrors({});
                  }}
                  className={errors.identifier ? 'border-red-500' : ''}
                />
                {errors.identifier && (
                  <p className="text-sm text-red-500">{errors.identifier}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({});
                  }}
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>

              <div className="text-center text-sm">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="text-indigo-600 hover:underline"
                >
                  Register here
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
