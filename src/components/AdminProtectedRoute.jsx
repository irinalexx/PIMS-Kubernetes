import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/admin-login" />;
  }

  return children;
};

export default AdminProtectedRoute; 