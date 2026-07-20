'use client';

import { useMemo, useState } from 'react';

export type SortDirection = 'asc' | 'desc';

export function useSort<T>(items: T[]) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [direction, setDirection] = useState<SortDirection>('asc');

  const sortedItems = useMemo(() => {
    if (!sortKey) return items;

    return [...items].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1;
      }

      if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1;
      }

      return 0;
    });
  }, [items, sortKey, direction]);

  function sortBy(key: keyof T) {
    if (sortKey === key) {
      setDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortKey(key);
    setDirection('asc');
  }

  return {
    sortedItems,
    sortKey,
    direction,
    sortBy,
  };
}
