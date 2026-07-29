'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormSection } from '@/components/ui/form-section';

import { profileSchema, ProfileFormData } from '@/lib/schemas/profile.schema';

import { defaultProfile } from '@/constants/profile';

import { AvatarUpload } from './avatar-upload';
import { FormField } from '../ui/form-field';

import { Textarea } from '@/components/ui/textarea';

export function ProfileSettings() {
  const [avatar, setAvatar] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: defaultProfile,
  });

  function onSubmit(data: ProfileFormData) {
    console.log({
      ...data,
      avatar,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>

      <CardContent>
        <AvatarUpload
          name={`${defaultProfile.firstName} ${defaultProfile.lastName}`}
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

          <FormSection
            title="Work Information"
            description="Information related to your current position."
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <FormField
                  label="Company"
                  required
                  error={errors.company?.message}
                >
                  <Input {...register('company')} />
                </FormField>
              </div>

              <div>
                <FormField label="Role" required error={errors.role?.message}>
                  <Input {...register('role')} />
                </FormField>
              </div>
            </div>

            <div>
              <FormField label="Phone" required error={errors.phone?.message}>
                <Input {...register('phone')} />
              </FormField>
            </div>
          </FormSection>

          <FormSection
            title="About"
            description="Tell us a little more about yourself."
          >
            <div>
              <FormField label="Bio" error={errors.bio?.message}>
                <Textarea rows={5} {...register('bio')} />
              </FormField>
            </div>
          </FormSection>

          <div className="flex justify-end">
            <Button type="submit" size="lg">
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
