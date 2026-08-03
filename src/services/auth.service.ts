import { api } from './api';
import type { SessionUser } from './auth.types';

export async function login(
  email: string,
  password: string,
): Promise<SessionUser> {
  const { data } = await api.post<SessionUser>('/auth/login', {
    email,
    password,
  });

  return data;
}

export async function register(
  name: string,
  email: string,
  password: string,
): Promise<SessionUser> {
  const { data } = await api.post<SessionUser>('/auth/register', {
    name,
    email,
    password,
  });

  return data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

export async function getSession(): Promise<SessionUser | null> {
  const { data } = await api.get<SessionUser | null>('/auth/session');

  return data;
}
