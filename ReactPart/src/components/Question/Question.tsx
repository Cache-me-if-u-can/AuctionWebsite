import React from "react";
import OptionButton from "../OptionButton/OptionButton";

interface Answer {
  text: string;
  correct: boolean;
}

interface QuestionProps {
  questionText: string;
  answers: Answer[];
  onSelectAnswer: (selectedOption: boolean) => void;
}

export default function Question({
  questionText,
  answers,
  onSelectAnswer,
}: QuestionProps) {
  return (
    <div>
      <h2>{questionText}</h2>
      <div>
        {answers.map((answer, index) => (
          <OptionButton
            key={index}
            option={answer.text}
            onClick={() => onSelectAnswer(answer.correct)}
          />
        ))}
      </div>
    </div>
  );
}
