import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Wifi, Shield, Clock, CheckCircle } from 'lucide-react';
import { Footer } from './Footer';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-4xl mx-auto pt-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-indigo-600 p-3 rounded-full">
              <Wifi className="size-8 text-white" />
            </div>
          </div>
          <h1 className="mb-2 text-indigo-900">Welcome to Kgwahla Residences</h1>
          <p className="text-gray-600">Fast, Secure, and Reliable WiFi for All Tenants</p>
        </div>

        <Card className="mb-8 border-2 border-indigo-200 shadow-lg">
          <CardHeader className="text-center bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-t-lg">
            <CardTitle>Connect to Premium WiFi</CardTitle>
            <CardDescription className="text-indigo-50">
              Register or login to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                New Tenant? Register
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/login')}
                className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
              >
                Already Registered? Login
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <Wifi className="size-8 mx-auto mb-3 text-indigo-600" />
              <h3 className="mb-1">High Speed</h3>
              <p className="text-sm text-gray-600">1+ Mbps connectivity</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <Shield className="size-8 mx-auto mb-3 text-indigo-600" />
              <h3 className="mb-1">Secure</h3>
              <p className="text-sm text-gray-600">Protected network access</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <Clock className="size-8 mx-auto mb-3 text-indigo-600" />
              <h3 className="mb-1">24/7 Available</h3>
              <p className="text-sm text-gray-600">Always online support</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <CheckCircle className="size-8 mx-auto mb-3 text-indigo-600" />
              <h3 className="mb-1">Easy Setup</h3>
              <p className="text-sm text-gray-600">Quick registration process</p>
            </CardContent>
          </Card>
        </div>

        <Footer />
      </div>
    </div>
  );
}
