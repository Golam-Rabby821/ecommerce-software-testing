import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  RotateCcw,
  SlidersHorizontal,
  CheckCircle2,
  Circle,
  X,
  Compass,
} from 'lucide-react';
import { useQALab } from '@/contexts/QALabContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

interface MissionStep {
  label: string;
  done: boolean;
}

/**
 * Slim persistent bar mounted below Header only when chaos/X-Ray overrides
 * or a Guided QA Mission are active. Renders nothing in default deterministic mode.
 */
export const QAMissionBar: React.FC = () => {
  const {
    config,
    activeChaosCount,
    activeMission,
    setActiveMission,
    setConfigFlag,
    resetConfig,
    setDrawerOpen,
    events,
  } = useQALab();
  const { isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  if (activeChaosCount === 0 && !activeMission) {
    return null;
  }

  const activeLabels: string[] = [];
  if (config.forceNextFailure) activeLabels.push('Force Next Error');
  if (config.authChaos) activeLabels.push('Auth Chaos');
  if (config.cartChaos) activeLabels.push('Cart Chaos');
  if (config.checkoutChaos) activeLabels.push('Checkout Chaos');
  if (config.latencyMs > 0) activeLabels.push(`Latency ${config.latencyMs}ms`);
  if (config.simulateLogoutBug) activeLabels.push('BUG-001/002 Replay');
  if (config.xrayMode) activeLabels.push('X-Ray Inspector');

  const hasEvent = (action: string) => events.some((ev) => ev.action === action);

  let missionTitle = '';
  let missionSteps: MissionStep[] = [];

  if (activeMission === 'bug-001') {
    missionTitle = 'Mission 01 · Reproduce & Verify BUG-001 (Logout Session Leak)';
    const leaked = hasEvent('BUG_REPLAY_LOGOUT_LEAK');
    const fixed = hasEvent('SESSION_ISOLATED');
    missionSteps = [
      { label: 'Signed in with item in cart', done: (isAuthenticated && itemCount > 0) || leaked },
      { label: 'Click Logout with BUG-001 Replay ON', done: leaked },
      { label: 'Visit /cart to observe leaked item', done: leaked && location.pathname === '/cart' && !isAuthenticated && itemCount > 0 },
      { label: 'Disable Replay & verify clean logout', done: !config.simulateLogoutBug && fixed },
    ];
  } else if (activeMission === 'checkout-chaos') {
    missionTitle = 'Mission 02 · Checkout Payment Fault Resilience';
    const declined = hasEvent('CHECKOUT_PAYMENT_DECLINED');
    const placed = hasEvent('ORDER_PLACED');
    missionSteps = [
      { label: 'Enter Checkout with Force Error armed', done: (location.pathname === '/checkout' && config.forceNextFailure) || declined || placed },
      { label: 'Place Order -> payment fails & cart intact', done: declined },
      { label: 'Retry Place Order -> Order Confirmed', done: placed },
    ];
  } else if (activeMission === 'stock-guard') {
    missionTitle = 'Mission 03 · Out-of-Stock & Quantity Boundary Guard';
    missionSteps = [
      { label: 'Inspect out-of-stock prod-004 (CTA disabled)', done: location.pathname === '/product/prod-004' },
      { label: 'Inspect low-stock prod-002 (max 8 units)', done: location.pathname === '/product/prod-002' },
    ];
  }

  return (
    <div data-qa-lab-ui="true" className="border-b border-zinc-800 bg-[#141518] text-zinc-100">
      {activeChaosCount > 0 && (
        <div
          data-testid="qa-override-banner"
          className="container flex flex-wrap items-center justify-between gap-2 py-2 text-xs"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-mono font-semibold text-amber-300">
              <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
              QA OVERRIDES ACTIVE:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activeLabels.map((lbl) => (
                <span
                  key={lbl}
                  className="rounded border border-zinc-700 bg-zinc-900 px-2 py-0.5 font-mono text-[11px] text-zinc-200"
                >
                  {lbl}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex items-center gap-1 rounded border border-zinc-700 bg-zinc-900 px-2.5 py-1 font-mono text-[11px] text-zinc-200 hover:bg-zinc-800"
            >
              <SlidersHorizontal className="h-3 w-3" aria-hidden="true" />
              Open Lab
            </button>
            <button
              type="button"
              onClick={resetConfig}
              data-testid="qa-banner-reset"
              className="inline-flex items-center gap-1 rounded bg-zinc-100 px-2.5 py-1 font-mono text-[11px] font-semibold text-zinc-900 hover:bg-white"
            >
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              Reset All
            </button>
          </div>
        </div>
      )}

      {activeMission && (
        <div
          data-testid="qa-mission-banner"
          className="border-t border-zinc-800/80 bg-zinc-950/70"
        >
          <div className="container py-2.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[#ff8663]">
                <Compass className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{missionTitle}</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                {missionSteps.map((step, idx) => (
                  <span
                    key={idx}
                    className={`inline-flex items-center gap-1.5 ${
                      step.done ? 'text-emerald-300' : 'text-zinc-300'
                    }`}
                  >
                    {step.done ? (
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    ) : (
                      <Circle className="h-3.5 w-3.5 shrink-0 text-zinc-500" aria-hidden="true" />
                    )}
                    <span>{step.label}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {activeMission === 'bug-001' && (
                <>
                  <button
                    type="button"
                    onClick={() => navigate('/cart')}
                    className="rounded border border-zinc-700 bg-zinc-900 px-2.5 py-1 font-mono text-[11px] text-zinc-200 hover:bg-zinc-800"
                  >
                    Inspect /cart
                  </button>
                  {config.simulateLogoutBug && (
                    <button
                      type="button"
                      onClick={() => setConfigFlag('simulateLogoutBug', false)}
                      className="rounded border border-emerald-700 bg-emerald-950 px-2.5 py-1 font-mono text-[11px] text-emerald-200 hover:bg-emerald-900"
                    >
                      Disable Replay
                    </button>
                  )}
                </>
              )}
              {activeMission === 'stock-guard' && (
                <>
                  <button
                    type="button"
                    onClick={() => navigate('/product/prod-004')}
                    className="rounded border border-zinc-700 bg-zinc-900 px-2.5 py-1 font-mono text-[11px] text-zinc-200 hover:bg-zinc-800"
                  >
                    Open prod-004 (0 stock)
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/product/prod-002')}
                    className="rounded border border-zinc-700 bg-zinc-900 px-2.5 py-1 font-mono text-[11px] text-zinc-200 hover:bg-zinc-800"
                  >
                    Open prod-002 (8 stock)
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => setActiveMission(null)}
                data-testid="qa-mission-exit"
                aria-label="Exit QA mission"
                className="inline-flex items-center gap-1 rounded border border-zinc-700 bg-zinc-900 px-2.5 py-1 font-mono text-[11px] text-zinc-300 hover:bg-zinc-800"
              >
                <X className="h-3 w-3" aria-hidden="true" />
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
