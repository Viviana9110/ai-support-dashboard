'use client';

export function TypingIndicator() {
  return (
    <div className="flex justify-start py-2">
      <div className="bg-muted rounded-2xl px-4 py-3">
        <div className="flex gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500"></span>

          <span
            className="h-2 w-2 animate-bounce rounded-full bg-gray-500"
            style={{ animationDelay: '150ms' }}
          ></span>

          <span
            className="h-2 w-2 animate-bounce rounded-full bg-gray-500"
            style={{ animationDelay: '300ms' }}
          ></span>
        </div>
      </div>
    </div>
  );
}
