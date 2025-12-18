import { Navigate } from 'react-router';
import { isAdminAuthenticated } from '../utils/admin-auth';

export function AdminProtectedRoute({ children }) {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
}
