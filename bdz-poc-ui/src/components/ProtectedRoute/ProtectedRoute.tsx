import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { selectIsLoggedIn, selectUserRole } from '../../store/features/auth/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const userRole = useAppSelector(selectUserRole);
  const location = useLocation();

  if (!isLoggedIn) {
    // Redirect to login page but save the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If allowedRoles is specified and user has a role, check if it's allowed
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    // Redirect to home if user's role is not allowed
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 