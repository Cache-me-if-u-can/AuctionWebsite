import React, { useEffect } from "react";
import { useState } from "react";
import styles from "./LogIn.module.css";
import Header from "../../components/Header/Header";
import BackgroundParallax from "../../components/BackgroundParallax/BackgroundParallax";
import Footer from "../../components/Footer/Footer";
import { useUser } from "../../context/UserProvider";

export default function LogIn() {
  const { logIn } = useUser();

  const [formData, setFormData] = useState({
    userEmail: "",
    userPassword: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [authError, setAuthError] = useState<string>("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    const savedPassword = localStorage.getItem("userPassword");

    if (savedEmail && savedPassword) {
      setFormData({
        userEmail: savedEmail,
        userPassword: savedPassword,
        rememberMe: true,
      });
    }
    // return () => {
    //   if (!formData.rememberMe) {
    //     localStorage.removeItem("userEmail");
    //     localStorage.removeItem("userPassword");
    //   }
    // };
  }, []);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    let processedValue = value;

    if (name === "userEmail") {
      // Allow only valid email characters
      processedValue = value.replace(/[^a-zA-Z0-9@._-]/g, "");
    }
    if (name === "userPassword") {
      // Allow all characters except spaces
      processedValue = value.replace(/\s/g, "");
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: processedValue,
    }));

    setErrors((prevErrors) => {
      const { [name]: _, ...remainingErrors } = prevErrors;
      return remainingErrors;
    });
  };

  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};

    if (!formData.userEmail) newErrors.userEmail = "Email is required";
    if (!formData.userPassword) {
      newErrors.userPassword = "Password is required";
    } else if (formData.userPassword.length < 8) {
      newErrors.userPassword = "Password is too short";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (validateForm()) {
      // Submit form or perform any action
      console.log("Form submitted successfully:", JSON.stringify(formData));

      try {
        await logIn(formData.userEmail, formData.userPassword);
        console.log("Logged in!");
        setAuthError(""); // Clear any previous auth errors on successful login

        // Storing credential for remember me feature
        if (formData.rememberMe) {
          localStorage.setItem("userEmail", formData.userEmail);
          localStorage.setItem("userPassword", formData.userPassword);
        } else {
          localStorage.removeItem("userEmail");
          localStorage.removeItem("userPassword");
        }
      } catch (error) {
        console.error("Login failed:", error);
        setAuthError("Invalid email or password. Please try again.");
      }
    }
  };

  return (
    <>
      <Header />

      <main className={styles.main}>
        <BackgroundParallax />

        <form
          id="form-log-in"
          className={styles.form_log_in}
          onSubmit={handleSubmit}
        >
          <div className={styles.input_field}>
            <label htmlFor="userEmail" className={styles.label}>
              Email
            </label>
            <div className={styles.inputContainer}>
              <input
                type="email"
                id="userEmail"
                name="userEmail"
                className={styles.input}
                placeholder="youremail@domain.com"
                value={formData.userEmail}
                onChange={handleInputChange}
              />
              {errors.userEmail && (
                <div className={styles.errorContainer}>
                  <div className={styles.error}>{errors.userEmail}</div>
                </div>
              )}
            </div>
          </div>
          <div className={styles.input_field}>
            <label htmlFor="userPassword" className={styles.label}>
              Password
            </label>
            <div className={styles.inputContainer}>
              <input
                type="password"
                id="userPassword"
                name="userPassword"
                className={styles.input}
                placeholder="your-$tr0ng_p4$$w0rd"
                value={formData.userPassword}
                onChange={handleInputChange}
              />
              {errors.userPassword && (
                <div className={styles.errorContainer}>
                  <div className={styles.error}>{errors.userPassword}</div>
                </div>
              )}
            </div>
          </div>
          <div className={styles.input_field}>
            <div className={styles.checkbox_and_label}>
              <input
                type="checkbox"
                id="rememberMeCheckBox"
                name="rememberMe"
                className={styles.checkbox}
                checked={formData.rememberMe}
                onChange={(event) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    rememberMe: event.target.checked,
                  }))
                }
              />
              <label htmlFor="rememberMeCheckbox" className={styles.label}>
                Remember me
              </label>
            </div>
            {/* <div className={styles.description_row}>
              <div className={styles.space}></div>
              <div className={styles.description}>Description</div>
            </div> */}
          </div>
          <div className={styles.button_group}>
            {authError && <div className={styles.authError}>{authError}</div>}

            <button type="submit" className={styles.form_button}>
              Log In
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </>
  );
}
