import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";

const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) => {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  if (!token || !user) {
    return <Navigate to="/login/user" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === "admin" ? "/admin-manage-account" : "/dashboard"} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
