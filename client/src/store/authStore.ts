import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  login: (token: string, user: any) => void;
  logout: () => void;
  
  // --- Legacy Trek India compatibility properties to fix compilation errors ---
  isLoading: boolean;
  error: string | null;
  loadUser: () => Promise<void>;
  register: (user: any) => Promise<void>;
  demoLogin: () => Promise<void>;
  completeMfaLogin: (code: string) => Promise<void>;
  placesPhotosEnabled: boolean;
  authCheckFailed: boolean;
  updateMapsKey: (key: string) => void;
  updateApiKeys: (keys: any) => void;
  updateProfile: (profile: any) => void;
  setDemoMode: (mode: boolean) => void;
  demoMode: boolean;
  setDevMode: (mode: boolean) => void;
  setHasMapsKey: (hasKey: boolean) => void;
  setServerTimezone: (tz: string) => void;
  setAppRequireMfa: (req: boolean) => void;
  setTripRemindersEnabled: (enabled: boolean) => void;
  devMode: boolean;
  hasMapsKey: boolean;
  serverTimezone: string;
  appRequireMfa: boolean;
  tripRemindersEnabled: boolean;
  deleteAvatar: () => Promise<void>;
  uploadAvatar: (file: any) => Promise<void>;
}

const getInitialUser = () => {
  const userStr = localStorage.getItem('mock_user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem('lokaal_token'),
  user: getInitialUser(),
  login: (token, user) => {
    localStorage.setItem('lokaal_token', token);
    localStorage.setItem('mock_user', JSON.stringify(user));
    set({ isAuthenticated: true, user });
  },
  logout: () => {
    localStorage.removeItem('lokaal_token');
    localStorage.removeItem('mock_user');
    localStorage.removeItem('verified_aadhaar_name');
    set({ isAuthenticated: false, user: null });
  },

  // --- Dummy implementations for legacy compatibility ---
  isLoading: false,
  error: null,
  loadUser: async () => {},
  register: async () => {},
  demoLogin: async () => {},
  completeMfaLogin: async () => {},
  placesPhotosEnabled: true,
  authCheckFailed: false,
  updateMapsKey: () => {},
  updateApiKeys: () => {},
  updateProfile: () => {},
  setDemoMode: () => {},
  demoMode: false,
  setDevMode: () => {},
  setHasMapsKey: () => {},
  setServerTimezone: () => {},
  setAppRequireMfa: () => {},
  setTripRemindersEnabled: () => {},
  devMode: false,
  hasMapsKey: false,
  serverTimezone: 'UTC',
  appRequireMfa: false,
  tripRemindersEnabled: false,
  deleteAvatar: async () => {},
  uploadAvatar: async () => {},
}));
