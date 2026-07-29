import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        rounded-2xl
        border
        border-dashed
        border-border
        bg-card
        px-8
        py-16
        text-center
      "
    >
      <div className="bg-muted mb-6 flex h-16 w-16 items-center justify-center rounded-full">
        <Icon
          size={30}
          className="text-muted-foreground"
        />
      </div>

      <h2 className="text-xl font-semibold text-card-foreground">
        {title}
      </h2>

      <p className="text-muted-foreground mt-2 max-w-md">
        {description}
      </p>

      {action && (
        <div className="mt-8">
          {action}
        </div>
      )}
    </div>
  );
}