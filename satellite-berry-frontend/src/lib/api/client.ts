import axios from 'axios';

const DEFAULT_TIMEOUT_MS = 30_000;

function resolveApiBaseUrl(): string {
  if (import.meta.env.DEV) {
    // Use Vite's dev proxy to avoid browser cross-origin issues during local development.
    return '/api';
  }

  return import.meta.env.VITE_API_BASE_URL;
}

function parseTimeout(value: string | undefined): number {
  if (!value) {
    return DEFAULT_TIMEOUT_MS;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TIMEOUT_MS;
}

export const apiClient = axios.create({
  baseURL: resolveApiBaseUrl(),
  timeout: parseTimeout(import.meta.env.VITE_API_TIMEOUT_MS),
});
