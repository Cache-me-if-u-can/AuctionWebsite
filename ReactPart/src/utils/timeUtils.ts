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
