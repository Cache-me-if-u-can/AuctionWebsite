import React, { useState } from "react";
import styles from "./Register.module.css";
import Header from "../../components/Header/Header";
import BackgroundParallax from "../../components/BackgroundParallax/BackgroundParallax";
import Footer from "../../components/Footer/Footer";

export default function Register() {
  const [userType, setUserType] = useState<string>("select type");

  return (
    <>
      <Header />

      <main className={styles.main}>
        <BackgroundParallax />

        <div id="form-register" className={styles.form_register}>
          <div className={styles.input_field}>
            <label htmlFor="userType" className={styles.label}>
              Register as
            </label>
            <select
              id="userType"
              className={styles.input}
              value={userType}
              onChange={(event) => setUserType(event.target.value)}
            >
              <option value="">select type</option>
              <option value="customer">Customer</option>
              <option value="charity">Charity</option>
            </select>
          </div>

          <div
            id="customerFields"
            className={`${styles.userFields} ${
              userType == "customer" ? styles.active : ""
            }`}
          >
            <div className={styles.input_field}>
              <label htmlFor="customerName" className={styles.label}>
                First name
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                className={styles.input}
                placeholder="First name"
                required
              />
            </div>
            <div className={styles.input_field}>
              <label htmlFor="customerLastName" className={styles.label}>
                Last name
              </label>
              <input
                type="text"
                id="customerLastName"
                name="customerLastName"
                className={styles.input}
                placeholder="Last name"
                required
              />
            </div>
            <div className={styles.input_field}>
              <label htmlFor="customerDOB" className={styles.label}>
                Date of Birth
              </label>
              <input
                type="date"
                id="customerDOB"
                name="customerDOB"
                className={styles.input}
                required
              />
            </div>
            <div className={styles.input_field}>
              <label htmlFor="customerPhone" className={styles.label}>
                Phone Number
              </label>
              <input
                type="tel"
                id="customerPhone"
                name="customerPhone"
                className={styles.input}
                placeholder="123-456-7890"
                required
              />
            </div>
            <div className={styles.input_field}>
              <label htmlFor="customerAddress" className={styles.label}>
                Address
              </label>
              <input
                type="text"
                id="customerAddress"
                name="customerAddress"
                className={styles.input}
                placeholder="Your address"
                required
              />
            </div>
            <div className={styles.input_field}>
              <label htmlFor="customerEmail" className={styles.label}>
                Email
              </label>
              <input
                type="email"
                id="customerEmail"
                name="customerEmail"
                className={styles.input}
                placeholder="youremail@domain.com"
                required
              />
            </div>
            <div className={styles.input_field}>
              <label htmlFor="customerPassword" className={styles.label}>
                Password
              </label>
              <input
                type="password"
                id="customerPassword"
                name="customerPassword"
                className={styles.input}
                placeholder="your-$tr0ng_p4$$w0rd"
                required
              />
            </div>
            <div className={styles.input_field}>
              <label htmlFor="customerRepeatPassword" className={styles.label}>
                Repeat Password
              </label>
              <input
                type="password"
                id="customerRepeatPassword"
                name="customerRepeatPassword"
                className={styles.input}
                placeholder="your-$tr0ng_p4$$w0rd"
                required
              />
            </div>
          </div>

          <div
            id="charityFields"
            className={`${styles.userFields} ${
              userType == "charity" ? styles.active : ""
            }`}
          >
            <div className={styles.input_field}>
              <label htmlFor="charityName" className={styles.label}>
                Charity Name
              </label>
              <input
                type="text"
                id="charityName"
                name="charityName"
                className={styles.input}
                placeholder="Charity name"
                required
              />
            </div>
            <div className={styles.input_field}>
              <label htmlFor="charityPhone" className={styles.label}>
                Phone Number
              </label>
              <input
                type="tel"
                id="charityPhone"
                name="charityPhone"
                className={styles.input}
                placeholder="123-456-7890"
                required
              />
            </div>
            <div className={styles.input_field}>
              <label htmlFor="charityAddress" className={styles.label}>
                Address
              </label>
              <input
                type="text"
                id="charityAddress"
                name="charityAddress"
                className={styles.input}
                placeholder="Charity address"
                required
              />
            </div>
            <div className={styles.input_field}>
              <label htmlFor="charityEmail" className={styles.label}>
                Email
              </label>
              <input
                type="email"
                id="charityEmail"
                name="charityEmail"
                className={styles.input}
                placeholder="youremail@domain.com"
                required
              />
            </div>
            <div className={styles.input_field}>
              <label htmlFor="charityPassword" className={styles.label}>
                Password
              </label>
              <input
                type="password"
                id="charityPassword"
                name="charityPassword"
                className={styles.input}
                placeholder="your-$tr0ng_p4$$w0rd"
                required
              />
            </div>
            <div className={styles.input_field}>
              <label htmlFor="customerRepeatPassword" className={styles.label}>
                Repeat Password
              </label>
              <input
                type="password"
                id="customerRepeatPassword"
                name="customerRepeatPassword"
                className={styles.input}
                placeholder="your-$tr0ng_p4$$w0rd"
                required
              />
            </div>
          </div>

          <div className={styles.button_group}>
            <button type="submit" className={styles.form_button}>
              <span>Register</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
