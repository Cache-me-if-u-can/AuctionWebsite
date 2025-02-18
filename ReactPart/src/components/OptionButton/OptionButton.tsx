import React from "react";
import styles from "./OptionButton.module.css";

interface OptionButtonProps {
  option: string;
  onClick: () => void;
}

export default function OptionButton({ option, onClick }: OptionButtonProps) {
  return (
    <button className={styles.optionButton} onClick={onClick}>
      {option}
    </button>
  );
}
