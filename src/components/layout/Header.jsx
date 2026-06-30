import { useState, useRef, useEffect } from 'react';
import { ShinyButton } from '../ui/shiny-button';
import { Bell, Menu, User, Settings, LogOut, ChevronDown, Package, Laptop, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ActionSearchBar } from '../ui/action-search-bar';
import { ThemeToggle } from '../ui/theme-toggle';
import { useAuthStore } from '../../store/useAuthStore';
import { useNotifStore } from '../../store/useNotifStore';
import { useProfileStore } from '../../store/useProfileStore';
import { DateRangePicker } from '../ui/date-range-picker';
import Modal from '../ui/Modal';

// Helper component to map string icon names to Lucide components
const IconMapper = ({ name, ...props }) => {
  switch (name) {
    case 'AlertCircle': return <AlertCircle {...props} />;
    case 'Laptop': return <Laptop {...props} />;
    case 'Package': return <Package {...props} />;
    default: return <AlertCircle {...props} />;
  }
};

/**
 * Hook to handle clicks outside of a ref
 */
function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

export default function Header({ onMenuClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, logout } = useAuthStore();
  const { profile } = useProfileStore();
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotifStore();
  
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);


  useOnClickOutside(notifRef, () => setIsNotifOpen(false));
  useOnClickOutside(profileRef, () => setIsProfileOpen(false));

  const handleLogoutConfirm = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      setIsLoggingOut(false);
      setIsLogoutModalOpen(false);
      logout();
    }, 2500); // 2.5s loading time for realistic feel
  };

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 sticky top-0 z-30 dark:bg-slate-900 dark:border-slate-800">
      {/* Left — hamburger + conditional search */}
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition cursor-pointer dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800"
        >
          <Menu size={22} />
        </button>

        {(location.pathname === '/' || location.pathname === '/dashboard') && (
          <div className="relative flex-1 max-w-md hidden sm:block">
            <ActionSearchBar placeholder="Cari aksi atau menu..." />
          </div>
        )}
      </div>

      {/* Right — theme + date picker + notifications + profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
        
        <DateRangePicker />
        
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`relative p-2.5 rounded-xl transition cursor-pointer ${isNotifOpen ? 'bg-slate-100 text-blue-600' : 'hover:bg-slate-100 text-slate-500'} dark:'hover:bg-slate-800`}
          >
            <Bell size={20} />
            {unreadCount() > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full ring-2 ring-white dark:text-slate-900">
                {unreadCount()}
              </span>
            )}
          </button>

          {/* Notif Dropdown */}
          <AnimatePresence>
            {isNotifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 overflow-hidden z-50 origin-top-right dark:bg-slate-900 dark:border-slate-800"
              >
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 dark:border-slate-800">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">Notifikasi</h3>
                  {unreadCount() > 0 && (
                    <button onClick={markAllAsRead} className="text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer">Tandai semua dibaca</button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">Tidak ada notifikasi</div>
                  ) : (
                    notifications.map(notif => (
                      <button 
                        key={notif.id} 
                        onClick={() => {
                          if (!notif.read) markAsRead(notif.id);
                          setIsNotifOpen(false);
                          navigate('/notifications');
                        }}
                        className={`w-full text-left p-4 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition flex gap-3 cursor-pointer ${notif.read ? 'opacity-60' : ''} dark:hover:bg-slate-950`}
                      >
                        <div className={`w-9 h-9 rounded-full ${notif.bg} flex items-center justify-center flex-shrink-0`}>
                          <IconMapper name={notif.icon} size={16} className={notif.color} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800 leading-tight dark:text-slate-100">{notif.title}</p>
                          <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">{notif.desc}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{notif.time}</p>
                        </div>
                        {!notif.read && <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 flex-shrink-0" />}
                      </button>
                    ))
                  )}
                </div>
                <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                  <button 
                    onClick={() => {
                      setIsNotifOpen(false);
                      navigate('/notifications');
                    }}
                    className="w-full py-2 text-center text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                  >
                    Lihat Semua
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-7 w-px bg-slate-200 hidden sm:block dark:bg-slate-700" />

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`flex items-center gap-2.5 rounded-xl p-1.5 pr-3 transition cursor-pointer ${isProfileOpen ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
          >
            {profile?.avatar ? (
              <img src={profile.avatar} alt="Profile" className="w-9 h-9 rounded-lg object-cover shadow-sm flex-shrink-0" />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-semibold text-sm shadow-md flex-shrink-0 dark:text-slate-900">
                {profile?.name ? profile.name.substring(0, 2).toUpperCase() : (user?.name ? user.name.substring(0, 2).toUpperCase() : 'US')}
              </div>
            )}
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-slate-900 leading-tight dark:text-white">{profile?.name || user?.name || 'Loading...'}</p>
              <p className="text-[11px] text-slate-500 leading-tight dark:text-slate-400">{role}</p>
            </div>
            <ChevronDown size={16} className={`text-slate-400 hidden md:block transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Profile Dropdown */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 overflow-hidden z-50 origin-top-right dark:bg-slate-900 dark:border-slate-800"
              >
                <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{profile?.name || user?.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{profile?.email || user?.email}</p>
                </div>
                <div className="p-2 space-y-1">
                  <button onClick={() => { setIsProfileOpen(false); navigate('/settings', { state: { activeTab: 'profile' } }); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition cursor-pointer dark:text-slate-200 dark:hover:bg-slate-950">
                    <User size={16} /> Profil Saya
                  </button>
                  <button onClick={() => { setIsProfileOpen(false); navigate('/settings', { state: { activeTab: 'settings' } }); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition cursor-pointer dark:text-slate-200 dark:hover:bg-slate-950">
                    <Settings size={16} /> Pengaturan
                  </button>
                </div>
                <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                  <button onClick={() => { setIsProfileOpen(false); setIsLogoutModalOpen(true); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer">
                    <LogOut size={16} /> Keluar
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal isOpen={isLogoutModalOpen} onClose={() => !isLoggingOut && setIsLogoutModalOpen(false)} title="Konfirmasi Keluar">
        <div className="space-y-6">
          <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 flex gap-4 items-start">
            <div className="p-2 bg-rose-100 rounded-full text-rose-600 flex-shrink-0">
              <LogOut size={20} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-rose-900">Keluar dari Sistem</h4>
              <p className="text-sm text-rose-700 mt-1">
                Apakah Anda yakin ingin keluar? Sesi Anda akan diakhiri dan Anda perlu masuk kembali.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <ShinyButton
              onClick={() => setIsLogoutModalOpen(false)}
              disabled={isLoggingOut}
              className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition disabled:opacity-50 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200"
            >
              Batal
            </ShinyButton>
            <ShinyButton
              onClick={handleLogoutConfirm}
              disabled={isLoggingOut}
              className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-medium transition flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-rose-500/30 dark:text-slate-900"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Memproses...
                </>
              ) : (
                'Ya, Keluar'
              )}
            </ShinyButton>
          </div>
        </div>
      </Modal>
    </header>
  );
}
