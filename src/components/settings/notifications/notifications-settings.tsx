'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { FormSection } from '@/components/ui/form-section';

import {
  notificationsSchema,
  NotificationsFormData,
} from '@/lib/schemas/notifications.schema';

import { defaultNotifications } from '@/constants/notifications';

import { NotificationGroup } from './notification-group';
import { SettingsSwitch } from '../appearance/settings-switch';
import { DigestSelector } from './digest-selector';

import { useToast } from '@/hooks/use-toast';

export function NotificationsSettings() {
  const toast = useToast();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm<NotificationsFormData>({
    resolver: zodResolver(notificationsSchema),
    defaultValues: defaultNotifications,
  });

  function onSubmit(data: NotificationsFormData) {
    console.log(data);

    toast.success(
      'Notifications updated',
      'Your notification preferences have been saved.',
    );

    reset(data);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-10"
        >
          <FormSection
            title="Email Notifications"
            description="Receive important updates by email."
          >
            <NotificationGroup
              title="Email"
              description="Choose which emails you want to receive."
            >
              <Controller
                control={control}
                name="newTickets"
                render={({ field }) => (
                  <SettingsSwitch
                    label="New Tickets"
                    description="Receive an email when a new ticket is created."
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />

              <Controller
                control={control}
                name="customerReplies"
                render={({ field }) => (
                  <SettingsSwitch
                    label="Customer Replies"
                    description="Notify me when customers reply."
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />

              <Controller
                control={control}
                name="weeklySummary"
                render={({ field }) => (
                  <SettingsSwitch
                    label="Weekly Summary"
                    description="Receive a weekly report."
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />

              <Controller
                control={control}
                name="productUpdates"
                render={({ field }) => (
                  <SettingsSwitch
                    label="Product Updates"
                    description="Receive product announcements."
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </NotificationGroup>
          </FormSection>

          <FormSection
            title="Push Notifications"
            description="Manage push notifications."
          >
            <NotificationGroup
              title="Devices"
              description="Choose where notifications appear."
            >
              <Controller
                control={control}
                name="desktop"
                render={({ field }) => (
                  <SettingsSwitch
                    label="Desktop"
                    description="Enable desktop notifications."
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />

              <Controller
                control={control}
                name="mobile"
                render={({ field }) => (
                  <SettingsSwitch
                    label="Mobile"
                    description="Enable mobile notifications."
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </NotificationGroup>
          </FormSection>

          <FormSection
            title="Activity"
            description="Notifications about your work."
          >
            <NotificationGroup
              title="Activity"
              description="Choose activity notifications."
            >
              <Controller
                control={control}
                name="mentions"
                render={({ field }) => (
                  <SettingsSwitch
                    label="Mentions"
                    description="Notify when someone mentions you."
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />

              <Controller
                control={control}
                name="assignedTickets"
                render={({ field }) => (
                  <SettingsSwitch
                    label="Assigned Tickets"
                    description="Notify when tickets are assigned."
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />

              <Controller
                control={control}
                name="aiSuggestions"
                render={({ field }) => (
                  <SettingsSwitch
                    label="AI Suggestions"
                    description="Receive AI recommendations."
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </NotificationGroup>
          </FormSection>

          <FormSection
            title="Digest"
            description="Choose how often you receive summaries."
          >
            <Controller
              control={control}
              name="digest"
              render={({ field }) => (
                <DigestSelector
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </FormSection>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!isDirty || isSubmitting}
            >
              {isSubmitting
                ? 'Saving...'
                : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}