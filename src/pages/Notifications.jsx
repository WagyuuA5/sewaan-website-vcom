import { motion } from 'framer-motion';
import { useNotifStore } from '../store/useNotifStore';
import { AlertCircle, Laptop, Package, CheckCircle2 } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';

// Helper component to map string icon names to Lucide components
const IconMapper = ({ name, ...props }) => {
  switch (name) {
    case 'AlertCircle': return <AlertCircle {...props} />;
    case 'Laptop': return <Laptop {...props} />;
    case 'Package': return <Package {...props} />;
    default: return <AlertCircle {...props} />;
  }
};

export default function Notifications() {
  const { notifications, markAllAsRead, markAsRead } = useNotifStore();

  return (
    <PageWrapper 
      title="Semua Notifikasi" 
      subtitle="Lihat dan kelola semua pemberitahuan sistem"
      showBackButton={true}
      actions={
        <button 
          onClick={markAllAsRead}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200"
        >
          <CheckCircle2 size={16} />
          Tandai Semua Dibaca
        </button>
      }
    >
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-800">
        {notifications.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 dark:bg-slate-800/40">
              <CheckCircle2 size={32} className="text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium dark:text-slate-400">Tidak ada notifikasi</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((notif, index) => (
              <motion.div 
                key={notif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-6 flex flex-col sm:flex-row gap-4 sm:items-center justify-between transition-colors ${notif.read ? 'bg-white' : 'bg-blue-50/30'}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${notif.bg}`}>
                    <IconMapper name={notif.icon} size={20} className={notif.color} />
                  </div>
                  <div>
                    <h4 className={`text-base font-medium ${notif.read ? 'text-slate-700' : 'text-slate-900'}`}>
                      {notif.title}
                    </h4>
                    <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">{notif.desc}</p>
                    <p className="text-xs text-slate-400 mt-2 font-medium">{notif.time}</p>
                  </div>
                </div>
                
                {!notif.read && (
                  <button 
                    onClick={() => markAsRead(notif.id)}
                    className="self-start sm:self-center px-4 py-2 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Tandai Dibaca
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
