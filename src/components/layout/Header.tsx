import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Heart, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandMark } from '@/components/layout/BrandMark';
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

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
    }`;

  return (
    <header
      className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      data-testid="header"
    >
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          data-testid="logo-link"
          aria-label="TechStore Home"
        >
          <BrandMark />
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-6"
          data-testid="desktop-nav"
        >
          <NavLink to="/" end className={navLinkClass} data-testid="nav-shop">
            Shop
          </NavLink>

          <NavLink
            to="/wishlist"
            className={({ isActive }) =>
              `relative inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${
                isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`
            }
            data-testid="nav-wishlist"
          >
            <Heart className="h-4 w-4" aria-hidden="true" />
            <span>Wishlist</span>
            {wishlistCount > 0 && (
              <span
                className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-foreground px-1.5 font-mono text-[11px] font-semibold text-background tabular-nums"
                data-testid="wishlist-count"
              >
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `relative inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${
                isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`
            }
            data-testid="nav-cart"
          >
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            <span>Cart</span>
            {itemCount > 0 && (
              <span
                className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent px-1.5 font-mono text-[11px] font-semibold text-accent-foreground tabular-nums"
                data-testid="cart-count"
              >
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </NavLink>

          <span className="h-4 w-px bg-border" aria-hidden="true" />

          <NavLink
            to="/qa-dossier"
            className={({ isActive }) =>
              `inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs font-medium transition-colors ${
                isActive
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-card text-foreground hover:border-foreground/40'
              }`
            }
            data-testid="nav-qa-dossier"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            <span>QA Dossier</span>
          </NavLink>
        </nav>

        {/* Auth Section */}
        <div className="hidden md:flex items-center gap-2" data-testid="auth-section">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                data-testid="profile-link"
              >
                <User className="h-4 w-4" aria-hidden="true" />
                <span>{user?.name?.split(' ')[0]}</span>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                data-testid="logout-button"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
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

        {/* Mobile Menu Controls */}
        <div className="flex md:hidden items-center gap-1.5">
          <Link
            to="/wishlist"
            className="relative p-2 text-foreground"
            data-testid="mobile-wishlist-link"
            aria-label={`Wishlist (${wishlistCount})`}
          >
            <Heart className="h-5 w-5" aria-hidden="true" />
            {wishlistCount > 0 && (
              <span
                className="absolute top-0.5 right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-foreground px-1 font-mono text-[10px] font-bold text-background"
                data-testid="mobile-wishlist-count"
              >
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            )}
          </Link>
          <Link
            to="/cart"
            className="relative p-2 text-foreground"
            data-testid="mobile-cart-link"
            aria-label={`Cart (${itemCount})`}
          >
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
            {itemCount > 0 && (
              <span
                className="absolute top-0.5 right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 font-mono text-[10px] font-bold text-accent-foreground"
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
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
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
          <nav aria-label="Mobile navigation" className="container flex flex-col gap-3 py-4">
            <Link
              to="/"
              className="text-sm font-medium text-foreground py-1"
              onClick={() => setIsMobileMenuOpen(false)}
              data-testid="mobile-nav-shop"
            >
              Shop
            </Link>
            <Link
              to="/wishlist"
              className="text-sm font-medium text-foreground py-1"
              onClick={() => setIsMobileMenuOpen(false)}
              data-testid="mobile-nav-wishlist"
            >
              Wishlist ({wishlistCount})
            </Link>
            <Link
              to="/cart"
              className="text-sm font-medium text-foreground py-1"
              onClick={() => setIsMobileMenuOpen(false)}
              data-testid="mobile-nav-cart"
            >
              Cart ({itemCount})
            </Link>
            <Link
              to="/qa-dossier"
              className="inline-flex items-center gap-2 font-mono text-sm font-medium text-foreground py-1"
              onClick={() => setIsMobileMenuOpen(false)}
              data-testid="mobile-nav-qa-dossier"
            >
              <ShieldCheck className="h-4 w-4 text-accent" aria-hidden="true" />
              QA Dossier
            </Link>
            <div className="border-t border-border pt-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="block mb-2 text-sm font-medium text-foreground"
                    onClick={() => setIsMobileMenuOpen(false)}
                    data-testid="mobile-profile-link"
                  >
                    <User className="h-4 w-4 inline mr-2" aria-hidden="true" />
                    My Account ({user?.name})
                  </Link>
                  <p className="mb-3 text-xs text-muted-foreground" data-testid="mobile-user-greeting">
                    Logged in as {user?.name}
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleLogout}
                    data-testid="mobile-logout-button"
                  >
                    <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
                    Logout
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      navigate('/auth?mode=login');
                      setIsMobileMenuOpen(false);
                    }}
                    data-testid="mobile-login-button"
                  >
                    Login
                  </Button>
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={() => {
                      navigate('/auth?mode=register');
                      setIsMobileMenuOpen(false);
                    }}
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
