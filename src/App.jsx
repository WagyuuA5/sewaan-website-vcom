import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useAuthStore } from './store/useAuthStore';
import { useSettingsStore } from './store/useSettingsStore';
import { useThemeStore } from './store/useThemeStore';
import { ToastProvider } from './components/ui/Toast';
import SplashScreen from './components/ui/SplashScreen';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Rentals from './pages/Rentals';
import Invoices from './pages/Invoices';
import Service from './pages/Service';
import ServiceHistory from './pages/ServiceHistory';
import Customers from './pages/Customers';
import Devices from './pages/Devices';
import Spareparts from './pages/Spareparts';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import OperationalNotes from './pages/OperationalNotes';
import Bookkeeping from './pages/Bookkeeping';
import Docs from './pages/Docs';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

export default function App() {
  const { initialize, isLoading } = useAuthStore();
  const { preferences } = useSettingsStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    // Check local storage for session on mount
    const initTimer = setTimeout(() => {
      initialize();
    }, 3500); // Give the splash screen 3.5 seconds to show

    return () => clearTimeout(initTimer);
  }, [initialize]);

  // Apply global preferences
  useEffect(() => {
    const html = document.documentElement;

    // Dark Mode from Theme Store
    if (theme === 'dark') {
      html.classList.add('dark');
      html.classList.remove('light');
    } else {
      html.classList.remove('dark');
      html.classList.add('light');
    }

    // Font Size to documentElement
    html.classList.remove('text-sm', 'text-base', 'text-lg');
    html.classList.add(preferences.fontSize || 'text-base');

    // Animations toggle to documentElement
    if (preferences.animationsEnabled) {
      html.classList.remove('disable-animations');
    } else {
      html.classList.add('disable-animations');
    }

    // RTL Support for Arabic
    if (preferences.language === 'ar') {
      html.setAttribute('dir', 'rtl');
    } else {
      html.setAttribute('dir', 'ltr');
    }
  }, [theme, preferences.fontSize, preferences.animationsEnabled, preferences.language]);

  return (
    <ToastProvider>
      {isLoading ? (
        <SplashScreen />
      ) : (
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Manager', 'Teknisi']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/rentals" element={<Rentals />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/service" element={<Service />} />
              <Route path="/service-history" element={<ServiceHistory />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/devices" element={<Devices />} />
              <Route path="/spareparts" element={<Spareparts />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<Settings />} />
              
              {/* Static Help & Policy Pages */}
              <Route path="/help/docs" element={<Docs />} />
              <Route path="/help/faq" element={<FAQ />} />
              <Route path="/legal/terms" element={<Terms />} />
              <Route path="/legal/privacy" element={<Privacy />} />
              
              {/* Only Admin can access User Management & Settings */}
              <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                <Route path="/users" element={<Users />} />
              </Route>

              {/* Admin & Manager can access Bookkeeping */}
              <Route element={<ProtectedRoute allowedRoles={['Admin', 'Manager']} />}>
                <Route path="/bookkeeping" element={<Bookkeeping />} />
                <Route path="/operational-notes" element={<OperationalNotes />} />
              </Route>
            </Route>
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </ToastProvider>
  );
}
