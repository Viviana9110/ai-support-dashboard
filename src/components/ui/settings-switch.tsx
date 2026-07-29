'use client';

import { Switch } from '@base-ui/react/switch';

interface SettingsSwitchProps {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function SettingsSwitch({
  title,
  description,
  checked,
  onCheckedChange,
}: SettingsSwitchProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-muted/40">
      <div className="pr-8">
        <h3 className="font-medium">
          {title}
        </h3>

        <p className="text-muted-foreground mt-1 text-sm">
          {description}
        </p>
      </div>

      <Switch.Root
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="
          relative
          h-7
          w-12
          rounded-full
          bg-muted
          transition-colors
          data-[checked]:bg-primary
        "
      >
        <Switch.Thumb
          className="
            block
            h-5
            w-5
            translate-x-1
            rounded-full
            bg-white
            shadow
            transition-transform
            data-[checked]:translate-x-6
          "
        />
      </Switch.Root>
    </div>
  );
}