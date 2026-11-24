import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from 'react';

export interface QALabConfig {
  authChaos: boolean;
  cartChaos: boolean;
  checkoutChaos: boolean;
  networkLatency: boolean;
  forceNextFailure: boolean;
  simulateLogoutBug: boolean;
  xrayMode: boolean;
}

export type QAEventCategory = 'AUTH' | 'CART' | 'CHECKOUT' | 'CHAOS' | 'SESSION' | 'LAB';

export interface QAEvent {
  id: string;
  timestamp: string;
  category: QAEventCategory;
  action: string;
  detail: string;
}

interface QALabContextType {
  config: QALabConfig;
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  toggleConfig: (key: keyof QALabConfig) => void;
  setConfigFlag: (key: keyof QALabConfig, value: boolean) => void;
  resetConfig: () => void;
  events: QAEvent[];
  logEvent: (category: QAEventCategory, action: string, detail: string) => void;
  clearEvents: () => void;
  consumeForcedFailure: (contextLabel: string) => boolean;
  activeChaosCount: number;
}

const QA_LAB_STORAGE_KEY = 'techstore_qa_lab_config';
const MAX_EVENTS = 25;

const getEnvDefaultConfig = (): QALabConfig => ({
  authChaos: import.meta.env.VITE_ENABLE_AUTH_CHAOS === 'true',
  cartChaos: import.meta.env.VITE_ENABLE_CART_CHAOS === 'true',
  checkoutChaos: import.meta.env.VITE_ENABLE_CHECKOUT_CHAOS === 'true',
  networkLatency: false,
  forceNextFailure: false,
  simulateLogoutBug: false,
  xrayMode: false,
});

const loadInitialConfig = (): QALabConfig => {
  const defaults = getEnvDefaultConfig();
  try {
    const raw = sessionStorage.getItem(QA_LAB_STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<QALabConfig>;
    return {
      ...defaults,
      ...parsed,
    };
  } catch {
    return defaults;
  }
};

const QALabContext = createContext<QALabContextType | undefined>(undefined);

/**
 * Provides runtime QA controls (chaos toggles, X-Ray testid overlay,
 * historical bug replay, and live telemetry) without altering deterministic CI defaults.
 */
export const QALabProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<QALabConfig>(loadInitialConfig);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [events, setEvents] = useState<QAEvent[]>(() => [
    {
      id: 'evt-boot',
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      category: 'LAB',
      action: 'SUT_INITIALIZED',
      detail: 'Deterministic mode ready. Open QA Lab to inject faults or inspect testids.',
    },
  ]);

  const forceFailureRef = useRef(config.forceNextFailure);
  forceFailureRef.current = config.forceNextFailure;

  useEffect(() => {
    try {
      sessionStorage.setItem(QA_LAB_STORAGE_KEY, JSON.stringify(config));
    } catch {
      // Ignore storage write errors in restricted contexts
    }
  }, [config]);

  useEffect(() => {
    document.documentElement.classList.toggle('qa-xray-active', config.xrayMode);
    return () => {
      document.documentElement.classList.remove('qa-xray-active');
    };
  }, [config.xrayMode]);

  const logEvent = useCallback(
    (category: QAEventCategory, action: string, detail: string) => {
      const entry: QAEvent = {
        id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        category,
        action,
        detail,
      };
      setEvents((prev) => [entry, ...prev].slice(0, MAX_EVENTS));
    },
    []
  );

  const setConfigFlag = useCallback(
    (key: keyof QALabConfig, value: boolean) => {
      if (key === 'forceNextFailure') {
        forceFailureRef.current = value;
      }
      setConfig((prev) => ({ ...prev, [key]: value }));
      logEvent('LAB', value ? 'FLAG_ENABLED' : 'FLAG_DISABLED', `${key} -> ${String(value)}`);
    },
    [logEvent]
  );

  const toggleConfig = useCallback(
    (key: keyof QALabConfig) => {
      setConfig((prev) => {
        const nextVal = !prev[key];
        if (key === 'forceNextFailure') {
          forceFailureRef.current = nextVal;
        }
        logEvent('LAB', nextVal ? 'FLAG_ENABLED' : 'FLAG_DISABLED', `${key} -> ${String(nextVal)}`);
        return { ...prev, [key]: nextVal };
      });
    },
    [logEvent]
  );

  const resetConfig = useCallback(() => {
    const defaults = getEnvDefaultConfig();
    forceFailureRef.current = defaults.forceNextFailure;
    setConfig(defaults);
    logEvent('LAB', 'CONFIG_RESET', 'All chaos, latency, X-Ray, and bug-replay flags reset.');
  }, [logEvent]);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  const consumeForcedFailure = useCallback(
    (contextLabel: string): boolean => {
      if (!forceFailureRef.current) return false;
      forceFailureRef.current = false;
      setConfig((prev) => ({ ...prev, forceNextFailure: false }));
      logEvent('CHAOS', 'CHAOS_FAULT_INJECTED', `Forced deterministic failure in ${contextLabel}`);
      return true;
    },
    [logEvent]
  );

  const activeChaosCount = (
    [
      config.authChaos,
      config.cartChaos,
      config.checkoutChaos,
      config.networkLatency,
      config.forceNextFailure,
      config.simulateLogoutBug,
      config.xrayMode,
    ] as boolean[]
  ).filter(Boolean).length;

  return (
    <QALabContext.Provider
      value={{
        config,
        isDrawerOpen,
        setDrawerOpen,
        toggleConfig,
        setConfigFlag,
        resetConfig,
        events,
        logEvent,
        clearEvents,
        consumeForcedFailure,
        activeChaosCount,
      }}
    >
      {children}
    </QALabContext.Provider>
  );
};

export const useQALab = (): QALabContextType => {
  const context = useContext(QALabContext);
  if (context === undefined) {
    throw new Error('useQALab must be used within a QALabProvider');
  }
  return context;
};
