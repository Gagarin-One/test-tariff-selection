import { useState, useEffect } from 'react';

export const useTimer = (initialMinutes: number = 2) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsEnded(true);
      setIsBlinking(false);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    // Check if we need to start blinking (last 30 seconds)
    if (timeLeft <= 30 && timeLeft > 0) {
      setIsBlinking(true);
    } else {
      setIsBlinking(false);
    }

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return {
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
      isBlinking,
      isEnded,
    };
  };

  return { timeLeft, formatTime, isEnded };
};
