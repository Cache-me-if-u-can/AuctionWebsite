import React, { useRef } from "react";
import styles from "./SlideMenu.module.css";
import { Link } from "react-router-dom";

interface SlideMenuProps {
  visibility: boolean;
  setVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}

const SlideMenu: React.FC<SlideMenuProps> = ({ visibility, setVisibility }) => {
  const menuHolderRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (
      menuHolderRef.current &&
      !menuRef.current?.contains(event.target as Node) &&
      menuHolderRef.current.contains(event.target as Node)
    ) {
      setVisibility(false);
    }
  };

  return (
    <div
      ref={menuHolderRef}
      className={`${styles.slide_menu_holder} ${
        visibility ? styles.active : ""
      }`}
      onClick={handleClickOutside}
    >
      <div ref={menuRef} className={styles.slide_menu}>
        <Link to="/" className={styles.slide_nav_link}>
          Home
        </Link>
        <Link to="/Charities" className={styles.slide_nav_link}>
          Charities
        </Link>
        <div className={styles.auth_buttons}>
          <Link to="/LogIn" className={`${styles.button} ${styles.log_in}`}>
            Log in
          </Link>
          <Link
            to="/Register"
            className={`${styles.button} ${styles.register}`}
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SlideMenu;
