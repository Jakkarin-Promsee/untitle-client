// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Status from "./pages/Status";
import Plans from "./pages/Plans";
import Payment from "./pages/Payment";
import Booking from "./pages/Booking";
import Dashboard from "./pages/Dashboard";
import AdminManageAccount from "@/pages/AdminManageAccount";

const queryClient = new QueryClient();

const App = () => {
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const isCheckingSession = useAuthStore((s) => s.isCheckingSession);
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const isGuest = !token || !user;

  if (!hasHydrated || isCheckingSession) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
          Checking session...
        </div>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      {/* <TooltipProvider>
      <Toaster />
      <Sonner /> */}

      <BrowserRouter>
        <Routes>
          <Route
            path="/status"
            element={isGuest ? <Navigate to="/plans" replace /> : <Status />}
          />

          <Route
            path="/login/:portal"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={<Navigate to="/login/user" replace />}
          />

          <Route path="/" element={<Index />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/plan" element={<Navigate to="/plans" replace />} />
          <Route
            path="/payment"
            element={
              isGuest ? (
                <Navigate to="/plans" replace />
              ) : (
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              )
            }
          />
          <Route
            path="/booking"
            element={
              isGuest ? (
                <Navigate to="/plans" replace />
              ) : (
                <ProtectedRoute>
                  <Booking />
                </ProtectedRoute>
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-manage-account"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminManageAccount />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-manage-acount"
            element={<Navigate to="/admin-manage-account" replace />}
          />
          <Route
            path="*"
            element={isGuest ? <Navigate to="/" replace /> : <NotFound />}
          />
        </Routes>
      </BrowserRouter>

      {/*</TooltipProvider> */}
    </QueryClientProvider>
  );
};

export default App;
