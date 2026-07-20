import { api } from './api';
import type { User } from './dashboard.types';

export async function getUsers(): Promise<User[]> {
  const response = await api.get<User[]>('/users');

  return response.data;
}
