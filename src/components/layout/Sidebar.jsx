import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Wrench, History, Users, Smartphone, Package,
  UserCog, FileText, BookOpen, X, ChevronRight, Laptop, Calendar,
  FileText as FileIcon, MonitorSmartphone
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  {
    icon: Laptop,
    label: 'Penyewaan',
    path: '/rentals',
    subItems: [
      { icon: Package, label: 'Inventaris', path: '/inventory' },
      { icon: Calendar, label: 'Daftar Sewa', path: '/rentals' },
      { icon: FileIcon, label: 'Invoice', path: '/invoices' }
    ]
  },
  {
    icon: Wrench,
    label: 'Service',
    path: '/service',
    subItems: [
      { icon: Wrench, label: 'Service Berjalan', path: '/service' },
      { icon: History, label: 'Riwayat Service', path: '/service-history' },
      { icon: Smartphone, label: 'Perangkat', path: '/devices' },
      { icon: Package, label: 'Sparepart', path: '/spareparts' }
    ]
  },
  { icon: Users, label: 'Pelanggan', path: '/customers' },
  { icon: BookOpen, label: 'Pembukuan Harian', path: '/bookkeeping' },
  { icon: FileText, label: 'Catatan Operasional', path: '/operational-notes' },
  { icon: UserCog, label: 'Kelola Pengguna', path: '/users' },
];

/**
 * Sidebar navigation — always visible on lg+, slide-over on mobile.
 * @param {{ isOpen: boolean, onClose: () => void }} props
 */
export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedMenus, setExpandedMenus] = useState({ 'Penyewaan': true, 'Service': true });

  const handleNav = (path) => {
    navigate(path);
    onClose();
  };

  const toggleSubMenu = (label, e) => {
    e.stopPropagation();
    setExpandedMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  /* Shared sidebar content (used by both desktop and mobile) */
  const renderNav = () => (
    <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-2 pb-4">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path || (item.subItems && item.subItems.some(sub => location.pathname === sub.path));
        return (
          <div key={item.label} className="w-full">
            <button
              id={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={(e) => {
                if (item.subItems && !expandedMenus[item.label]) {
                  setExpandedMenus(prev => ({ ...prev, [item.label]: true }));
                }
                handleNav(item.path);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                isActive && !item.subItems
                  ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg nav-active-glow'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={20} className={isActive && !item.subItems ? 'text-white' : ''} />
              <span className={isActive && !item.subItems ? 'text-white' : ''}>{item.label}</span>
              {item.subItems ? (
                <button onClick={(e) => toggleSubMenu(item.label, e)} className="ml-auto p-1 hover:bg-white/20 rounded-md transition cursor-pointer">
                  <ChevronRight size={16} className={`opacity-70 transition-transform ${expandedMenus[item.label] ? 'rotate-90' : ''}`} />
                </button>
              ) : isActive ? (
                <ChevronRight size={16} className="ml-auto opacity-70" />
              ) : null}
            </button>

            {/* Sub Menu */}
            {item.subItems && (
              <AnimatePresence>
                {expandedMenus[item.label] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pl-11 pr-4 py-2 space-y-1">
                      {item.subItems.map(sub => {
                        const isSubActive = location.pathname === sub.path;
                        return (
                          <button
                            key={sub.label}
                            onClick={() => handleNav(sub.path)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                              isSubActive
                                ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-sm'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            <sub.icon size={18} />
                            {sub.label}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        );
      })}
    </nav>
  );

  /* Branding block */
  const brand = (
    <div className="p-6 flex items-center gap-3">
      <div className="h-12 flex items-center justify-center flex-shrink-0 bg-white rounded-xl p-1 shadow-lg">
        <img src="/v-com.png" alt="V-COM Logo" className="h-full object-contain" />
      </div>
      <div className="min-w-0">
        <h1 className="font-bold text-lg tracking-tight text-white truncate">V-COM</h1>
        <p className="text-[11px] text-slate-400 leading-tight">Admin Dashboard</p>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop sidebar (always visible at lg+) ── */}
      <aside className="hidden lg:flex w-[272px] bg-[#0f172a] text-white flex-col flex-shrink-0 border-r border-white/5">
        {brand}
        {renderNav()}
      </aside>

      {/* ── Mobile sidebar (overlay) ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-80 bg-[#0f172a] text-white flex flex-col shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between pr-4">
                {brand}
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white transition p-2 rounded-lg hover:bg-white/5 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {renderNav()}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
