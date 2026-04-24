import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  if (!token || !user) {
    return <>{children}</>;
  }

  return user.role === "admin" ? (
    <Navigate to="/admin-manage-account" replace />
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

export default PublicRoute;
