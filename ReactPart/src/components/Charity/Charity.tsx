import React from "react";
import styles from "./Charity.module.css";
import { useNavigate } from "react-router-dom";

interface CharityProps {
  name: string;
  location: string;
  description: string;
  logo: string;
  website?: string; // Optional for charities that have a website
}

const Charity: React.FC<CharityProps> = ({
  name,
  location,
  description,
  logo,
  website,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/SearchAuctions", {
      state: {
        preselectedCharity: name,
      },
    });
  };
  return (
    <div className={styles.charity_entry}>
      <img src={logo} alt="logo" className={styles.logo} />
      <div className={styles.charity_details}>
        <h1 className={styles.charity_name}>{name}</h1>
        <p className={styles.charity_location}>{location}</p>
        <p className={styles.charity_description}>{description}</p>
        {website && (
          <a
            href={website}
            className={styles.charity_link}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit Website
          </a>
        )}
        <a href="#" className={styles.charity_link} onClick={handleClick}>
          View Auctions
        </a>
      </div>
    </div>
  );
};

export default Charity;
