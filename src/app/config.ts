/**
 * App Configuration
 * Dynamically resolves the API base URL and WebSocket URL.
 */

const getApiBaseUrl = (): string => {
  // Check if a specific URL is provided via environment variables (bundler-time config)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Fallback to window host info if running in a browser environment
  if (typeof window !== "undefined") {
    // If running on a local Vite development server, point to local FastAPI by default
    if (window.location.port === "5173" || window.location.port === "3000") {
      return "http://localhost:8000";
    }
    return window.location.origin;
  }

  return "http://localhost:8000";
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * Dynamically construct WebSocket URL from the base API URL.
 */
const getWsUrl = (apiBase: string): string => {
  try {
    const url = new URL(apiBase);
    const protocol = url.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${url.host}`;
  } catch {
    if (typeof window !== "undefined") {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      return `${protocol}//${window.location.host}`;
    }
    return "ws://localhost:8000";
  }
};

export const WS_BASE_URL = getWsUrl(API_BASE_URL);
