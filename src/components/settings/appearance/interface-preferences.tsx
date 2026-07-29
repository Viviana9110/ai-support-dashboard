'use client';

import { Controller, Control } from 'react-hook-form';

import { AppearanceFormData } from '@/lib/schemas/appearance.schema';
import { SettingsSwitch } from '@/components/ui/settings-switch';

interface Props {
  control: Control<AppearanceFormData>;
}

export function InterfacePreferences({
  control,
}: Props) {
  return (
    <div className="space-y-4">

      <h3 className="text-base font-semibold">
        Interface Preferences
      </h3>

      <div className="space-y-4">

        <Controller
          control={control}
          name="compactMode"
          render={({ field }) => (
            <SettingsSwitch
              title="Compact Mode"
              description="Reduce spacing across the application."
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="sidebarCollapsed"
          render={({ field }) => (
            <SettingsSwitch
              title="Collapsed Sidebar"
              description="Open the application with the sidebar collapsed."
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="animations"
          render={({ field }) => (
            <SettingsSwitch
              title="Animations"
              description="Enable interface animations."
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />

      </div>
    </div>
  );
}