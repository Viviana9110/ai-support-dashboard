import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? '/api',
  timeout: 10000,
});

export function getApiErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (axios.isAxiosError<{ error?: string }>(error)) {
    return error.response?.data?.error ?? fallback;
  }

  return error instanceof Error ? error.message : fallback;
}
