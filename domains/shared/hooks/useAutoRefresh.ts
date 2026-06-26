'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type AutoRefreshReason = 'interval' | 'focus' | 'manual';

export interface AutoRefreshContext {
  background: true;
  reason: AutoRefreshReason;
}

interface UseAutoRefreshOptions {
  enabled: boolean;
  intervalMs?: number | null;
  onRefresh: (context: AutoRefreshContext) => Promise<void> | void;
  onError?: (error: unknown, context: AutoRefreshContext) => void;
  refreshOnFocus?: boolean;
  pauseWhenHidden?: boolean;
}

const isPageHidden = () => typeof document !== 'undefined' && document.visibilityState === 'hidden';

export function useAutoRefresh({
  enabled,
  intervalMs,
  onRefresh,
  onError,
  refreshOnFocus = true,
  pauseWhenHidden = true,
}: UseAutoRefreshOptions) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const mountedRef = useRef(false);
  const inFlightRef = useRef(false);
  const enabledRef = useRef(enabled);
  const intervalMsRef = useRef(intervalMs);
  const onRefreshRef = useRef(onRefresh);
  const onErrorRef = useRef(onError);
  const pauseWhenHiddenRef = useRef(pauseWhenHidden);

  useEffect(() => {
    enabledRef.current = enabled;
    intervalMsRef.current = intervalMs;
    onRefreshRef.current = onRefresh;
    onErrorRef.current = onError;
    pauseWhenHiddenRef.current = pauseWhenHidden;
  }, [enabled, intervalMs, onRefresh, onError, pauseWhenHidden]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const refreshNow = useCallback(async (reason: AutoRefreshReason = 'manual') => {
    if (!enabledRef.current) return;
    if (pauseWhenHiddenRef.current && isPageHidden()) return;
    if (inFlightRef.current) return;

    const context: AutoRefreshContext = { background: true, reason };
    inFlightRef.current = true;
    if (mountedRef.current) setIsRefreshing(true);

    try {
      await onRefreshRef.current(context);
    } catch (error) {
      onErrorRef.current?.(error, context);
    } finally {
      inFlightRef.current = false;
      if (mountedRef.current) setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled || !intervalMs || intervalMs <= 0) return;

    const intervalId = window.setInterval(() => {
      void refreshNow('interval');
    }, intervalMs);

    return () => window.clearInterval(intervalId);
  }, [enabled, intervalMs, refreshNow]);

  useEffect(() => {
    if (!enabled || !refreshOnFocus) return;

    const handleFocus = () => {
      void refreshNow('focus');
    };

    const handleVisibilityChange = () => {
      if (!isPageHidden()) {
        void refreshNow('focus');
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, refreshOnFocus, refreshNow]);

  return { isRefreshing, refreshNow };
}
