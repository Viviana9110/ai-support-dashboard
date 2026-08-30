import { api } from './api';
import type { SessionUser } from './auth.types';
import type { UpdateProfileFormData } from '@/lib/schemas/profile.schema';
import type { SecurityFormData } from '@/lib/schemas/security.schema';

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

export async function updateProfile(
  payload: UpdateProfileFormData,
): Promise<SessionUser> {
  const { data } = await api.patch<SessionUser>('/auth/profile', payload);

  return data;
}

export async function updatePassword(
  payload: Pick<
    SecurityFormData,
    'currentPassword' | 'newPassword'
  >,
): Promise<void> {
  await api.patch('/auth/password', payload);
}
