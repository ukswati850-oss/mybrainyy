import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, name: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email, name) => set({ 
        isAuthenticated: true, 
        user: { 
          id: Math.random().toString(36).substring(2), 
          email, 
          name,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
        } 
      }),
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    {
      name: 'brainy-auth',
    }
  )
);
