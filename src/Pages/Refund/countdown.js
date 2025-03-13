import { useEffect, useState } from "react";

const CountdownTimerRefund = ({ expireDate }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const targetTime = new Date().getTime() + expireDate;
    setTimeLeft(expireDate);

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const remainingTime = targetTime - now;
      return remainingTime > 0 ? remainingTime : 0;
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());
    // Update the timer every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [expireDate]); // Depend on expireDate so it resets when expireDate changes

  const formatTimeLeft = () => {
    if (timeLeft <= 0) return "Expired"; // If no time left, return "Expired"

    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return <>{formatTimeLeft()}</>;
};

export default CountdownTimerRefund;
