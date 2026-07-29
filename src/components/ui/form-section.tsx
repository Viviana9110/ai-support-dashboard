import { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function FormSection({
  title,
  description,
  children,
}: FormSectionProps) {
  return (
    <section className="space-y-6 border-b border-border pb-8 last:border-none last:pb-0">
      <div>
        <h3 className="text-lg font-semibold text-card-foreground">
          {title}
        </h3>

        {description && (
          <p className="mt-1 text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {children}
    </section>
  );
}