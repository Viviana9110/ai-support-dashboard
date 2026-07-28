"use client";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function ChartCard({
  title,
  subtitle,
  children,
}: ChartCardProps) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-border
        bg-card
        p-6
        shadow-sm
        transition-colors
        duration-300
      "
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-card-foreground">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>

      {children}
    </div>
  );
}