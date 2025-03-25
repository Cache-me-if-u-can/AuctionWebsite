import React from "react";
import styles from "./Footer.module.css";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <nav className={styles.footerLinks}>
          <Link to="/faq" className={styles.footerLink}>
            FAQ
          </Link>
          {/* If we decide to add more footer link like Contact Us etc they go here */}
        </nav>
        <div className={styles.copyright}>
          ©GAVEL.XYZ all rights reserved 2024
        </div>
      </div>
    </footer>
  );
}
