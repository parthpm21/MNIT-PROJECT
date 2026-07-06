/**
 * App Configuration
 * Dynamically resolves the API base URL and WebSocket URL.
 */

const getApiBaseUrl = (): string => {
  let url = "";

  // Check if a specific URL is provided via environment variables (bundler-time config)
  if (import.meta.env.VITE_API_URL) {
    url = import.meta.env.VITE_API_URL;
  } else if (typeof window !== "undefined") {
    // Fallback to window host info if running in a browser environment
    // If running on a local Vite development server, point to local FastAPI by default
    if (window.location.port === "5173" || window.location.port === "3000") {
      url = "http://localhost:8000";
    } else {
      url = window.location.origin;
    }
  } else {
    url = "http://localhost:8000";
  }

  // Safely strip any trailing slash to prevent double-slash (//) routing issues
  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }

  return url;
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
