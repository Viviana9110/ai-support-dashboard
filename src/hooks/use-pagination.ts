'use client';

import { useMemo, useState } from 'react';

export function usePagination<T>(items: T[], pageSize = 10) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(items.length / pageSize);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * pageSize;

    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  function nextPage() {
    setPage((prev) => Math.min(prev + 1, totalPages));
  }

  function previousPage() {
    setPage((prev) => Math.max(prev - 1, 1));
  }

  return {
    page,
    totalPages,
    paginatedItems,
    nextPage,
    previousPage,
    setPage,
  };
}
