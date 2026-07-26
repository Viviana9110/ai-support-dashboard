"use client";

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export function ChartTooltip({
  active,
  payload,
  label,
}: ChartTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0];

  return (
    <div className="rounded-xl border bg-white p-4 shadow-lg">
      {label && (
        <p className="mb-2 text-sm font-semibold text-gray-900">
          {label}
        </p>
      )}

      <div className="flex items-center gap-2">
        <div
          className="h-3 w-3 rounded-full"
          style={{
            backgroundColor: item.color,
          }}
        />

        <span className="text-sm text-gray-700">
  {item.value} Tickets
</span>
      </div>
    </div>
  );
}