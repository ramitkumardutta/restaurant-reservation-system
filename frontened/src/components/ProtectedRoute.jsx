import { Navigate } from "react-router-dom";
import { getUser } from "../services/auth";

const ProtectedRoute = ({ children, roles }) => {
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;

