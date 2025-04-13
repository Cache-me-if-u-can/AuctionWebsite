import React, { useState } from "react";
import styles from "./Register.module.css";
import Header from "../../components/Header/Header";
import BackgroundParallax from "../../components/BackgroundParallax/BackgroundParallax";
import Footer from "../../components/Footer/Footer";
import { useUser } from "../../context/UserProvider";

export default function Register() {
  const { register } = useUser();

  const [userType, setUserType] = useState<string>("select type");

  // State to store form data and errors
  const [formData, setFormData] = useState({
    customerName: "",
    customerLastName: "",
    customerDOB: "",
    customerPhone: "",
    customerAddress: "",
    customerEmail: "",
    customerPassword: "",
    customerRepeatPassword: "",

    charityName: "",
    charityPhone: "",
    charityAddress: "",
    charityEmail: "",
    charityPassword: "",
    charityRepeatPassword: "",
    charityImage: "",
    charityDescription: "",
    charityWebsite: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Update form data
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    let processedValue = value;

    if (["customerName", "customerLastName"].includes(name)) {
      processedValue = value.replace(/[^a-zA-Z]/g, ""); // Allow only letters
    }
    if (name === "charityName") {
      processedValue = value.replace(/[^a-zA-Z\s]/g, ""); // Allow letters and spaces
    }
    if (["customerPhone", "charityPhone"].includes(name)) {
      processedValue = value.replace(/\D/g, ""); // Allow only numbers
    }
    if (["customerEmail", "charityEmail"].includes(name)) {
      // Allow only valid email characters
      processedValue = value.replace(/[^a-zA-Z0-9@._-]/g, "");
    }
    if (
      [
        "customerPassword",
        "customerRepeatPassword",
        "charityPassword",
        "charityRepeatPassword",
      ].includes(name)
    ) {
      // Allow all characters except spaces
      processedValue = value.replace(/\s/g, "");
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: processedValue,
    }));

    setErrors((prevErrors) => {
      const { [name]: _, ...remainingErrors } = prevErrors; // Exclude the current field's error
      return remainingErrors;
    });
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      setFormData((prevData) => ({
        ...prevData,
        charityImage: "",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        charityImage: "Image is required",
      }));
      return;
    }

    setErrors((prevErrors) => {
      const { charityImage, ...remainingErrors } = prevErrors;
      return remainingErrors;
    });

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context not available");

      const img = new Image();
      img.onload = () => {
        canvas.width = 64;
        canvas.height = 64;
        ctx.drawImage(img, 0, 0, 64, 64);
        const base64Image = canvas.toDataURL("image/png");

        console.log(base64Image);

        setFormData((prevData) => ({
          ...prevData,
          charityImage: base64Image,
        }));
      };
      img.src = URL.createObjectURL(file);
      console.log(img);
    } catch (error) {
      console.error("Failed to process image:", error);
    }
  };

  // Validation method
  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};

    const today = new Date().toISOString().split("T")[0];

    // Check for customer fields
    if (userType === "customer") {
      if (!formData.customerName)
        newErrors.customerName = "First name is required";
      if (!formData.customerLastName)
        newErrors.customerLastName = "Last name is required";
      if (!formData.customerDOB) {
        newErrors.customerDOB = "Date of birth is required";
      } else if (formData.customerDOB > today) {
        newErrors.customerDOB = "Enter valid date of birth";
      }
      if (!formData.customerPhone) {
        newErrors.customerPhone = "Phone number is required";
      } else if (formData.customerPhone.length != 11) {
        newErrors.customerPhone = "Enter valid phone number";
      }
      if (!formData.customerAddress)
        newErrors.customerAddress = "Address is required";
      if (!formData.customerEmail)
        newErrors.customerEmail = "Email is required";
      if (!formData.customerPassword) {
        newErrors.customerPassword = "Password is required";
      } else if (formData.customerPassword.length < 8) {
        newErrors.customerPassword = "Password is too weak";
      }
      if (formData.customerPassword !== formData.customerRepeatPassword) {
        newErrors.customerRepeatPassword = "Passwords do not match";
      }
    }

    // Check for charity fields
    if (userType === "charity") {
      if (!formData.charityName)
        newErrors.charityName = "Charity name is required";
      if (!formData.charityPhone) {
        newErrors.charityPhone = "Phone number is required";
      } else if (formData.charityPhone.length != 11) {
        newErrors.charityPhone = "Enter valid phone number";
      }
      if (!formData.charityAddress)
        newErrors.charityAddress = "Address is required";
      if (!formData.charityEmail) newErrors.charityEmail = "Email is required";
      if (!formData.charityPassword) {
        newErrors.charityPassword = "Password is required";
      } else if (formData.charityPassword.length < 8) {
        newErrors.charityPassword = "Password is too weak";
      }
      if (formData.charityPassword !== formData.charityRepeatPassword) {
        newErrors.charityRepeatPassword = "Passwords do not match";
      }
      if (!formData.charityImage) newErrors.charityImage = "Image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (validateForm()) {
      // Submit form or perform any action
      let userData = {};
      let userEmail = "";
      let userPassword = "";
      if (userType === "customer") {
        userData = {
          userName: formData.customerName,
          userLastName: formData.customerLastName,
          userDOB: formData.customerDOB,
          userPhone: formData.customerPhone,
          userAddress: formData.customerAddress,
          userEmail: formData.customerEmail,
          userPassword: formData.customerPassword,
        };
        userEmail = formData.customerEmail;
        userPassword = formData.customerPassword;
      }
      if (userType === "charity") {
        userData = {
          userName: formData.charityName,
          userPhone: formData.charityPhone,
          userAddress: formData.charityAddress,
          userEmail: formData.charityEmail,
          userPassword: formData.charityPassword,
          imageData: formData.charityImage,
          description: formData.charityDescription,
          website: formData.charityWebsite,
        };
        userEmail = formData.charityEmail;
        userPassword = formData.charityPassword;
      }

      console.log(
        "Form submitted successfully (userData):",
        JSON.stringify(userData),
      );

      try {
        await register(
          userEmail,
          userPassword,
          userType,
          JSON.stringify(userData),
        );
        console.log("Registered!");
      } catch (error) {
        console.error("Register failed:", error);
      }
    }
  };

  return (
    <>
      <Header />

      <main className={styles.main}>
        <BackgroundParallax />

        <form
          id="form-register"
          className={styles.form_register}
          onSubmit={handleSubmit}
        >
          <div className={styles.input_field}>
            <label htmlFor="userType" className={styles.label}>
              Register as
            </label>
            <select
              id="userType"
              name="userType"
              className={styles.input}
              value={userType}
              onChange={(event) => setUserType(event.target.value)}
            >
              <option value="">select type</option>
              <option value="customer">Customer</option>
              <option value="charity">Charity</option>
            </select>
          </div>

          {userType === "customer" && (
            <div id="customerFields" className={styles.userFields}>
              <div className={styles.input_field}>
                <label htmlFor="customerName" className={styles.label}>
                  First name
                </label>
                <div className={styles.inputContainer}>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    className={styles.input}
                    placeholder="First name"
                    value={formData.customerName}
                    onChange={handleInputChange}
                  />
                  {errors.customerName && (
                    <div className={styles.errorContainer}>
                      <div className={styles.error}>{errors.customerName}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.input_field}>
                <label htmlFor="customerLastName" className={styles.label}>
                  Last name
                </label>
                <div className={styles.inputContainer}>
                  <input
                    type="text"
                    id="customerLastName"
                    name="customerLastName"
                    className={styles.input}
                    placeholder="Last name"
                    value={formData.customerLastName}
                    onChange={handleInputChange}
                  />
                  {errors.customerLastName && (
                    <div className={styles.errorContainer}>
                      <div className={styles.error}>
                        {errors.customerLastName}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.input_field}>
                <label htmlFor="customerDOB" className={styles.label}>
                  Date of Birth
                </label>
                <div className={styles.inputContainer}>
                  <input
                    type="date"
                    id="customerDOB"
                    name="customerDOB"
                    className={styles.input}
                    value={formData.customerDOB}
                    onChange={handleInputChange}
                    // max={new Date().toISOString().split("T")[0]}
                  />
                  {errors.customerDOB && (
                    <div className={styles.errorContainer}>
                      <div className={styles.error}>{errors.customerDOB}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.input_field}>
                <label htmlFor="customerPhone" className={styles.label}>
                  Phone Number
                </label>
                <div className={styles.inputContainer}>
                  <input
                    type="tel"
                    id="customerPhone"
                    name="customerPhone"
                    className={styles.input}
                    placeholder="123-456-7890"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    inputMode="numeric"
                  />
                  {errors.customerPhone && (
                    <div className={styles.errorContainer}>
                      <div className={styles.error}>{errors.customerPhone}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.input_field}>
                <label htmlFor="customerAddress" className={styles.label}>
                  Address
                </label>
                <div className={styles.inputContainer}>
                  <input
                    type="text"
                    id="customerAddress"
                    name="customerAddress"
                    className={styles.input}
                    placeholder="Your address"
                    value={formData.customerAddress}
                    onChange={handleInputChange}
                  />
                  {errors.customerAddress && (
                    <div className={styles.errorContainer}>
                      <div className={styles.error}>
                        {errors.customerAddress}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.input_field}>
                <label htmlFor="customerEmail" className={styles.label}>
                  Email
                </label>
                <div className={styles.inputContainer}>
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    className={styles.input}
                    placeholder="youremail@domain.com"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                  />
                  {errors.customerEmail && (
                    <div className={styles.errorContainer}>
                      <div className={styles.error}>{errors.customerEmail}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.input_field}>
                <label htmlFor="customerPassword" className={styles.label}>
                  Password
                </label>
                <div className={styles.inputContainer}>
                  <input
                    type="password"
                    id="customerPassword"
                    name="customerPassword"
                    className={styles.input}
                    placeholder="your-$tr0ng_p4$$w0rd"
                    value={formData.customerPassword}
                    onChange={handleInputChange}
                  />
                  {errors.customerPassword && (
                    <div className={styles.errorContainer}>
                      <div className={styles.error}>
                        {errors.customerPassword}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.input_field}>
                <label
                  htmlFor="customerRepeatPassword"
                  className={styles.label}
                >
                  Repeat Password
                </label>
                <div className={styles.inputContainer}>
                  <input
                    type="password"
                    id="customerRepeatPassword"
                    name="customerRepeatPassword"
                    className={styles.input}
                    placeholder="your-$tr0ng_p4$$w0rd"
                    value={formData.customerRepeatPassword}
                    onChange={handleInputChange}
                  />
                  {errors.customerRepeatPassword && (
                    <div className={styles.errorContainer}>
                      <div className={styles.error}>
                        {errors.customerRepeatPassword}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {userType === "charity" && (
            <div id="charityFields" className={styles.userFields}>
              <div className={styles.input_field}>
                <label htmlFor="charityWebsite" className={styles.label}>
                  Website URL
                </label>
                <input
                  type="url"
                  id="charityWebsite"
                  name="charityWebsite"
                  className={styles.input}
                  placeholder="https://www.yourcharity.org"
                  value={formData.charityWebsite}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.input_field}>
                <label htmlFor="charityName" className={styles.label}>
                  Charity Name
                </label>
                <div className={styles.inputContainer}>
                  <input
                    type="text"
                    id="charityName"
                    name="charityName"
                    className={styles.input}
                    placeholder="Charity name"
                    value={formData.charityName}
                    onChange={handleInputChange}
                  />
                  {errors.charityName && (
                    <div className={styles.errorContainer}>
                      <div className={styles.error}>{errors.charityName}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.input_field}>
                <label htmlFor="charityDescription" className={styles.label}>
                  Input charity description
                </label>
                <input
                  type="text"
                  id="charityDescription"
                  name="charityDescription"
                  className={styles.input}
                  placeholder="Charity description"
                  value={formData.charityDescription}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.input_field}>
                <label htmlFor="charityPhone" className={styles.label}>
                  Phone Number
                </label>
                <div className={styles.inputContainer}>
                  <input
                    type="tel"
                    id="charityPhone"
                    name="charityPhone"
                    className={styles.input}
                    placeholder="123-456-7890"
                    value={formData.charityPhone}
                    onChange={handleInputChange}
                    inputMode="numeric"
                  />
                  {errors.charityPhone && (
                    <div className={styles.errorContainer}>
                      <div className={styles.error}>{errors.charityPhone}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.input_field}>
                <label htmlFor="charityAddress" className={styles.label}>
                  Address
                </label>
                <div className={styles.inputContainer}>
                  <input
                    type="text"
                    id="charityAddress"
                    name="charityAddress"
                    className={styles.input}
                    placeholder="Charity address"
                    value={formData.charityAddress}
                    onChange={handleInputChange}
                  />
                  {errors.charityAddress && (
                    <div className={styles.errorContainer}>
                      <div className={styles.error}>
                        {errors.charityAddress}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.input_field}>
                <label htmlFor="charityEmail" className={styles.label}>
                  Email
                </label>
                <div className={styles.inputContainer}>
                  <input
                    type="email"
                    id="charityEmail"
                    name="charityEmail"
                    className={styles.input}
                    placeholder="youremail@domain.com"
                    value={formData.charityEmail}
                    onChange={handleInputChange}
                  />
                  {errors.charityEmail && (
                    <div className={styles.errorContainer}>
                      <div className={styles.error}>{errors.charityEmail}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.input_field}>
                <label htmlFor="charityPassword" className={styles.label}>
                  Password
                </label>
                <div className={styles.inputContainer}>
                  <input
                    type="password"
                    id="charityPassword"
                    name="charityPassword"
                    className={styles.input}
                    placeholder="your-$tr0ng_p4$$w0rd"
                    value={formData.charityPassword}
                    onChange={handleInputChange}
                  />
                  {errors.charityPassword && (
                    <div className={styles.errorContainer}>
                      <div className={styles.error}>
                        {errors.charityPassword}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.input_field}>
                <label htmlFor="charityRepeatPassword" className={styles.label}>
                  Repeat Password
                </label>
                <div className={styles.inputContainer}>
                  <input
                    type="password"
                    id="charityRepeatPassword"
                    name="charityRepeatPassword"
                    className={styles.input}
                    placeholder="your-$tr0ng_p4$$w0rd"
                    value={formData.charityRepeatPassword}
                    onChange={handleInputChange}
                  />
                  {errors.charityRepeatPassword && (
                    <div className={styles.errorContainer}>
                      <div className={styles.error}>
                        {errors.charityRepeatPassword}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.input_field}>
                <label htmlFor="charityImage" className={styles.label}>
                  Upload Charity Logo
                </label>
                <input
                  type="file"
                  id="charityImage"
                  name="charityImage"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {errors.charityImage && (
                  <div className={styles.errorContainer}>
                    <div className={styles.error}>{errors.charityImage}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {(userType === "customer" || userType === "charity") && (
            <div className={styles.button_group}>
              <button type="submit" className={styles.form_button}>
                <span>Register</span>
              </button>
            </div>
          )}
        </form>
      </main>

      <Footer />
    </>
  );
}
