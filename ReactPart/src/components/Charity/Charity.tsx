import React from "react";
import styles from "./Charity.module.css";

interface CharityProps {
  name: string;
  location: string;
  description: string;
  logo: string;
}

const Charity: React.FC<CharityProps> = ({
  name,
  location,
  description,
  logo,
}) => {
  return (
    <div className={styles.charity_entry}>
      <img src={logo} alt="logo" className={styles.logo} />
      <div className={styles.charity_details}>
        <h1 className={styles.charity_name}>{name}</h1>
        <p className={styles.charity_location}>{location}</p>
        <p className={styles.charity_description}>{description}</p>
      </div>
    </div>
  );
};

export default Charity;
