export function getConversationGroup(
  date: Date,
) {
  const today = new Date();

  const diff =
    today.getTime() -
    new Date(date).getTime();

  const days = Math.floor(
    diff / (1000 * 60 * 60 * 24),
  );

  if (days === 0) return 'Today';

  if (days === 1) return 'Yesterday';

  if (days <= 7) return 'Last 7 Days';

  if (days <= 30) return 'Last Month';

  return 'Older';
}