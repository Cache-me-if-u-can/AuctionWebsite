import React from "react";
import styles from "./Scroller.module.css";

interface ScrollerProps {
  fontParams: { size: number; gap: number };
  direction?: "left" | "right";
  speed?: "slow" | "regular" | "fast";
  arr: string[];
}

const Scroller: React.FC<ScrollerProps> = ({
  fontParams,
  direction = "left",
  speed = "regular",
  arr,
}) => {
  const duplicatedArr = [...arr, ...arr];

  return (
    <div
      className={styles.scroller}
      data-direction={direction}
      data-speed={speed}
    >
      <ul
        className={`${styles.tag_list} ${styles.scroller_inner} ${styles.text_content}`}
        style={{
          gap: `${fontParams.gap}px`,
          paddingRight: `${fontParams.gap}px`,
        }}
      >
        {duplicatedArr.map((hello, index) => (
          <li
            style={{
              fontSize: `${fontParams.size}px`,
            }}
            key={index}
          >
            {hello}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Scroller;
