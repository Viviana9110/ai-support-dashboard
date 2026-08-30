'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormSection } from '@/components/ui/form-section';

import {
  updateProfileSchema,
  UpdateProfileFormData,
} from '@/lib/schemas/profile.schema';

import { useSession } from '@/hooks/use-session';
import { useToast } from '@/hooks/use-toast';

import { updateProfile } from '@/services/auth.service';

import { AvatarUpload } from './avatar-upload';
import { FormField } from '../ui/form-field';

function splitName(name: string): {
  firstName: string;
  lastName: string;
} {
  const parts = name.trim().split(/\s+/);

  return {
    firstName: parts[0] ?? '',
    lastName: parts.slice(1).join(' ') ?? '',
  };
}

export function ProfileSettings() {
  const toast = useToast();

  const { data: session, isLoading } = useSession();

  const [avatar, setAvatar] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
  });

  useEffect(() => {
    if (!session) return;

    const { firstName, lastName } = splitName(session.name);

    reset({
      firstName,
      lastName,
      email: session.email,
    });
  }, [session, reset]);

  async function onSubmit(data: UpdateProfileFormData) {
    setIsSaving(true);

    try {
      await updateProfile(data);

      toast.success(
        'Profile updated',
        'Your profile has been saved.',
      );

      const { firstName, lastName } = splitName(
        `${data.firstName} ${data.lastName}`,
      );

      reset({
        firstName,
        lastName,
        email: data.email,
      });
    } catch {
      toast.error(
        'Failed to update profile',
        'Something went wrong while saving your profile.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>

      <CardContent>
        <AvatarUpload
          name={`${splitName(session?.name ?? '').firstName} ${
            splitName(session?.name ?? '').lastName
          }`}
          image={avatar}
          onChange={setAvatar}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-8">
          <FormSection
            title="Personal Information"
            description="Update your personal information."
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <FormField
                  label="First Name"
                  required
                  error={errors.firstName?.message}
                >
                  <Input {...register('firstName')} />
                </FormField>
              </div>

              <div>
                <FormField
                  label="Last Name"
                  required
                  error={errors.lastName?.message}
                >
                  <Input {...register('lastName')} />
                </FormField>
              </div>
            </div>

            <div>
              <FormField label="Email" required error={errors.email?.message}>
                <Input type="email" {...register('email')} />
              </FormField>
            </div>
          </FormSection>

          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              disabled={!isDirty || isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
