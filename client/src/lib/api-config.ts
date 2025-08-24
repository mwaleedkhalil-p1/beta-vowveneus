// API configuration for different environments

const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// Base API URL configuration
export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:5000' // Development server
  : ''; // Production uses relative URLs (same domain)

// API endpoints configuration
export const API_ENDPOINTS = {
  // Authentication endpoints
  LOGIN: '/api/login',
  REGISTER: '/api/register',
  LOGOUT: '/api/logout',
  USER: '/api/user',
  
  // Venue endpoints
  VENUES: '/api/venues',
  VENUE_BY_ID: (id: string) => `/api/venues/${id}`,
} as const;

// Helper function to get full API URL
export function getApiUrl(endpoint: string): string {
  if (isDevelopment) {
    return `${API_BASE_URL}${endpoint}`;
  }
  return endpoint; // In production, use relative URLs
}

// Environment detection helpers
export const ENV = {
  isDevelopment,
  isProduction,
  NODE_ENV: import.meta.env.MODE,
} as const;

// API request configuration
export const API_CONFIG = {
  timeout: 10000, // 10 seconds
  retries: 3,
  headers: {
    'Content-Type': 'application/json',
  },
} as const;