'use client';

import { useEffect, useState } from 'react';

export function useCommandCenter() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isMac = navigator.platform
        .toUpperCase()
        .includes('MAC');

      const shortcut =
        (isMac ? event.metaKey : event.ctrlKey) &&
        event.key.toLowerCase() === 'k';

      if (!shortcut) return;

      event.preventDefault();

      setOpen((previous) => !previous);
    }

    window.addEventListener(
      'keydown',
      handleKeyDown,
    );

    return () =>
      window.removeEventListener(
        'keydown',
        handleKeyDown,
      );
  }, []);

  return {
    open,
    setOpen,
  };
}