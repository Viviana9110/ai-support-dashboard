import { Button } from '@/components/ui/button';

interface PaginationProps {
  page: number;
  totalPages: number;
  nextPage: () => void;
  previousPage: () => void;
}

export function Pagination({
  page,
  totalPages,
  nextPage,
  previousPage,
}: PaginationProps) {
  return (
    <div className="mt-6 flex items-center justify-between">
      <Button variant="outline" onClick={previousPage} disabled={page === 1}>
        Previous
      </Button>

      <span className="text-muted-foreground text-sm">
        Page {page} of {totalPages}
      </span>

      <Button
        variant="outline"
        onClick={nextPage}
        disabled={page === totalPages}
      >
        Next
      </Button>
    </div>
  );
}
