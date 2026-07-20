export function getStatusVariant(status: string) {
  switch (status) {
    case 'Open':
      return 'success';

    case 'Pending':
      return 'warning';

    case 'Closed':
      return 'danger';

    default:
      return 'success';
  }
}

export function getPriorityVariant(priority: string) {
  switch (priority) {
    case 'High':
      return 'danger';

    case 'Medium':
      return 'warning';

    case 'Low':
      return 'success';

    default:
      return 'success';
  }
}
