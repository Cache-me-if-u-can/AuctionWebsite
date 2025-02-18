import React, { useState, useEffect } from "react";
import styles from "./Timer.module.css";

interface TimerProps {
  totalTime: number;
  onTimeout: () => void;
}

export default function Timer({ totalTime, onTimeout }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(totalTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeout();
      return;
    }
    const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft, onTimeout]);

  return (
    <div className={styles.timer}>
      Time Left: <span className={styles.timeLeft}>{timeLeft}</span>s
    </div>
  );
}
