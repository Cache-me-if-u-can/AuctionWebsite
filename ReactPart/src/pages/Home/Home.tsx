import React from "react";
import styles from "./Home.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import BackgroundParallax from "../../components/BackgroundParallax/BackgroundParallax";
import Quiz from "../../components/Quiz/Quiz";

export default function Home() {
  return (
    <>
      <Header />

      <main className={styles.main}>
        <BackgroundParallax />
      </main>

      <Footer />
    </>
  );
}
