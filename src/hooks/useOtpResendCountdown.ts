import { useCallback, useEffect, useState } from 'react';

export function formatCountdown(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function useOtpResendCountdown(initialSeconds: number) {
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);

  useEffect(() => {
    if (secondsRemaining <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      setSecondsRemaining(current => current - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [secondsRemaining]);

  const resetCountdown = useCallback(() => {
    setSecondsRemaining(initialSeconds);
  }, [initialSeconds]);

  return {
    canResend: secondsRemaining === 0,
    formattedTime: formatCountdown(secondsRemaining),
    resetCountdown,
    secondsRemaining,
  };
}
