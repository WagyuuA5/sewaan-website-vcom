import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useProfileStore = create(
  persist(
    (set) => ({
      profile: {
        name: 'Administrator',
        email: 'admin@v-com.id',
        phone: '+6281234567890',
        role: 'Administrator',
        bio: 'Saya adalah administrator platform ini.',
        location: { label: 'Jakarta, Indonesia', lat: -6.200000, lng: 106.816666 },
        joinDate: '1 Januari 2024',
        avatar: '',
        socials: [
          { id: 1, platform: 'LinkedIn', url: 'https://linkedin.com/in/admin' }
        ],
        isTwoFactorEnabled: false
      },
      updateProfile: (newData) => set((state) => ({
        profile: { ...state.profile, ...newData }
      })),
      addSocial: (platform = 'Website', url = '') => set((state) => {
        if (state.profile.socials.length >= 5) return state;
        return {
          profile: {
            ...state.profile,
            socials: [
              ...state.profile.socials,
              { id: Date.now(), platform, url }
            ]
          }
        };
      }),
      updateSocial: (id, updates) => set((state) => ({
        profile: {
          ...state.profile,
          socials: state.profile.socials.map((s) => 
            s.id === id ? { ...s, ...updates } : s
          )
        }
      })),
      removeSocial: (id) => set((state) => ({
        profile: {
          ...state.profile,
          socials: state.profile.socials.filter((s) => s.id !== id)
        }
      })),
      resetProfile: () => set({
        profile: {
          name: 'Administrator',
          email: 'admin@v-com.id',
          phone: '+6281234567890',
          role: 'Administrator',
          bio: 'Saya adalah administrator platform ini.',
          location: { label: 'Jakarta, Indonesia', lat: -6.200000, lng: 106.816666 },
          joinDate: '1 Januari 2024',
          avatar: '',
          socials: [
            { id: 1, platform: 'LinkedIn', url: 'https://linkedin.com/in/admin' }
          ],
          isTwoFactorEnabled: false
        }
      })
    }),
    {
      name: 'vcom_profile',
      version: 2,
      migrate: (persistedState, version) => {
        const state = { ...persistedState };
        if (version < 2) {
          if (state.profile) {
            // Handle undefined/null location
            if (!state.profile.location) {
              state.profile.location = { label: 'Jakarta, Indonesia', lat: -6.200000, lng: 106.816666 };
            } 
            // Handle string location (from previous version)
            else if (typeof state.profile.location === 'string') {
              state.profile.location = { 
                label: state.profile.location, 
                lat: -6.200000, 
                lng: 106.816666 
              };
            } 
            // Handle object location with missing label (edge case)
            else if (typeof state.profile.location === 'object') {
              state.profile.location = {
                label: state.profile.location.label || 'Lokasi tidak diketahui',
                lat: state.profile.location.lat ?? -6.200000,
                lng: state.profile.location.lng ?? 106.816666
              };
            }
          }
        }
        return state;
      }
    }
  )
);
