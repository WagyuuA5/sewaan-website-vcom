import { create } from 'zustand';


export const useNotifStore = create((set, get) => ({
  notifications: [
    { 
      id: 1, 
      title: 'Invoice IFORTE', 
      desc: 'Jatuh tempo besok', 
      time: '10 menit lalu', 
      icon: 'AlertCircle', 
      color: 'text-amber-500', 
      bg: 'bg-amber-100',
      read: false
    },
    { 
      id: 2, 
      title: 'Sewa Baru', 
      desc: 'PT. Teknologi Maju menyewa 2 Unit', 
      time: '1 jam lalu', 
      icon: 'Laptop', 
      color: 'text-blue-500', 
      bg: 'bg-blue-100',
      read: false
    },
    { 
      id: 3, 
      title: 'Stok Menipis', 
      desc: 'Stok Keyboard Macbook Air M1 sisa 5', 
      time: '3 jam lalu', 
      icon: 'Package', 
      color: 'text-rose-500', 
      bg: 'bg-rose-100',
      read: false
    },
  ],

  unreadCount: () => get().notifications.filter(n => !n.read).length,

  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),

  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),

  addNotification: (notif) => set((state) => ({
    notifications: [
      {
        id: Date.now(),
        time: 'Baru saja',
        read: false,
        ...notif
      },
      ...state.notifications
    ]
  }))
}));
