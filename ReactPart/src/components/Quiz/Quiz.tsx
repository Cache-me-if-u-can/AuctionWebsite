import React, { useState, useEffect } from "react";
import styles from "./Quiz.module.css";
import ProgressBar from "../ProgressBar/ProgressBar";
import Question from "../Question/Question";
import Timer from "../Timer/Timer";

interface Answer {
  text: string;
  correct: boolean;
}

interface QuestionData {
  question: string;
  answers: Answer[];
}

interface QuizResponse {
  title: string;
  questions: QuestionData[];
}

interface QuizProps {
  charityName: string;
}

export default function Quiz({ charityName }: QuizProps) {
  const [title, setTitle] = useState("Loading Quiz...");
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetch(
      `http://127.0.0.1:8080/getQuiz?charityName=${encodeURIComponent(
        charityName
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data: QuizResponse) => {
        setTitle(data.title || "Quiz Challenge");
        setQuestions(data.questions);
      });
  }, []);

  function handleSelectAnswer(isCorrect: boolean) {
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    moveToNextQuestion();
  }

  function moveToNextQuestion() {
    setCurrentQuestionIndex((prev) => prev + 1);
    if (currentQuestionIndex < questions.length) {
      setProgress(((currentQuestionIndex + 1) / questions.length) * 100);
    } else {
      console.log("Quiz Completed");
    }
  }

  return (
    <div className={styles.quizContainer}>
      <h1>{title}</h1>

      {questions.length > 0 && currentQuestionIndex < questions.length ? (
        <>
          <ProgressBar progress={progress} />
          <Question
            questionText={questions[currentQuestionIndex].question}
            answers={questions[currentQuestionIndex].answers}
            onSelectAnswer={handleSelectAnswer}
          />
          <Timer
            key={currentQuestionIndex}
            totalTime={20}
            onTimeout={moveToNextQuestion}
          />
        </>
      ) : (
        <h2>Quiz Completed, your score: {score}</h2>
      )}
    </div>
  );
}
