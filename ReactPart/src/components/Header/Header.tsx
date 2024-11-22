import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import gavelLogo from "../../assets/images/gavel_V1.png";
import SlideMenu from "../SlideMenu/SlideMenu";
import { useUser } from "../../context/UserProvider";

export default function Header() {
  const [slideMenu, setSlideMenu] = useState<boolean>(false);
  const { isLoggedIn, getUsername, getUserType } = useUser(); // TODO: { loading } - true if request is fetching

  // TODO: use { loading } to show a placeholder while request is fetching
  // if (loading) {
  //   return (
  //     <header className={styles.header}>
  //       <div className={styles.loader}></div>
  //     </header>
  //   );
  // }

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
            {!isLoggedIn && (
              <>
                <Link
                  to="/LogIn"
                  className={`${styles.button} ${styles.log_in}`}
                >
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
            {isLoggedIn && (
              <>
                <Link
                  to="/Profile"
                  className={`${styles.button} ${styles.account}`}
                >
                  {getUserType() === "customer" && (
                    <>
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
                      Hi, {getUsername()}
                    </>
                  )}
                  {getUserType() === "charity" && (
                    <>
                      <svg
                        width="24px"
                        height="24px"
                        version="1.1"
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="m60.367 37.793c-1.6406 1.6406-3.8555 2.5859-6.082 2.5859-1.9609 0-3.7734-0.73047-5.1094-2.0508l-20.16-20.176-1.8242 1.8242 6.9648 6.9648-22.578 22.574c-0.66406 0.66797-1.1992 1.4375-1.6016 2.2852-0.625 1.3242-0.88281 2.7812-0.75781 4.2266-5.957-6.0156-9.2305-13.66-9.2188-21.523 0.011719-7.5195 3.0039-14.637 8.4336-20.031 5.4219-5.3945 12.621-8.3711 20.273-8.3711 4.5234 0 8.832 1.0156 12.812 3.0039 1.6211 0.80078 3.1992 1.7852 4.6875 2.9414l0.70703 0.55469 14 13.988c2.9219 2.9492 2.6875 7.9727-0.54687 11.203z" />
                        <path d="m44.461 37.25-22.574 22.574c-1.0547 1.0469-2.4844 1.6328-3.9883 1.6328-1.6094 0-3.1484-0.64453-4.3164-1.8164-1.168-1.168-1.8125-2.6953-1.8125-4.3164 0-1.5156 0.57031-2.9336 1.6289-3.9883l22.57-22.578z" />
                        <path d="m100 34.504c0.007812 7.918-3.3047 15.602-9.3359 21.641-3.5898 3.5781-7.7227 7.7148-11.949 11.938l-24.387 24.184c-1.0547 1.0547-2.4727 1.6328-3.9883 1.6328-1.6211 0-3.1602-0.64453-4.3164-1.8164-1.1367-1.1406-1.7734-2.6367-1.8047-4.2148-0.03125-1.5469 0.54297-3.0039 1.6211-4.0938l23.711-23.723-2.2148-2.2148-23.715 23.723c-1.0586 1.0469-2.4805 1.6289-3.9883 1.6289-1.6094 0-3.1484-0.64453-4.3203-1.8125-1.168-1.1719-1.8125-2.6992-1.8125-4.3164 0-1.5195 0.57422-2.9336 1.6289-3.9922l23.711-23.723-2.5195-2.5234-23.727 23.715c-1.0547 1.0586-2.4727 1.6328-3.9883 1.6328-1.6211 0-3.1602-0.64453-4.3203-1.8125-1.1367-1.1406-1.7734-2.6367-1.8047-4.2148-0.042969-1.5469 0.54297-3.0078 1.6211-4.0938l22.574-22.574 0.6875 0.6875c1.8242 1.8164 4.2852 2.8125 6.9219 2.8125 2.8828 0 5.7656-1.2227 7.9102-3.3438 4.2266-4.2461 4.4727-10.902 0.53125-14.84l-10.992-11.004c5.332-4.9648 12.242-7.6836 19.559-7.6836 7.6406 0 14.84 2.9766 20.277 8.3711 5.4258 5.3945 8.4219 12.512 8.4297 20.031z" />
                      </svg>
                      Profile
                    </>
                  )}
                </Link>
              </>
            )}
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

      <SlideMenu
        username={getUsername()}
        visibility={slideMenu}
        setVisibility={setSlideMenu}
      />
    </>
  );
}
