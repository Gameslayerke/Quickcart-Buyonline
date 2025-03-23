import React, { useState, useEffect } from "react";
import "./CountdownTimer.css"; // Import the CSS file
const CountdownTimer = ({ startTime }) => {

    const calculateRemainingTime = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const elapsedTime = now - start; // Time elapsed since the offer was fetched
    const maxDuration = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

    // Ensure the remaining time doesn't exceed 3 hours or go below 0
    const remainingTime = Math.max(maxDuration - elapsedTime, 0);

    // Convert remaining time to hours, minutes, and seconds
    const hours = Math.floor(remainingTime / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
    const seconds = Math.floor((remainingTime / 1000) % 60);

    return { hours, minutes, seconds };
  };

  // State to store the remaining time
  const [timeLeft, setTimeLeft] = useState(calculateRemainingTime(startTime));

  // Update the timer every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateRemainingTime(startTime));
    }, 1000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(timer);
  }, [startTime]);

  // If the timer reaches 0, display "Offer Expired"
  if (timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
    return <span className="offer-expired">Offer Expired</span>;
  }

  // Display the remaining time
  return (
    <div className="countdown-timer">
      <span>{timeLeft.hours}h </span>
      <span>{timeLeft.minutes}m </span>
      <span>{timeLeft.seconds}s</span>
    </div>
  );
};

export default CountdownTimer;