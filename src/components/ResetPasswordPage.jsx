// ResetPasswordPage.jsx - Password Reset Form Component
// This component allows users to set a new password using a reset token

// Import React hooks for managing component state
import { useState, useEffect } from 'react'; // useState for data, useEffect for side effects

// Import React Router for page navigation and URL parameters
import { useNavigate, useParams } from 'react-router'; // useNavigate for navigation, useParams for URL params

// Import pre-built UI components (like buttons, inputs, cards)
import { Button } from './ui/button'; // Button component for clickable actions
import { Input } from './ui/input'; // Input field for text entry
import { Label } from './ui/label'; // Label for describing form fields
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'; // Card layout components

// Import icons from Lucide React (free icon library)
import { ArrowLeft, Lock } from 'lucide-react'; // Icons for back button and lock

// Import toast notifications for user feedback
import { toast } from 'sonner'; // Shows success/error messages to users

// Import our custom authentication functions
import { resetPassword } from '../utils/auth'; // Function to handle reset password API call

export function ResetPasswordPage() {
  // Hook for navigating to different pages
  const navigate = useNavigate();

  // Get the reset token from the URL
  const { token } = useParams();

  // Form input state - stores what the user types
  const [newPassword, setNewPassword] = useState(''); // New password
  const [confirmPassword, setConfirmPassword] = useState(''); // Password confirmation

  // Loading state - shows spinner when submitting form
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Error state - stores validation or API error messages
  const [errors, setErrors] = useState({});

  // Success state - shows success message after password is reset
  const [passwordReset, setPasswordReset] = useState(false);

  // Token validation state
  const [tokenValid, setTokenValid] = useState(null); // null = checking, true = valid, false = invalid

  // Check if token is valid when component mounts
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      return;
    }
    // For now, we'll assume the token is valid and let the backend validate it
    // In a more robust implementation, you might want to validate the token on page load
    setTokenValid(true);
  }, [token]);

  // FORM VALIDATION FUNCTION
  // Checks if the user filled out the form correctly before sending to server
  const validateForm = () => {
    const newErrors = {}; // Object to store any validation errors

    // Check if user entered a new password
    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters long';
    }

    // Check if passwords match
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Save errors to state and return true if form is valid (no errors)
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // FORM SUBMISSION HANDLER
  // This function runs when user clicks the Reset Password button
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop the browser from refreshing the page

    // First check if form is valid
    if (!validateForm()) {
      return; // Stop here if there are validation errors
    }

    // Show loading spinner and disable form
    setIsSubmitting(true);

    try {
      // Call our reset password API function
      await resetPassword(token, newPassword);

      // Show success message and hide form
      setPasswordReset(true);
      toast.success('Password reset successfully!');

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (error) {
      // Request failed - show error message
      toast.error(error instanceof Error ? error.message : 'Failed to reset password');
      setErrors({ general: 'Failed to reset password. Please try again.' });
    } finally {
      // Always hide loading spinner when done (success or failure)
      setIsSubmitting(false);
    }
  };

  // Show loading while checking token
  if (tokenValid === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="text-center">
              <p>Validating reset link...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error if token is invalid
  if (tokenValid === false) {
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
              <CardTitle className="text-center text-red-600">Invalid Reset Link</CardTitle>
              <CardDescription className="text-center">
                This password reset link is invalid or has expired.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <Button onClick={() => navigate('/forgot-password')} className="w-full">
                  Request New Reset Link
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
                <Lock className="size-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-center">
              {passwordReset ? 'Password Reset!' : 'Set New Password'}
            </CardTitle>
            <CardDescription className="text-center">
              {passwordReset
                ? 'Your password has been successfully reset'
                : 'Enter your new password below'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {passwordReset ? (
              <div className="text-center space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <p className="text-sm text-green-800">
                    Your password has been reset successfully! You will be redirected to the login page shortly.
                  </p>
                </div>
                <Button onClick={() => navigate('/login')} className="w-full">
                  Go to Login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-sm text-red-600">{errors.general}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="••••••"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setErrors({});
                    }}
                    className={errors.newPassword ? 'border-red-500' : ''}
                  />
                  {errors.newPassword && (
                    <p className="text-sm text-red-500">{errors.newPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrors({});
                    }}
                    className={errors.confirmPassword ? 'border-red-500' : ''}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Resetting...' : 'Reset Password'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}