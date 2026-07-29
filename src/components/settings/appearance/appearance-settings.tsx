'use client';

import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from 'next-themes';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { FormSection } from '@/components/ui/form-section';

import {
  appearanceSchema,
  AppearanceFormData,
} from '@/lib/schemas/appearance.schema';

import { defaultAppearance } from '@/constants/appearance';

import { ThemeSelector } from './theme-selector';
import { AccentSelector } from './accent-selector';
import { InterfacePreferences } from './interface-preferences';
import { AppearancePreview } from './appearance-preview';

import { useToast } from '@/hooks/use-toast';

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  const toast = useToast();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty, isSubmitting },
  } = useForm<AppearanceFormData>({
    resolver: zodResolver(appearanceSchema),
    defaultValues: defaultAppearance,
  });

  useEffect(() => {
    if (!theme) return;

    reset({
      ...defaultAppearance,
      theme: theme as AppearanceFormData['theme'],
    });
  }, [theme, reset]);

  function onSubmit(data: AppearanceFormData) {
    // Cambiar tema
    setTheme(data.theme);

    // Aquí más adelante aplicaremos:
    // - accent color
    // - compact mode
    // - sidebar collapsed
    // - animations

    toast.success(
      'Appearance updated',
      'Your appearance settings have been saved.',
    );

    reset(data);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          {/* Theme */}

          <FormSection
            title="Theme"
            description="Choose how the application should look."
          >
            <Controller
              control={control}
              name="theme"
              render={({ field }) => (
                <ThemeSelector value={field.value} onChange={field.onChange} />
              )}
            />
          </FormSection>

          {/* Accent */}

          <FormSection
            title="Accent Color"
            description="Choose your favorite accent color."
          >
            <Controller
              control={control}
              name="accent"
              render={({ field }) => (
                <AccentSelector value={field.value} onChange={field.onChange} />
              )}
            />
          </FormSection>

          {/* Interface */}

          <FormSection
            title="Interface"
            description="Customize how the application behaves."
          >
            <InterfacePreferences control={control} />
          </FormSection>

          <FormSection
            title="Preview"
            description="See your changes before saving."
          >
            <AppearancePreview
              theme={watch('theme')}
              accent={watch('accent')}
              compactMode={watch('compactMode')}
            />
          </FormSection>

          <div className="flex justify-end">
            <Button type="submit" disabled={!isDirty || isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
