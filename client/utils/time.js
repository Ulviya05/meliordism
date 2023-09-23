import { formatDistanceToNow } from "date-fns";

export function getRelativeTime(date) {
    const now = new Date();
    if (isNaN(date) || isNaN(now)) {
      return 'Invalid date';
    }
    const relativeTime = formatDistanceToNow(date, { addSuffix: true });

    if (relativeTime.startsWith('about')) {
      return relativeTime.slice(6);
    }

    return relativeTime;
  }