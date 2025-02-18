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
  id: string;
  question: string;
  answers: Answer[];
}

export default function Quiz() {
  const [questions, setQuestions] = useState<QuestionData[]>([
    {
      id: "1",
      question: "What is the capital of France?",
      answers: [
        { text: "Berlin", correct: false },
        { text: "Madrid", correct: false },
        { text: "Paris", correct: true },
        { text: "Rome", correct: false },
      ],
    },
    {
      id: "2",
      question: "Which planet is known as the Red Planet?",
      answers: [
        { text: "Earth", correct: false },
        { text: "Mars", correct: true },
        { text: "Jupiter", correct: false },
        { text: "Venus", correct: false },
      ],
    },
    {
      id: "3",
      question: "What is the largest ocean on Earth?",
      answers: [
        { text: "Atlantic Ocean", correct: false },
        { text: "Indian Ocean", correct: false },
        { text: "Pacific Ocean", correct: true },
        { text: "Arctic Ocean", correct: false },
      ],
    },
    {
      id: "4",
      question: "Who developed the theory of relativity?",
      answers: [
        { text: "Isaac Newton", correct: false },
        { text: "Albert Einstein", correct: true },
        { text: "Galileo Galilei", correct: false },
        { text: "Nikola Tesla", correct: false },
      ],
    },
    {
      id: "5",
      question: "What is the chemical symbol for water?",
      answers: [
        { text: "O2", correct: false },
        { text: "H2O", correct: true },
        { text: "CO2", correct: false },
        { text: "NaCl", correct: false },
      ],
    },
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);

  //   useEffect(() => {
  //     fetch("/api/questions") // Replace with your API endpoint
  //       .then((res) => res.json())
  //       .then((data: QuestionData[]) => {
  //         setQuestions(data);
  //       });
  //   }, []);

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
      <h1>Quiz Challenge</h1>

      {questions.length > 0 && currentQuestionIndex < questions.length ? (
        <>
          <ProgressBar progress={progress} />
          <Question
            questionText={questions[currentQuestionIndex].question}
            answers={questions[currentQuestionIndex].answers}
            onSelectAnswer={handleSelectAnswer}
          />
          <Timer totalTime={15} onTimeout={moveToNextQuestion} />
        </>
      ) : (
        <h2>Quiz Completed your score: {score}</h2>
      )}
    </div>
  );
}
