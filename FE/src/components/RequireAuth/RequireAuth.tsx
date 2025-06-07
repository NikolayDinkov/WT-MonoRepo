import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};
export default RequireAuth;
