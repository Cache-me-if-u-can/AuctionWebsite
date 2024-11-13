import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import gavelLogo from "../../assets/images/gavel_V1.png";
import SlideMenu from "../SlideMenu/SlideMenu";

export default function Header() {
  const [slideMenu, setSlideMenu] = useState<boolean>(false);

  return (
    <>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          <img alt="Logo" className={styles.logo_img} src={gavelLogo} />
          <div className={styles.logo_text}>
            GAVEL<strong>.XYZ</strong>
          </div>
        </Link>

        <nav className={styles.nav}>
          <Link to="/" className={styles.nav_link}>
            Home
          </Link>
          <Link to="/Charities" className={styles.nav_link}>
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
        </nav>

        <svg
          className={styles.menu_icon}
          viewBox="0 0 64 48"
          xmlns="http://www.w3.org/2000/svg"
          onClick={() => setSlideMenu((prev) => !prev)}
        >
          <path
            d="M8 24H56M8 12H56M8 36H56"
            stroke="#2C2C2C"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </header>

      <SlideMenu visibility={slideMenu} setVisibility={setSlideMenu} />
    </>
  );
}
