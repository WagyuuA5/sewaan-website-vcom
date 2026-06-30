import { create } from 'zustand';

// Utility to generate a fake JWT token
const generateMockToken = (user) => {
  const payload = btoa(JSON.stringify({ ...user, exp: Date.now() + 86400000 })); // 24 hours expiry
  return `eyJhbGciOiJIUzI1NiIsInR5cCI.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfg.${payload}`;
};

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  role: null,
  isAuthenticated: false,
  isLoading: true, // Used to show Splash Screen while verifying token

  // Initialize app state by reading from localStorage
  initialize: () => {
    const storedToken = localStorage.getItem('vcom_token');
    const storedUser = localStorage.getItem('vcom_user');

    if (storedToken && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      set({
        user: parsedUser,
        token: storedToken,
        role: parsedUser.role || 'Admin',
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      set({
        user: null,
        token: null,
        role: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  // Mock Login Function
  login: async (email, password) => {
    set({ isLoading: true });
    
    // Simulate network delay for standard loading feel
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Hardcoded credentials for mocking phase
    // Admin
    if (email === 'admin@v-com.id' && password === 'admin123') {
      const user = { id: 'usr_1', name: 'Administrator', email, role: 'Admin' };
      const token = generateMockToken(user);
      
      localStorage.setItem('vcom_token', token);
      localStorage.setItem('vcom_user', JSON.stringify(user));

      set({ user, token, role: 'Admin', isAuthenticated: true, isLoading: false });
      return { success: true };
    }
    // Manager
    else if (email === 'manager@v-com.id' && password === 'manager123') {
      const user = { id: 'usr_2', name: 'Manager Ops', email, role: 'Manager' };
      const token = generateMockToken(user);
      
      localStorage.setItem('vcom_token', token);
      localStorage.setItem('vcom_user', JSON.stringify(user));

      set({ user, token, role: 'Manager', isAuthenticated: true, isLoading: false });
      return { success: true };
    }
    // Teknisi
    else if (email === 'teknisi@v-com.id' && password === 'teknisi123') {
      const user = { id: 'usr_3', name: 'John Teknisi', email, role: 'Teknisi' };
      const token = generateMockToken(user);
      
      localStorage.setItem('vcom_token', token);
      localStorage.setItem('vcom_user', JSON.stringify(user));

      set({ user, token, role: 'Teknisi', isAuthenticated: true, isLoading: false });
      return { success: true };
    }

    set({ isLoading: false });
    return { success: false, message: 'Email atau password salah.' };
  },

  // Mock Register Function
  register: async (userData) => {
    set({ isLoading: true });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real app, this would send data to backend.
    // For mock, we immediately log them in.
    const newUser = { 
      id: `usr_${Date.now()}`, 
      name: userData.name, 
      email: userData.email, 
      role: userData.role 
    };
    const token = generateMockToken(newUser);
    
    localStorage.setItem('vcom_token', token);
    localStorage.setItem('vcom_user', JSON.stringify(newUser));

    set({ user: newUser, token, role: userData.role, isAuthenticated: true, isLoading: false });
    return { success: true };
  },

  // Logout Function
  logout: () => {
    localStorage.removeItem('vcom_token');
    localStorage.removeItem('vcom_user');
    
    set({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
    });
  }
}));
