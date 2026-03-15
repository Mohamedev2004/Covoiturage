import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ToastProvider } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { GuestRoute } from "@/components/GuestRoute";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { RidesPage } from "@/pages/RidesPage";
import { RideDetailsPage } from "@/pages/RideDetailsPage";
import { CreateRidePage } from "@/pages/CreateRidePage";
import { DashboardPage } from "@/pages/DashboardPage";
import { ProfilePage } from "@/pages/ProfilePage";

function GuestLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}

function ProtectedLayout() {
  const { user, loading } = useAuth();
  const [breadcrumb, setBreadcrumb] = useState<React.ReactNode>(null);

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );

  if (!user) return <Navigate to="/login" replace />;

  return (
    <ThemeProvider defaultTheme="light" storageKey="covoiturage-theme">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "220px",
          } as React.CSSProperties
        }
      >
        <div className="flex min-h-screen w-full bg-sidebar">
          <AppSidebar user={user} />

          <div className="flex flex-col flex-1 min-w-0 p-2">
            <Navbar breadcrumb={breadcrumb} />

            <main className="flex-1 w-full px-6 py-6 overflow-x-hidden bg-gray-200 dark:bg-[#171717] rounded-bl-xl rounded-br-xl shadow-sm">
              <Outlet context={{ setBreadcrumb }} />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export function useDashboardContext() {
  return useOutletContext<{ setBreadcrumb: (b: React.ReactNode) => void }>();
}

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Guest Routes */}
      <Route element={<GuestRoute />}>
        <Route element={<GuestLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/rides" element={<RidesPage />} />
          <Route path="/rides/:id" element={<RideDetailsPage />} />
          <Route path="/create-ride" element={<CreateRidePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
      />
    </Routes>
  );
}

export function App() {
  return (
    <TooltipProvider>
      <ToastProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ToastProvider>
    </TooltipProvider>
  );
}