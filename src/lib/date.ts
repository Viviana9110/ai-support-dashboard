export function formatRelativeDate(
  date: Date | string,
) {
  const value =
    typeof date === 'string'
      ? new Date(date)
      : date;

  const now = new Date();

  const diff =
    now.getTime() - value.getTime();

  const day = 86400000;

  if (diff < day) {
    return 'Today';
  }

  if (diff < day * 2) {
    return 'Yesterday';
  }

  if (diff < day * 7) {
    return 'This Week';
  }

  if (diff < day * 30) {
    return 'This Month';
  }

  return value.toLocaleDateString();
}