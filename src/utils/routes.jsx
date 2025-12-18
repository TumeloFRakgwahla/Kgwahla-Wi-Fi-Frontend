import { createBrowserRouter, Navigate } from "react-router";
import { LandingPage } from "../components/LandingPage";
import { RegistrationPage } from "../components/RegistrationPage";
import { LoginPage } from "../components/LoginPage";
import { PaymentVerificationPage } from "../components/PaymentVerificationPage";
import { TenantDashboard } from "../components/TenantDashboard";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { AdminLoginPage } from "../components/AdminLoginPage";
import { AdminDashboard } from "../components/AdminDashboard";
import { AdminProtectedRoute } from "../components/AdminProtectedRoute";
import { FAQPage } from "../components/FAQPage";
import { TermsPage } from "../components/TermsPage";
import { PrivacyPage } from "../components/PrivacyPage";
import { ContactPage } from "../components/ContactPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/register",
    element: <RegistrationPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/payment-verification",
    element: (
      <ProtectedRoute>
        <PaymentVerificationPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <TenantDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
  },
  {
    path: "/admin/dashboard",
    element: (
      <AdminProtectedRoute>
        <AdminDashboard />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/faq",
    element: <FAQPage />,
  },
  {
    path: "/terms",
    element: <TermsPage />,
  },
  {
    path: "/privacy",
    element: <PrivacyPage />,
  },
  {
    path: "/contact",
    element: <ContactPage />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
