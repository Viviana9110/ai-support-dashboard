'use client';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

export function ChatInput({ value, onChange, onSend }: ChatInputProps) {
  return (
    <div className="bg-background border-t p-4">
      <div className="flex gap-3">
        <input
          className="flex-1 rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSend();
            }
          }}
        />

        <button
          onClick={onSend}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
