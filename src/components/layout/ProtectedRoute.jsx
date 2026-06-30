import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { AlertCircle } from 'lucide-react';

export default function ProtectedRoute({ allowedRoles = [] }) {
  const { isAuthenticated, role } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required, check them
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // User is logged in but doesn't have the right role
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 p-6 dark:bg-slate-800/40">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 max-w-md text-center dark:bg-slate-900 dark:border-slate-800">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2 dark:text-slate-100">Akses Ditolak</h2>
          <p className="text-slate-500 mb-6 dark:text-slate-400">
            Maaf, akun Anda dengan role <strong>{role}</strong> tidak memiliki izin untuk mengakses halaman ini.
          </p>
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors cursor-pointer dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
