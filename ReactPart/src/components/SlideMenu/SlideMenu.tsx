import React, { useRef } from "react";
import styles from "./SlideMenu.module.css";
import { Link } from "react-router-dom";

interface SlideMenuProps {
  username: String | null;
  visibility: boolean;
  setVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}

const SlideMenu: React.FC<SlideMenuProps> = ({
  username,
  visibility,
  setVisibility,
}) => {
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
        <Link to="/SearchAuctions" className={styles.slide_nav_link}>
          Auctions
        </Link>
        <div className={styles.auth_buttons}>
          {!username && (
            <>
              <Link to="/LogIn" className={`${styles.button} ${styles.log_in}`}>
                Log in
              </Link>
              <Link
                to="/Register"
                className={`${styles.button} ${styles.register}`}
              >
                Register
              </Link>
            </>
          )}
          {username && (
            <>
              <Link
                to="/Profile"
                className={`${styles.button} ${styles.account}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  version="1.1"
                >
                  <path d="M 12 1.398438 C 8.796875 1.398438 6.199219 3.996094 6.199219 7.199219 C 6.199219 9.84375 7.96875 12.074219 10.390625 12.773438 C 8.480469 13.007812 6.839844 13.683594 5.605469 14.898438 C 4.035156 16.445312 3.238281 18.753906 3.238281 21.761719 C 3.238281 22.179688 3.582031 22.519531 4 22.519531 C 4.417969 22.519531 4.761719 22.179688 4.761719 21.761719 C 4.761719 19.007812 5.484375 17.152344 6.671875 15.980469 C 7.863281 14.808594 9.644531 14.199219 12 14.199219 C 14.355469 14.199219 16.136719 14.808594 17.328125 15.980469 C 18.515625 17.152344 19.238281 19.007812 19.238281 21.761719 C 19.238281 22.179688 19.582031 22.519531 20 22.519531 C 20.417969 22.519531 20.761719 22.179688 20.761719 21.761719 C 20.761719 18.753906 19.964844 16.445312 18.394531 14.898438 C 17.160156 13.683594 15.519531 13.007812 13.609375 12.773438 C 16.03125 12.074219 17.800781 9.84375 17.800781 7.199219 C 17.800781 3.996094 15.203125 1.398438 12 1.398438 Z M 7.71875 7.199219 C 7.71875 4.835938 9.636719 2.921875 12 2.921875 C 14.363281 2.921875 16.28125 4.835938 16.28125 7.199219 C 16.28125 9.5625 14.363281 11.480469 12 11.480469 C 9.636719 11.480469 7.71875 9.5625 7.71875 7.199219 Z M 7.71875 7.199219 " />
                </svg>
                Hi, {username}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlideMenu;
