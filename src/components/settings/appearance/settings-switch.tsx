'use client';

import { Switch } from '@/components/ui/switch';

interface SettingsSwitchProps {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function SettingsSwitch({
  label,
  description,
  checked,
  onCheckedChange,
}: SettingsSwitchProps) {
  return (
    <div className="flex items-start justify-between rounded-xl border border-border bg-card p-5">
      <div className="max-w-lg">
        <h4 className="font-medium">
          {label}
        </h4>

        {description && (
          <p className="text-muted-foreground mt-1 text-sm">
            {description}
          </p>
        )}
      </div>

      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
}