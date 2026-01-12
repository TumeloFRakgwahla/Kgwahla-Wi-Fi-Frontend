// ForgotPasswordPage.jsx - Password Reset Request Form Component
// This component allows users to request a password reset email

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
import { ArrowLeft, Mail } from 'lucide-react'; // Icons for back button and email

// Import toast notifications for user feedback
import { toast } from 'sonner'; // Shows success/error messages to users

// Import our custom authentication functions
import { forgotPassword } from '../utils/auth'; // Function to handle forgot password API call

export function ForgotPasswordPage() {
  // Hook for navigating to different pages
  const navigate = useNavigate();

  // Form input state - stores what the user types
  const [email, setEmail] = useState(''); // User's email address

  // Loading state - shows spinner when submitting form
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Error state - stores validation or API error messages
  const [errors, setErrors] = useState({});

  // Success state - shows success message after email is sent
  const [emailSent, setEmailSent] = useState(false);

  // FORM VALIDATION FUNCTION
  // Checks if the user filled out the form correctly before sending to server
  const validateForm = () => {
    const newErrors = {}; // Object to store any validation errors

    // Check if user entered an email
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Save errors to state and return true if form is valid (no errors)
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // FORM SUBMISSION HANDLER
  // This function runs when user clicks the Send Reset Email button
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop the browser from refreshing the page

    // First check if form is valid
    if (!validateForm()) {
      return; // Stop here if there are validation errors
    }

    // Show loading spinner and disable form
    setIsSubmitting(true);

    try {
      // Call our forgot password API function
      await forgotPassword(email);

      // Show success message and hide form
      setEmailSent(true);
      toast.success('Password reset email sent!');

    } catch (error) {
      // Request failed - show error message
      toast.error(error instanceof Error ? error.message : 'Failed to send reset email');
      setErrors({ general: 'Failed to send reset email. Please try again.' });
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
          onClick={() => navigate('/login')}
          className="mb-4"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Login
        </Button>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-2">
              <div className="bg-indigo-600 p-2 rounded-full">
                <Mail className="size-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-center">
              {emailSent ? 'Check Your Email' : 'Reset Password'}
            </CardTitle>
            <CardDescription className="text-center">
              {emailSent
                ? 'We\'ve sent you a password reset link'
                : 'Enter your email address and we\'ll send you a reset link'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {emailSent ? (
              <div className="text-center space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <p className="text-sm text-green-800">
                    If an account with that email exists, we've sent you a password reset link.
                    Please check your email and follow the instructions.
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  Didn't receive the email? Check your spam folder or{' '}
                  <button
                    type="button"
                    onClick={() => setEmailSent(false)}
                    className="text-indigo-600 hover:underline"
                  >
                    try again
                  </button>
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-sm text-red-600">{errors.general}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors({});
                    }}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Reset Email'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}