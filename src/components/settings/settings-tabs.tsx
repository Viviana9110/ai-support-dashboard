"use client";

import { User, Palette, Bell, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";

import { SettingsTab } from "./settings-client";

interface Props {
  value: SettingsTab;
  onChange: (tab: SettingsTab) => void;
}

const tabs = [
  {
    id: "profile",
    label: "Profile",
    icon: User,
  },
  {
    id: "appearance",
    label: "Appearance",
    icon: Palette,
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    id: "security",
    label: "Security",
    icon: Shield,
  },
] satisfies {
  id: SettingsTab;
  label: string;
  icon: any;
}[];

export function SettingsTabs({
  value,
  onChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-3">

      {tabs.map((tab) => {
        const Icon = tab.icon;

        return (
          <Button
            key={tab.id}
            variant={
              value === tab.id
                ? "default"
                : "outline"
            }
            onClick={() =>
              onChange(tab.id)
            }
          >
            <Icon size={16} />

            {tab.label}
          </Button>
        );
      })}

    </div>
  );
}