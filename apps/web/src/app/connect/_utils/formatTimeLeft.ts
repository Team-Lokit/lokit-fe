/** 만료 시각까지 남은 시간을 `HH:MM:SS`로 반환한다. 이미 지났으면 '만료됨' */
export const formatTimeLeft = (expiresAt: string, now: number = Date.now()) => {
  const timeLeft = new Date(expiresAt).getTime() - now;
  if (timeLeft <= 0) return '만료됨';

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  return [hours, minutes, seconds].map((n) => String(n).padStart(2, '0')).join(':');
};
