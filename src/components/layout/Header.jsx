import { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, Menu, User, Settings, LogOut, Package, Laptop, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useOnClickOutside(searchRef, () => setIsSearchOpen(false));
  useOnClickOutside(notifRef, () => setIsNotifOpen(false));
  useOnClickOutside(profileRef, () => setIsProfileOpen(false));

  const dummyNotifications = [
    { id: 1, title: 'Invoice IFORTE', desc: 'Jatuh tempo besok', time: '10 menit lalu', icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-100' },
    { id: 2, title: 'Sewa Baru', desc: 'PT. Teknologi Maju menyewa 2 Unit', time: '1 jam lalu', icon: Laptop, color: 'text-blue-500', bg: 'bg-blue-100' },
    { id: 3, title: 'Stok Menipis', desc: 'Stok Keyboard Macbook Air M1 sisa 5', time: '3 jam lalu', icon: Package, color: 'text-rose-500', bg: 'bg-rose-100' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Left — hamburger + search */}
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition cursor-pointer"
        >
          <Menu size={22} />
        </button>

        <div className="relative flex-1 max-w-md" ref={searchRef}>
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari penyewaan, pelanggan, perangkat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchOpen(true)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition placeholder:text-slate-400"
          />
          
          {/* Search Dropdown */}
          <AnimatePresence>
            {isSearchOpen && searchQuery.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50"
              >
                <div className="p-3">
                  <p className="text-xs font-semibold text-slate-500 mb-2 px-2 uppercase tracking-wider">Hasil Pencarian Cepat</p>
                  <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg transition text-left cursor-pointer">
                    <Laptop size={16} className="text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-800">Menyewakan {searchQuery}</p>
                      <p className="text-xs text-slate-500">Aksi Cepat</p>
                    </div>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg transition text-left cursor-pointer">
                    <Search size={16} className="text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-800">Cari "{searchQuery}" di Pelanggan</p>
                      <p className="text-xs text-slate-500">Mencari di semua data...</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right — notifications + profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`relative p-2.5 rounded-xl transition cursor-pointer ${isNotifOpen ? 'bg-slate-100 text-blue-600' : 'hover:bg-slate-100 text-slate-500'}`}
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* Notif Dropdown */}
          <AnimatePresence>
            {isNotifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 overflow-hidden z-50 origin-top-right"
              >
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-semibold text-slate-800">Notifikasi</h3>
                  <button className="text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer">Tandai dibaca</button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {dummyNotifications.map(notif => {
                    const Icon = notif.icon;
                    return (
                      <button key={notif.id} className="w-full text-left p-4 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition flex gap-3 cursor-pointer">
                        <div className={`w-9 h-9 rounded-full ${notif.bg} flex items-center justify-center flex-shrink-0`}>
                          <Icon size={16} className={notif.color} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800 leading-tight">{notif.title}</p>
                          <p className="text-xs text-slate-500 mt-1">{notif.desc}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{notif.time}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="p-2 border-t border-slate-100">
                  <button className="w-full py-2 text-center text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer">
                    Lihat Semua
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-7 w-px bg-slate-200 hidden sm:block" />

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`flex items-center gap-2.5 rounded-xl p-1.5 pr-3 transition cursor-pointer ${isProfileOpen ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-semibold text-sm shadow-md flex-shrink-0">
              JD
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-slate-900 leading-tight">John Doe</p>
              <p className="text-[11px] text-slate-500 leading-tight">Administrator</p>
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
                className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 overflow-hidden z-50 origin-top-right"
              >
                <div className="p-4 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-800">John Doe</p>
                  <p className="text-xs text-slate-500">john.doe@v-com.co.id</p>
                </div>
                <div className="p-2 space-y-1">
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition cursor-pointer">
                    <User size={16} /> Profil Saya
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition cursor-pointer">
                    <Settings size={16} /> Pengaturan
                  </button>
                </div>
                <div className="p-2 border-t border-slate-100">
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer">
                    <LogOut size={16} /> Keluar
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
