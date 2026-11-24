import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, validateLogin, registerUser } from '@/data/users';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useQALab } from '@/contexts/QALabContext';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = sessionStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const { clearCart } = useCart();
  const { clearWishlist } = useWishlist();
  const { config, consumeForcedFailure, logEvent } = useQALab();

  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);

      if (config.authChaos || config.networkLatency) {
        await new Promise((resolve) => setTimeout(resolve, 750 + Math.random() * 350));
      }

      if (consumeForcedFailure('Auth.login') || (config.authChaos && Math.random() < 0.1)) {
        setIsLoading(false);
        logEvent('CHAOS', 'AUTH_LOGIN_ABORTED', `Simulated API 503 during login for ${email}`);
        return { success: false, error: 'Server error. Please try again later.' };
      }

      const result = validateLogin(email, password);

      if (result.success && result.user) {
        const userWithoutPassword = { ...result.user, password: '' };
        setUser(userWithoutPassword);
        sessionStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        logEvent('AUTH', 'LOGIN_SUCCESS', `Authenticated as ${userWithoutPassword.email}`);
      } else {
        logEvent('AUTH', 'LOGIN_REJECTED', result.error || 'Invalid credentials');
      }

      setIsLoading(false);
      return { success: result.success, error: result.error };
    },
    [config.authChaos, config.networkLatency, consumeForcedFailure, logEvent]
  );

  const register = useCallback(
    async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);

      if (config.authChaos || config.networkLatency) {
        await new Promise((resolve) => setTimeout(resolve, 750 + Math.random() * 350));
      }

      if (consumeForcedFailure('Auth.register') || (config.authChaos && Math.random() < 0.1)) {
        setIsLoading(false);
        logEvent('CHAOS', 'AUTH_REGISTER_ABORTED', `Simulated API failure during registration for ${email}`);
        return {
          success: false,
          error: 'Registration failed. Please try again later.',
        };
      }

      const result = registerUser(email, password, name);

      if (result.success && result.user) {
        const userWithoutPassword = { ...result.user, password: '' };
        setUser(userWithoutPassword);
        sessionStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        logEvent('AUTH', 'REGISTER_SUCCESS', `Created account for ${userWithoutPassword.email}`);
      } else {
        logEvent('AUTH', 'REGISTER_REJECTED', result.error || 'Registration error');
      }

      setIsLoading(false);
      return { success: result.success, error: result.error };
    },
    [config.authChaos, config.networkLatency, consumeForcedFailure, logEvent]
  );

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('currentUser');

    if (config.simulateLogoutBug) {
      // Historical BUG-001 / BUG-002 replay: skip clearing cart and wishlist on logout
      logEvent(
        'SESSION',
        'BUG_REPLAY_LOGOUT_LEAK',
        'Simulated pre-fix state: auth cleared while cart & wishlist persisted!'
      );
      return;
    }

    clearCart();
    clearWishlist();
    logEvent('SESSION', 'SESSION_ISOLATED', 'User logged out; cart & wishlist cleared cleanly.');
  }, [clearCart, clearWishlist, config.simulateLogoutBug, logEvent]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
