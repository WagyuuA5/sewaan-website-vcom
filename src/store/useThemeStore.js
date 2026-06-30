import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'light', // 'light' or 'dark'
      
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'vcom-theme-store', // key in localStorage
      storage: createJSONStorage(() => localStorage),
      version: 1, // useful for future migrations
    }
  )
);
