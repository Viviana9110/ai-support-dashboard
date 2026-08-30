'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormSection } from '@/components/ui/form-section';

import {
  SecurityFormData,
  securitySchema,
} from '@/lib/schemas/security.schema';

import { defaultSecurity } from '@/constants/security';

import { PasswordStrength } from './password-strength';

import { useToast } from '@/hooks/use-toast';
import { getApiErrorMessage } from '@/services/api';
import { updatePassword } from '@/services/auth.service';

export function PasswordSettings() {
  const toast = useToast();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: {
      isSubmitting,
      isDirty,
      errors,
    },
  } = useForm<SecurityFormData>({
    resolver: zodResolver(securitySchema),
    defaultValues: defaultSecurity,
  });

  async function onSubmit(data: SecurityFormData) {
    try {
      await updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      toast.success(
        'Password updated',
        'Your password has been changed successfully.',
      );

      reset(defaultSecurity);
    } catch (error) {
      toast.error(
        'Failed to update password',
        getApiErrorMessage(
          error,
          'Something went wrong while updating your password.',
        ),
      );
    }
  }

  const password = watch('newPassword');

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8"
    >
      <FormSection
        title="Password"
        description="Update your account password."
      >
        <div className="space-y-5">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Current Password
            </label>

            <Input
              type="password"
              {...register('currentPassword')}
            />

            {errors.currentPassword && (
              <p className="mt-2 text-sm text-destructive">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              New Password
            </label>

            <Input
              type="password"
              {...register('newPassword')}
            />

            {errors.newPassword && (
              <p className="mt-2 text-sm text-destructive">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <PasswordStrength password={password} />

          <div>
            <label className="mb-2 block text-sm font-medium">
              Confirm Password
            </label>

            <Input
              type="password"
              {...register('confirmPassword')}
            />

            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

        </div>
      </FormSection>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!isDirty || isSubmitting}
        >
          {isSubmitting
            ? 'Updating...'
            : 'Update Password'}
        </Button>
      </div>
    </form>
  );
}