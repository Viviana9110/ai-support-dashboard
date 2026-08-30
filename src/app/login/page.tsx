'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { login } from '@/services/auth.service';

import { AuthLayout } from '@/components/auth/auth-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function getSafeRedirect(value: string | null): string {
  if (!value) return '/dashboard';

  const isRelativePath =
    value.startsWith('/') &&
    !value.startsWith('//') &&
    !value.startsWith('/\\');

  return isRelativePath ? value : '/dashboard';
}

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const user = await login(email, password);

      queryClient.setQueryData(['session'], user);

      await queryClient.invalidateQueries({ queryKey: ['session'] });

      const params = new URLSearchParams(window.location.search);
      const next = getSafeRedirect(params.get('next'));

      router.push(next);
      router.refresh();
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error ?? 'Unable to sign in. Please try again.'
        : 'Unable to sign in. Please try again.';

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to access your support dashboard."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>

          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>

          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {error && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <a href="/register" className="font-medium text-primary hover:underline">
            Register
          </a>
        </p>
      </form>
    </AuthLayout>
  );
}
