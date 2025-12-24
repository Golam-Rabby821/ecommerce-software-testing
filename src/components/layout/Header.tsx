import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      data-testid="header"
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 font-display text-xl font-bold text-foreground transition-colors hover:text-primary"
          data-testid="logo-link"
        >
          <img
            src="/logo-ts.svg"
            alt="TechStore logo"
            className="w-[150px] rounded-lg object-contain"
          />
          
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6" data-testid="desktop-nav">
          <Link 
            to="/" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            data-testid="nav-shop"
          >
            Shop
          </Link>
          <Link 
            to="/wishlist" 
            className="relative flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            data-testid="nav-wishlist"
          >
            <Heart className="h-5 w-5" />
            <span>Wishlist</span>
            {wishlistCount > 0 && (
              <span 
                className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground"
                data-testid="wishlist-count"
              >
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            )}
          </Link>
          <Link 
            to="/cart" 
            className="relative flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            data-testid="nav-cart"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Cart</span>
            {itemCount > 0 && (
              <span 
                className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground"
                data-testid="cart-count"
              >
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Auth Section */}
        <div className="hidden md:flex items-center gap-3" data-testid="auth-section">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="profile-link"
              >
                <User className="h-4 w-4" />
                {user?.name?.split(' ')[0]}
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                data-testid="logout-button"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/auth?mode=login')}
                data-testid="login-button"
              >
                Login
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => navigate('/auth?mode=register')}
                data-testid="register-button"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link 
            to="/wishlist" 
            className="relative p-2"
            data-testid="mobile-wishlist-link"
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span 
                className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground"
                data-testid="mobile-wishlist-count"
              >
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            )}
          </Link>
          <Link 
            to="/cart" 
            className="relative p-2"
            data-testid="mobile-cart-link"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span 
                className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground"
                data-testid="mobile-cart-count"
              >
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="mobile-menu-button"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden border-t border-border bg-background animate-slideDown"
          data-testid="mobile-menu"
        >
          <nav className="container flex flex-col gap-4 py-4">
            <Link 
              to="/" 
              className="text-sm font-medium text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
              data-testid="mobile-nav-shop"
            >
              Shop
            </Link>
            <Link 
              to="/wishlist" 
              className="text-sm font-medium text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
              data-testid="mobile-nav-wishlist"
            >
              Wishlist ({wishlistCount})
            </Link>
            <Link 
              to="/cart" 
              className="text-sm font-medium text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
              data-testid="mobile-nav-cart"
            >
              Cart ({itemCount})
            </Link>
            <div className="border-t border-border pt-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="block mb-2 text-sm font-medium text-foreground"
                    onClick={() => setIsMobileMenuOpen(false)}
                    data-testid="mobile-profile-link"
                  >
                    <User className="h-4 w-4 inline mr-2" />
                    My Account
                  </Link>
                  <p 
                    className="mb-2 text-sm text-muted-foreground"
                    data-testid="mobile-user-greeting"
                  >
                    Logged in as {user?.name}
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleLogout}
                    data-testid="mobile-logout-button"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => { navigate('/auth?mode=login'); setIsMobileMenuOpen(false); }}
                    data-testid="mobile-login-button"
                  >
                    Login
                  </Button>
                  <Button 
                    variant="default" 
                    className="w-full" 
                    onClick={() => { navigate('/auth?mode=register'); setIsMobileMenuOpen(false); }}
                    data-testid="mobile-register-button"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

