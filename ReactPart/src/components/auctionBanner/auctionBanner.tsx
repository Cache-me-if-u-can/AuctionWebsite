import React from "react";
import styles from "./auctionBanner.module.css";
import bannerImage from "../../assets/images/artwork2.png";


export default function AuctionBanner() {
  return (
    <div className={styles.bannerContainer}>
      <img className={styles.bannerImage} src={bannerImage} alt="Banner" />
    </div>
  );
}
