import React, { useEffect, useState } from "react";
import Quiz from "../Quiz/Quiz";
import styles from "./QuizPopup.module.css";

interface QuizPopupProps {
  charityName: string;
  onClose: () => void;
}

export default function QuizPopup({ charityName, onClose }: QuizPopupProps) {
  const [started, setStarted] = useState(false);
  const [quizExists, setQuizExists] = useState<boolean | null>(null);

  useEffect(() => {
    setStarted(false);
    setQuizExists(null);

    fetch(
      `http://127.0.0.1:8080/getQuiz?charityName=${encodeURIComponent(
        charityName
      )}`
    ).then((res) => {
      if (res.status === 204) {
        setQuizExists(false);
      } else {
        setQuizExists(true);
      }
    });
  }, [charityName]);

  if (quizExists === false) return null;
  if (quizExists === null) return null;

  return (
    <div className={`${styles.popupOverlay}`}>
      <div
        className={`${styles.popupContainer} ${
          started ? styles.expanded : styles.small
        }`}
      >
        <button className={styles.closeBtn} onClick={onClose}>
          X
        </button>
        {!started ? (
          <>
            <h3>Take Part in Charity Quiz</h3>
            <button onClick={() => setStarted(true)}>Start</button>
          </>
        ) : (
          <>
            <Quiz charityName={charityName} />
          </>
        )}
      </div>
    </div>
  );
}
