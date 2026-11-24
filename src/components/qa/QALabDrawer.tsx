import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FlaskConical,
  X,
  RotateCcw,
  ScanEye,
  Bug,
  Zap,
  Database,
  Activity,
  LogIn,
  ShoppingBag,
  Trash2,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { useQALab, QALabConfig } from '@/contexts/QALabContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { products } from '@/data/products';
import { useToast } from '@/hooks/use-toast';

type LabTab = 'chaos' | 'inspector' | 'telemetry';

interface ToggleRowProps {
  id: string;
  testId: string;
  label: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
  tone?: 'vermilion' | 'amber' | 'neutral';
}

const ToggleRow: React.FC<ToggleRowProps> = ({
  id,
  testId,
  label,
  description,
  checked,
  onToggle,
  tone = 'vermilion',
}) => {
  const activeBg =
    tone === 'amber'
      ? 'bg-amber-500'
      : tone === 'neutral'
      ? 'bg-emerald-500'
      : 'bg-[#E04F26]';

  return (
    <div className="flex items-start justify-between gap-4 rounded-md border border-zinc-800 bg-zinc-900/70 p-3">
      <div className="space-y-1">
        <label htmlFor={id} className="block text-xs font-semibold text-zinc-100 cursor-pointer">
          {label}
        </label>
        <p className="text-[11px] leading-relaxed text-zinc-400">{description}</p>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onToggle}
        data-testid={testId}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 ${
          checked ? `${activeBg} border-transparent` : 'bg-zinc-800 border-zinc-700'
        }`}
      >
        <span
          className={`pointer-events-none block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
};

export const QALabDrawer: React.FC = () => {
  const {
    config,
    isDrawerOpen,
    setDrawerOpen,
    toggleConfig,
    resetConfig,
    events,
    clearEvents,
    logEvent,
    activeChaosCount,
  } = useQALab();
  const { user, isAuthenticated, login, logout } = useAuth();
  const { items: cartItems, itemCount, subtotal, addToCart, clearCart } = useCart();
  const { items: wishlistItems, clearWishlist } = useWishlist();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<LabTab>('chaos');

  const handleQuickLogin = async () => {
    const res = await login('test@example.com', 'Password123!');
    if (res.success) {
      toast({
        title: 'QA Lab: Signed in',
        description: 'Authenticated as test@example.com.',
      });
    } else {
      toast({
        title: 'QA Lab: Login blocked',
        description: res.error || 'Chaos toggle intercepted quick login.',
        variant: 'destructive',
      });
    }
  };

  const handleSeedCart = async () => {
    const first = products.find((p) => p.stock > 0);
    const second = products.find((p) => p.stock > 0 && p.id !== first?.id);
    if (!first) return;

    const r1 = await addToCart(first, 1);
    if (!r1.success) {
      toast({
        title: 'QA Lab: Seed intercepted',
        description: r1.error || 'Cart chaos prevented seeding.',
        variant: 'destructive',
      });
      return;
    }
    if (second) {
      await addToCart(second, 1);
    }
    logEvent('LAB', 'SEED_CART', 'Seeded sample cart items from QA Lab');
    toast({
      title: 'QA Lab: Cart seeded',
      description: 'Added sample hardware items to your session cart.',
    });
  };

  const handleClearAllState = () => {
    if (isAuthenticated) {
      logout();
    }
    clearCart();
    clearWishlist();
    resetConfig();
    logEvent('LAB', 'FULL_RESET', 'Cleared user session, cart, wishlist, and lab flags.');
    toast({
      title: 'QA Lab: Clean slate',
      description: 'Session, cart, wishlist, and chaos flags reset.',
    });
  };

  const toggleItems: Array<{
    key: keyof QALabConfig;
    testId: string;
    label: string;
    description: string;
    tone?: 'vermilion' | 'amber' | 'neutral';
  }> = [
    {
      key: 'forceNextFailure',
      testId: 'qa-toggle-force-failure',
      label: 'Force Next Error (100%)',
      description: 'Deterministically fails the very next login, cart add, or checkout submission, then auto-resets.',
      tone: 'vermilion',
    },
    {
      key: 'authChaos',
      testId: 'qa-toggle-auth-chaos',
      label: 'Auth Chaos (10% 503 + jitter)',
      description: 'Injects 750-1100ms latency and random server failures on Sign In / Register.',
    },
    {
      key: 'cartChaos',
      testId: 'qa-toggle-cart-chaos',
      label: 'Cart Chaos (5% fail + jitter)',
      description: 'Simulates intermittent cart API failures and async latency when adding items.',
    },
    {
      key: 'checkoutChaos',
      testId: 'qa-toggle-checkout-chaos',
      label: 'Checkout Chaos (15% fail + delay)',
      description: 'Simulates payment gateway timeout or decline on Place Order.',
    },
    {
      key: 'networkLatency',
      testId: 'qa-toggle-latency',
      label: 'Simulated Network Latency',
      description: 'Enables skeleton loading states and async delays across catalog and detail views.',
      tone: 'amber',
    },
    {
      key: 'simulateLogoutBug',
      testId: 'qa-toggle-logout-bug',
      label: 'Replay BUG-001 / 002 (Logout Leak)',
      description: 'Reverts logout to pre-fix behavior: cart & wishlist remain populated after signing out.',
      tone: 'amber',
    },
  ];

  return (
    <div data-qa-lab-ui="true">
      {/* Floating Launcher Pill */}
      <button
        type="button"
        onClick={() => setDrawerOpen(!isDrawerOpen)}
        data-testid="qa-lab-trigger"
        aria-label="Open QA Control Lab"
        aria-expanded={isDrawerOpen}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 rounded-full border border-zinc-700 bg-[#141518] px-4 py-2.5 text-xs font-medium text-zinc-100 shadow-xl transition-transform hover:-translate-y-0.5 hover:border-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
      >
        <span
          className={`h-2 w-2 rounded-full ${
            activeChaosCount > 0 ? 'bg-[#E04F26] animate-pulse' : 'bg-emerald-400'
          }`}
          aria-hidden="true"
        />
        <FlaskConical className="h-3.5 w-3.5 text-zinc-300" aria-hidden="true" />
        <span className="font-mono tracking-tight">QA Lab</span>
        {activeChaosCount > 0 && (
          <span className="rounded bg-[#E04F26] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white">
            {activeChaosCount}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-over Workbench */}
      {isDrawerOpen && (
        <aside
          role="dialog"
          aria-label="QA Control Lab"
          data-testid="qa-lab-drawer"
          className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-zinc-800 bg-[#111214] text-zinc-100 shadow-2xl animate-fadeIn"
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded border border-zinc-700 bg-zinc-900">
                <FlaskConical className="h-4 w-4 text-[#E04F26]" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-sm font-semibold tracking-tight text-zinc-100">
                  QA Control Lab
                </h2>
                <p className="font-mono text-[11px] text-zinc-400">
                  {activeChaosCount > 0
                    ? `${activeChaosCount} override${activeChaosCount > 1 ? 's' : ''} active`
                    : 'Deterministic CI baseline'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              data-testid="qa-lab-close"
              aria-label="Close QA Control Lab"
              className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-3 border-b border-zinc-800 bg-zinc-950/60 px-2 pt-2">
            {(
              [
                { id: 'chaos', label: 'Chaos', icon: Zap },
                { id: 'inspector', label: 'Inspector', icon: Database },
                { id: 'telemetry', label: 'Telemetry', icon: Activity },
              ] as const
            ).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                data-testid={`qa-tab-${id}`}
                className={`flex items-center justify-center gap-1.5 border-b-2 px-3 py-2 text-xs font-medium transition-colors ${
                  activeTab === id
                    ? 'border-[#E04F26] text-zinc-100'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {activeTab === 'chaos' && (
              <>
                <div className="rounded-md border border-zinc-800 bg-zinc-900/50 p-3 text-[11px] text-zinc-300">
                  <div className="flex items-center gap-2 font-semibold text-zinc-100 mb-1">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                    Runtime Fault &amp; Defect Injection
                  </div>
                  Defaults stay deterministic for Playwright CI. Toggle switches below to verify
                  error states, loading skeletons, or replay resolved defects live.
                </div>

                <div className="space-y-2.5">
                  {toggleItems.map((item) => (
                    <ToggleRow
                      key={item.key}
                      id={`switch-${item.key}`}
                      testId={item.testId}
                      label={item.label}
                      description={item.description}
                      checked={config[item.key]}
                      onToggle={() => toggleConfig(item.key)}
                      tone={item.tone}
                    />
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={resetConfig}
                    data-testid="qa-reset-config"
                    className="flex w-full items-center justify-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-800 transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    Reset All Flags to Deterministic Baseline
                  </button>
                </div>
              </>
            )}

            {activeTab === 'inspector' && (
              <>
                <ToggleRow
                  id="switch-xrayMode"
                  testId="qa-toggle-xray"
                  label="data-testid X-Ray Overlay"
                  description="Highlights every testability selector directly on the live storefront DOM."
                  checked={config.xrayMode}
                  onToggle={() => toggleConfig('xrayMode')}
                  tone="neutral"
                />

                <div className="space-y-2.5">
                  <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    Live Storage Snapshot
                  </h3>

                  <div className="rounded-md border border-zinc-800 bg-zinc-900/70 p-3 font-mono text-[11px] space-y-2">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">session.currentUser</span>
                      <span className={isAuthenticated ? 'text-emerald-400' : 'text-zinc-400'}>
                        {isAuthenticated ? user?.email : 'null (guest)'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">session.cart</span>
                      <span className="text-zinc-100">
                        {itemCount} unit{itemCount === 1 ? '' : 's'} · ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">local.wishlist</span>
                      <span className="text-zinc-100">
                        {wishlistItems.length} item{wishlistItems.length === 1 ? '' : 's'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">logoutIsolation</span>
                      <span className={config.simulateLogoutBug ? 'text-amber-400' : 'text-emerald-400'}>
                        {config.simulateLogoutBug ? 'BUG-REPLAY (LEAKING)' : 'VERIFIED CLEAN'}
                      </span>
                    </div>
                  </div>

                  {cartItems.length > 0 && (
                    <div className="rounded-md border border-zinc-800 bg-zinc-950/60 p-3 font-mono text-[11px] text-zinc-300 space-y-1">
                      <p className="text-zinc-400 mb-1">Cart Payload:</p>
                      {cartItems.map((ci) => (
                        <div key={ci.product.id} className="flex justify-between">
                          <span className="truncate pr-2">{ci.product.id}</span>
                          <span>×{ci.quantity}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-1">
                  <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    Quick Test Fixtures
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      type="button"
                      onClick={handleQuickLogin}
                      data-testid="qa-quick-login"
                      className="flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-100 hover:bg-zinc-800 transition-colors"
                    >
                      <LogIn className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                      Sign In as Test User (test@example.com)
                    </button>
                    <button
                      type="button"
                      onClick={handleSeedCart}
                      data-testid="qa-seed-cart"
                      className="flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-100 hover:bg-zinc-800 transition-colors"
                    >
                      <ShoppingBag className="h-3.5 w-3.5 text-zinc-300" aria-hidden="true" />
                      Seed Sample Cart (2 Products)
                    </button>
                    <button
                      type="button"
                      onClick={handleClearAllState}
                      data-testid="qa-clear-session"
                      className="flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-medium text-rose-300 hover:bg-zinc-900 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      Reset Session, Cart, Wishlist &amp; Flags
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'telemetry' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                    Event Stream ({events.length})
                  </span>
                  <button
                    type="button"
                    onClick={clearEvents}
                    className="font-mono text-[11px] text-zinc-400 hover:text-zinc-200"
                  >
                    Clear
                  </button>
                </div>
                {events.length === 0 ? (
                  <p className="rounded-md border border-zinc-800 bg-zinc-900/50 p-4 text-center font-mono text-xs text-zinc-400">
                    No events recorded yet. Interact with the storefront.
                  </p>
                ) : (
                  <div className="space-y-2" data-testid="qa-telemetry-list">
                    {events.map((ev) => (
                      <div
                        key={ev.id}
                        className="rounded-md border border-zinc-800 bg-zinc-900/60 p-2.5 font-mono text-[11px]"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                              ev.category === 'CHAOS'
                                ? 'bg-[#E04F26]/20 text-[#ff8663]'
                                : ev.category === 'SESSION'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-zinc-800 text-zinc-300'
                            }`}
                          >
                            {ev.category} · {ev.action}
                          </span>
                          <span className="text-[10px] text-zinc-500">{ev.timestamp}</span>
                        </div>
                        <p className="text-zinc-300 leading-relaxed">{ev.detail}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          <div className="border-t border-zinc-800 bg-zinc-950/80 px-5 py-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                toggleConfig('xrayMode');
              }}
              className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 font-mono text-[11px] transition-colors ${
                config.xrayMode
                  ? 'bg-[#E04F26] text-white'
                  : 'border border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              <ScanEye className="h-3.5 w-3.5" aria-hidden="true" />
              {config.xrayMode ? 'X-Ray ON' : 'X-Ray OFF'}
            </button>
            <button
              type="button"
              onClick={() => {
                setDrawerOpen(false);
                navigate('/qa-dossier');
              }}
              data-testid="qa-lab-open-dossier"
              className="inline-flex items-center gap-1.5 rounded border border-zinc-700 bg-zinc-900 px-3 py-1.5 font-mono text-[11px] text-zinc-100 hover:bg-zinc-800 transition-colors"
            >
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
              Open QA Dossier
            </button>
            {config.simulateLogoutBug && (
              <span className="inline-flex items-center gap-1 font-mono text-[10px] text-amber-400">
                <Bug className="h-3 w-3" aria-hidden="true" />
                Bug Replay
              </span>
            )}
          </div>
        </aside>
      )}
    </div>
  );
};
