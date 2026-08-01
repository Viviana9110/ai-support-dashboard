'use client';

import { Modal } from '@/components/ui/modal';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CommandCenter({
  open,
  onClose,
}: Props) {
  return (
    <Modal
      open={open}
      title="AI Command Center"
      onClose={onClose}
    >
      <p className="text-muted-foreground">
        Start typing a command...
      </p>
    </Modal>
  );
}