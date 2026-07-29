"use client";

import { useState } from "react";

import { SettingsTabs } from "./settings-tabs";
import { ProfileSettings } from "./profile-settings";

import { PageHeader } from "@/components/ui/page-header";
import { AppearanceSettings } from "./appearance/appearance-settings";
import { NotificationsSettings } from './notifications/notifications-settings';
import { SecuritySettings } from './security/security-settings';

export type SettingsTab =
  | "profile"
  | "appearance"
  | "notifications"
  | "security";

export function SettingsClient() {
  const [tab, setTab] =
    useState<SettingsTab>("profile");

  return (
    <div className="space-y-8">

      <PageHeader
  title="Settings"
  description="Manage your account preferences."
/>

      <SettingsTabs
        value={tab}
        onChange={setTab}
      />

      {tab === "profile" && (
        <ProfileSettings />
      )}

      {tab === "appearance" && (
        <AppearanceSettings />
      )}

      {tab === "notifications" && (
        <NotificationsSettings />
      )}

      {tab === "security" && (
        <SecuritySettings />
      )}
      

    </div>
  );
}