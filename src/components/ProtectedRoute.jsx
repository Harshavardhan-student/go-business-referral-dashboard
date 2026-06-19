import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

// Wrap any route element with this to require auth.
// No token in cookies -> bounce to /login.
// Token present -> render the protected page as-is.
function ProtectedRoute({ children }) {
  const token = Cookies.get("jwt_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;