/**
 * Debug utility for runtime logging
 * 
 * Enable debugging:
 * - URL param: ?debug (enables for session)
 * - Console: staysecureDebug.enable()
 * - Env var: VITE_DEBUG=true (for local dev)
 * 
 * Disable debugging:
 * - Console: staysecureDebug.disable()
 * - Close browser tab (sessionStorage clears)
 */

const DEBUG_KEY = '__STAYSECURE_DEBUG__';

function checkDebugEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  
  // URL param wins - enables for this session
  const params = new URLSearchParams(window.location.search);
  if (params.has('debug')) {
    sessionStorage.setItem(DEBUG_KEY, '1');
    // Clean URL without reload
    const url = new URL(window.location.href);
    url.searchParams.delete('debug');
    window.history.replaceState({}, '', url.toString());
    return true;
  }
  
  // Check sessionStorage
  if (sessionStorage.getItem(DEBUG_KEY) === '1') {
    return true;
  }
  
  // Check env var (Vite)
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_DEBUG === 'true') {
    return true;
  }
  
  return false;
}

const IS_DEBUG = checkDebugEnabled();

// Expose globally and show banner if enabled
if (IS_DEBUG && typeof window !== 'undefined') {
  (window as any).__DEBUG__ = true;
  console.info('%c🔧 Debug session enabled', 'color: orange; font-weight: bold');
  console.info('%cTo disable: staysecureDebug.disable()', 'color: gray; font-size: 11px');
}

export const debug = {
  /** Whether debug mode is currently enabled */
  enabled: IS_DEBUG,
  
  /** Log debug message (only when debug enabled) */
  log: (...args: unknown[]) => {
    if (IS_DEBUG) console.debug('[DEBUG]', ...args);
  },
  
  /** Log warning (only when debug enabled) */
  warn: (...args: unknown[]) => {
    if (IS_DEBUG) console.warn('[DEBUG]', ...args);
  },
  
  /** Log error (ALWAYS logs - errors are important) */
  error: (...args: unknown[]) => {
    console.error('[ERROR]', ...args);
  },
  
  /** Log state change (only when debug enabled) */
  state: (label: string, value: unknown) => {
    if (IS_DEBUG) console.debug(`[STATE] ${label}`, value);
  },
  
  /** Log API/fetch activity (only when debug enabled) */
  fetch: (url: string, status?: number) => {
    if (IS_DEBUG) console.debug('[FETCH]', url, status ? `→ ${status}` : '');
  },

  /** Enable debug mode and reload */
  enable: () => {
    sessionStorage.setItem(DEBUG_KEY, '1');
    location.reload();
  },
  
  /** Disable debug mode and reload */
  disable: () => {
    sessionStorage.removeItem(DEBUG_KEY);
    location.reload();
  },
};

// Expose to window for easy console access
if (typeof window !== 'undefined') {
  (window as any).staysecureDebug = debug;
}

export default debug;
