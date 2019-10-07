export const secondsToTime = (secs) => {
  const secsRound = Math.round(secs);
  const divisorForMinutes = secsRound % (60 * 60);
  const minutes = Math.floor(divisorForMinutes / 60);
  const divisorForSeconds = divisorForMinutes % 60;
  const seconds = Math.ceil(divisorForSeconds);
  const minStr = minutes > 0 ? `${minutes} мин.` : '';
  const secStr = seconds > 0 ? `${seconds} сек.` : '';
  return `${minStr} ${secStr}`;
};

