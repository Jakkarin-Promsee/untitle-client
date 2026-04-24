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
          <Route path="/status" element={<Status />} />

          <Route
            path="/login/:portal"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route path="/login" element={<Navigate to="/login/user" replace />} />

          <Route path="/" element={<Index />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/booking" element={<Booking />} />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>

      {/*</TooltipProvider> */}
    </QueryClientProvider>
  );
};

export default App;
