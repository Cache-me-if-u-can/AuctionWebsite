export const getTimeRemaining = (endDate: string) => {
  const total = Date.parse(endDate) - Date.now();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
  };
};

export const formatTimeRemaining = (time: { days: number; hours: number; minutes: number; seconds: number }) => {
  if (time.days > 0) {
    return `${time.days} days`;
  } else if (time.hours > 0) {
    return `${time.hours} hours`;
  } else if (time.minutes > 0) {
    return `${time.minutes} minutes`;
  } else {
    return `${time.seconds} seconds`;
  }
};
// Format a date string to a readable format
export const formatDateString = (dateString: string) => {
  try {
    const date = new Date(dateString);

    // Format: "March 28, 2025 at 11:02 AM"
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};
