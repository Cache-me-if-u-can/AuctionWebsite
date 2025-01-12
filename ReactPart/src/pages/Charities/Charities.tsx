import React from "react";
import styles from "./Charities.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

export default function Charities() {
  return (
    <>
      <Header />
      <div className={styles.charity_entry}>
        <img src="https://clipground.com/images/placeholder-logo-5.png" alt="logo" className={styles.logo}/>
        <div className={styles.charity_details}>
          <h1 className={styles.charity_name}>NAME</h1>
          <p className={styles.charity_location}>Country, City</p>
          <p className={styles.charity_description}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ultrices erat et ipsum pretium volutpat.
           Etiam tempus at odio id luctus. Nunc nec ornare leo, in placerat libero. Aenean risus mi, posuere sed leo a, gravida feugiat orci. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In id sem felis. Nam sagittis interdum lectus, eget imperdiet velit viverra sit amet. Fusce suscipit et sapien vitae consequat. Curabitur faucibus, erat non mollis mattis, mauris erat auctor dui, id gravida urna erat tincidunt nibh. </p>
        </div>
      </div>
      <div className={styles.charity_entry_right}>

        <div className={styles.charity_details}>
          <h1 className={styles.charity_name_right}>NAME OF CHARITY</h1>
          <p className={styles.charity_location_right}>Country, City</p>
          <p className={styles.charity_description}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ultrices erat et ipsum pretium volutpat.
            Etiam tempus at odio id luctus. Nunc nec ornare leo, in placerat libero. Aenean risus mi, posuere sed leo a, gravida feugiat orci. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In id sem felis. Nam sagittis interdum lectus, eget imperdiet velit viverra sit amet. Fusce suscipit et sapien vitae consequat. Curabitur faucibus, erat non mollis mattis, mauris erat auctor dui, id gravida urna erat tincidunt nibh. </p>
        </div>
        <img src="https://clipground.com/images/placeholder-logo-5.png" alt="logo" className={styles.logo}/>
      </div>      <Footer />
    </>
  );
}
