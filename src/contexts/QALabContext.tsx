import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from 'react';

export type LatencyPreset = 0 | 600 | 2000;
export type QAMissionId = 'bug-001' | 'checkout-chaos' | 'stock-guard' | null;

export interface QALabConfig {
  authChaos: boolean;
  cartChaos: boolean;
  checkoutChaos: boolean;
  latencyMs: LatencyPreset;
  forceNextFailure: boolean;
  simulateLogoutBug: boolean;
  xrayMode: boolean;
}

export type QALabBooleanKey = Exclude<keyof QALabConfig, 'latencyMs'>;
export type QAEventCategory = 'AUTH' | 'CART' | 'CHECKOUT' | 'CHAOS' | 'SESSION' | 'LAB' | 'MISSION';

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
  toggleConfig: (key: QALabBooleanKey) => void;
  setConfigFlag: (key: QALabBooleanKey, value: boolean) => void;
  setLatencyMs: (ms: LatencyPreset) => void;
  activeMission: QAMissionId;
  setActiveMission: (mission: QAMissionId) => void;
  resetConfig: () => void;
  events: QAEvent[];
  logEvent: (category: QAEventCategory, action: string, detail: string) => void;
  clearEvents: () => void;
  consumeForcedFailure: (contextLabel: string) => boolean;
  buildDiagnosticSnapshot: (extra?: Record<string, unknown>) => Record<string, unknown>;
  activeChaosCount: number;
}

const QA_LAB_STORAGE_KEY = 'techstore_qa_lab_config';
const QA_MISSION_STORAGE_KEY = 'techstore_qa_mission';
const MAX_EVENTS = 30;

const getEnvDefaultConfig = (): QALabConfig => ({
  authChaos: import.meta.env.VITE_ENABLE_AUTH_CHAOS === 'true',
  cartChaos: import.meta.env.VITE_ENABLE_CART_CHAOS === 'true',
  checkoutChaos: import.meta.env.VITE_ENABLE_CHECKOUT_CHAOS === 'true',
  latencyMs: 0,
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
    const validLatency: LatencyPreset =
      parsed.latencyMs === 600 || parsed.latencyMs === 2000 ? parsed.latencyMs : 0;
    return {
      ...defaults,
      ...parsed,
      latencyMs: validLatency,
    };
  } catch {
    return defaults;
  }
};

const loadInitialMission = (): QAMissionId => {
  try {
    const raw = sessionStorage.getItem(QA_MISSION_STORAGE_KEY);
    if (raw === 'bug-001' || raw === 'checkout-chaos' || raw === 'stock-guard') {
      return raw;
    }
    return null;
  } catch {
    return null;
  }
};

const QALabContext = createContext<QALabContextType | undefined>(undefined);

/**
 * Provides runtime QA controls (chaos toggles, latency presets, guided QA missions,
 * Playwright X-Ray locator inspection, historical bug replay, and live telemetry)
 * while remaining deterministic by default for CI.
 */
export const QALabProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<QALabConfig>(loadInitialConfig);
  const [activeMission, setActiveMissionState] = useState<QAMissionId>(loadInitialMission);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [events, setEvents] = useState<QAEvent[]>(() => [
    {
      id: 'evt-boot',
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      category: 'LAB',
      action: 'SUT_INITIALIZED',
      detail: 'Deterministic mode ready. Open QA Lab to run missions, inject faults, or inspect locators.',
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
    try {
      if (activeMission) {
        sessionStorage.setItem(QA_MISSION_STORAGE_KEY, activeMission);
      } else {
        sessionStorage.removeItem(QA_MISSION_STORAGE_KEY);
      }
    } catch {
      // Ignore storage write errors
    }
  }, [activeMission]);

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
    (key: QALabBooleanKey, value: boolean) => {
      if (key === 'forceNextFailure') {
        forceFailureRef.current = value;
      }
      setConfig((prev) => ({ ...prev, [key]: value }));
      logEvent('LAB', value ? 'FLAG_ENABLED' : 'FLAG_DISABLED', `${key} -> ${String(value)}`);
    },
    [logEvent]
  );

  const toggleConfig = useCallback(
    (key: QALabBooleanKey) => {
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

  const setLatencyMs = useCallback(
    (ms: LatencyPreset) => {
      setConfig((prev) => ({ ...prev, latencyMs: ms }));
      logEvent('LAB', 'LATENCY_SET', `Simulated network latency set to ${ms}ms`);
    },
    [logEvent]
  );

  const setActiveMission = useCallback(
    (mission: QAMissionId) => {
      setActiveMissionState(mission);
      if (mission) {
        logEvent('MISSION', 'MISSION_STARTED', `Activated guided QA mission: ${mission}`);
      } else {
        logEvent('MISSION', 'MISSION_EXITED', 'Closed active guided QA mission');
      }
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

  const buildDiagnosticSnapshot = useCallback(
    (extra: Record<string, unknown> = {}): Record<string, unknown> => ({
      generatedAt: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      config,
      activeMission,
      events,
      ...extra,
    }),
    [config, activeMission, events]
  );

  const activeChaosCount =
    (
      [
        config.authChaos,
        config.cartChaos,
        config.checkoutChaos,
        config.forceNextFailure,
        config.simulateLogoutBug,
        config.xrayMode,
      ] as boolean[]
    ).filter(Boolean).length + (config.latencyMs > 0 ? 1 : 0);

  return (
    <QALabContext.Provider
      value={{
        config,
        isDrawerOpen,
        setDrawerOpen,
        toggleConfig,
        setConfigFlag,
        setLatencyMs,
        activeMission,
        setActiveMission,
        resetConfig,
        events,
        logEvent,
        clearEvents,
        consumeForcedFailure,
        buildDiagnosticSnapshot,
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
