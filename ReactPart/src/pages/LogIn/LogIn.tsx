import React from "react";
import styles from "./LogIn.module.css";
import Header from "../../components/Header/Header";
import BackgroundParallax from "../../components/BackgroundParallax/BackgroundParallax";
import Footer from "../../components/Footer/Footer";

function LogIn() {
  return (
    <>
      <Header />

      <main className={styles.main}>
        <BackgroundParallax />

        <div id="form-log-in" className={styles.form_log_in}>
          <div className={styles.input_field}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              className={styles.input}
              placeholder="youremail@domain.com"
              required
            />
          </div>
          <div className={styles.input_field}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={styles.input}
              placeholder="your-$tr0ng_p4$$w0rd"
              required
            />
          </div>
          <div className={styles.input_field}>
            <div className={styles.checkbox_and_label}>
              <input
                type="checkbox"
                className={styles.checkbox}
                id="checkbox"
              />
              <label htmlFor="checkbox" className={styles.label}>
                Label
              </label>
            </div>
            <div className={styles.description_row}>
              <div className={styles.space}></div>
              <div className={styles.description}>Description</div>
            </div>
          </div>
          <div className={styles.button_group}>
            <button type="submit" className={styles.form_button}>
              Log In
            </button>
          </div>
          <div className={styles.text_link}>
            <a href="#">Forgot password?</a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default LogIn;
