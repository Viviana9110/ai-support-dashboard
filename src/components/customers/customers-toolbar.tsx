'use client';

interface CustomersToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function CustomersToolbar({
  search,
  onSearchChange,
}: CustomersToolbarProps) {
  return (
    <div className="flex items-center justify-between">
      <input
        className="w-80 rounded-lg border px-4 py-2 outline-none focus:ring-2"
        placeholder="Search customers..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <button
        className="rounded-lg bg-black px-4 py-2 text-white transition hover:bg-neutral-800"
      >
        + New Customer
      </button>
    </div>
  );
}
