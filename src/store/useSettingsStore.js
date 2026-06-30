import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
  persist(
    (set) => ({
      branding: {
        logo: '/v-com-logo-new.png',
        companyName: 'V-com Website',
      },
      preferences: {
        emailNotif: true,
        pushNotif: true,
        adminNotif: false,
        language: 'id',
        timezone: 'WIB',
        emailFreq: 'daily',
        darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
        animationsEnabled: true,
        fontSize: 'text-base',
        analytics: true
      },
      updateBranding: (newBranding) => set((state) => ({
        branding: { ...state.branding, ...newBranding }
      })),
      updatePreferences: (newPrefs) => set((state) => ({
        preferences: { ...state.preferences, ...newPrefs }
      })),
    }),
    {
      name: 'vcom-settings-storage',
      partialize: (state) => ({ preferences: state.preferences }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        preferences: { ...currentState.preferences, ...(persistedState?.preferences || {}) }
      }),
    }
  )
);
