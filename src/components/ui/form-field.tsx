import { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

export function FormField({
  label,
  error,
  required,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-card-foreground">
        {label}

        {required && (
          <span className="ml-1 text-destructive">*</span>
        )}
      </label>

      {children}

      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}