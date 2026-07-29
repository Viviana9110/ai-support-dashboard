'use client';

import { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

import { Button } from './button';
import { Modal } from './modal';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  icon?: ReactNode;
  loading?: boolean;

  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  icon,
  loading,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      title=""
      onClose={onCancel}
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-5 rounded-full bg-red-100 p-4 dark:bg-red-900/20">
          {icon ?? (
            <AlertTriangle
              size={28}
              className="text-red-600"
            />
          )}
        </div>

        <h2 className="text-xl font-semibold">
          {title}
        </h2>

        <p className="text-muted-foreground mt-3">
          {description}
        </p>

        <div className="mt-8 flex w-full justify-end gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
          >
            {cancelText}
          </Button>

          <Button
            variant={
              variant === 'destructive'
                ? 'destructive'
                : 'default'
            }
            onClick={onConfirm}
            disabled={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}