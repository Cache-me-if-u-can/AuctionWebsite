import React, { useEffect, useRef, useState } from "react";
import styles from "./BackgroundParallax.module.css";
import Scroller from "../Scroller/Scroller";

export default function BackgroundParallax() {
  const firstRow = [
    "Sawasdee",
    "Hello",
    "Привіт",
    "Kia ora",
    "Kamusta",
    "こんにちは",
    "Selam",
    "Alreet",
    "Yassou",
    "Shwmae",
    "Mingalaba",
    "Γειά",
    "Bula",
  ];

  const secondRow = [
    "Salute",
    "Hujambo",
    "สวัสดี",
    "Hello",
    "Hola",
    "Bonjour",
    "Hallo",
    "Namaste",
    "Salam",
    "Cześć",
    "Merhaba",
    "Xin chào",
    "Helló",
  ];

  const thirdRow = [
    "Dia dhuit",
    "Olá",
    "Hej",
    "안녕하세요",
    "Ciao",
    "Jambo",
    "Halo",
    "Aloha",
    "Coucou",
    "Hello",
    "Shalom",
    "Salut",
    "Ahoj",
  ];

  const [fontParams, setFontParams] = useState<{
    size: number;
    gap: number;
  }>({
    size: 0,
    gap: 0,
  });

  const backgroundParallaxRef = useRef<HTMLDivElement | null>(null);

  const updateFontParams = () => {
    if (backgroundParallaxRef.current) {
      const { width, height } =
        backgroundParallaxRef.current.getBoundingClientRect();
      const fontHeight = (height / 2.5) * 0.62;
      setFontParams({ size: fontHeight, gap: fontHeight / 3 });
    }
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      updateFontParams();
    });
    if (backgroundParallaxRef.current) {
      resizeObserver.observe(backgroundParallaxRef.current);
    }
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={backgroundParallaxRef} className={styles.background_parallax}>
      <Scroller fontParams={fontParams} speed="fast" arr={firstRow} />

      <Scroller fontParams={fontParams} direction="right" arr={secondRow} />

      <Scroller fontParams={fontParams} speed="slow" arr={thirdRow} />
    </div>
  );
}
