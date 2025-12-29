import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, validateLogin, registerUser } from '@/data/users';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

const enableAuthChaos = import.meta.env.VITE_ENABLE_AUTH_CHAOS === "true";

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

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    // Simulate network delay for testing async behavior
    if (enableAuthChaos) {
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
    }

    // Simulate occasional API failure (10% chance)
    if (enableAuthChaos &&  Math.random() < 0.1) {
			setIsLoading(false);
			return { success: false, error: "Server error. Please try again later." };
		}
    
    const result = validateLogin(email, password);
    
    if (result.success && result.user) {
      const userWithoutPassword = { ...result.user, password: '' };
      setUser(userWithoutPassword);
      sessionStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    }
    
    setIsLoading(false);
    return { success: result.success, error: result.error };
  }, []);

  const register = useCallback(async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    // Simulate network delay
    if (enableAuthChaos) {
			await new Promise((resolve) =>
				setTimeout(resolve, 800 + Math.random() * 400),
			);
		}
    
    // Simulate occasional API failure (10% chance)
    if (enableAuthChaos && Math.random() < 0.1) {
			setIsLoading(false);
			return {
				success: false,
				error: "Registration failed. Please try again later.",
			};
		}
    
    const result = registerUser(email, password, name);
    
    if (result.success && result.user) {
      const userWithoutPassword = { ...result.user, password: '' };
      setUser(userWithoutPassword);
      sessionStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    }
    
    setIsLoading(false);
    return { success: result.success, error: result.error };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('currentUser');
    clearCart();
    clearWishlist();
  }, [clearCart, clearWishlist]);

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
