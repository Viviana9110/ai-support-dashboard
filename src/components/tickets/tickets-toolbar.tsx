'use client';

interface TicketsToolbarProps {
  search: string;
  status: string;
  priority: string;

  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
}

export function TicketsToolbar({
  search,
  status,
  priority,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
}: TicketsToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex gap-3">
        <input
          className="w-80 rounded-lg border px-4 py-2 outline-none focus:ring-2"
          placeholder="Search tickets..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="rounded-lg border px-3 py-2"
        >
          <option value="all">All Status</option>
          <option value="Open">Open</option>
          <option value="Pending">Pending</option>
          <option value="Closed">Closed</option>
        </select>

        <select
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="rounded-lg border px-3 py-2"
        >
          <option value="all">All Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <button className="rounded-lg bg-black px-4 py-2 text-white">
        New Ticket
      </button>
    </div>
  );
}
