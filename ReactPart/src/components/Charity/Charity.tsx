import React from "react";
import styles from "./Charities.module.css";

interface CharityProps {
  name: string;
  location: string;
  description: string;
  logo: string;
  index: number;
}

const Charity: React.FC<CharityProps> = ({
  name,
  location,
  description,
  logo,
  index,
}) => {
  return (
    <div
      className={`${styles.charity_entry} ${index % 2 === 0 ? styles.leftAligned : styles.rightAligned}`}
    >
      <img src={logo} alt="logo" className={styles.logo} />
      <div
        className={`${styles.charity_details} ${index % 2 === 0 ? styles.leftText : styles.rightText}`}
      >
        <h1 className={styles.charity_name}>{name}</h1>
        <p className={styles.charity_location}>{location}</p>
        <p className={styles.charity_description}>{description}</p>
      </div>
    </div>
  );
};

export default Charity;
