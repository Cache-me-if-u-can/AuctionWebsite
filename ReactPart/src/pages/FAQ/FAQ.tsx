import React from "react";
import styles from "./FAQ.module.css";
import Header from "../../components/Header/Header";
import FAQComponent from "../../components/FAQ/FAQ";
import Footer from "../../components/Footer/Footer";

const FAQPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <Header />
      <FAQComponent />
    </div>
  );
};

export default FAQPage;
