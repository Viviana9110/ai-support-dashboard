'use client';

interface Props {
  password: string;
}

export function PasswordStrength({ password }: Props) {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const percentage = score * 20;

  const label =
    score <= 2
      ? 'Weak'
      : score === 3
      ? 'Medium'
      : score === 4
      ? 'Strong'
      : 'Very Strong';

  return (
    <div className="space-y-3">
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="bg-primary h-full rounded-full transition-all"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <span>Password Strength</span>

        <span className="font-medium">
          {label}
        </span>
      </div>
    </div>
  );
}