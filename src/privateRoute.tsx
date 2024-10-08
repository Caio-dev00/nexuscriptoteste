

import { Navigate, Outlet } from 'react-router-dom';
import { UseAuth } from './context/authContext';

const PrivateRoute = () => {
  const { isLoggedIn } = UseAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
