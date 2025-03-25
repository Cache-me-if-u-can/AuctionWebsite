import { useEffect, useState, MouseEvent } from "react";
import styles from "./Profile.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { useUser } from "../../context/UserProvider";
import BidDashboard from "./BidDashboard";
type ActiveTab = "profile" | "bids";

export default function Profile() {
  const { signOut, getCsrfToken } = useUser();
  const [activeTab, setActiveTab] = useState<ActiveTab>("profile");
  const [formData, setFormData] = useState({
    userType: "",

    customerId: "",
    customerName: "",
    customerLastName: "",
    customerDOB: "",
    customerEmail: "",
    customerPhone: "",
    customerPassword: "",
    customerImage: "",
    customerAddress: "",

    charityId: "",
    charityName: "",
    charityDescription: "",
    charityPhone: "",
    charityAddress: "",
    charityEmail: "",
    charityPassword: "",
    charityImage: "",

    newPassword: "",
    repeatNewPassword: "",
  });

  const [editProfileMode, setEditProfileMode] = useState(false);
  const [editPasswordMode, setEditPasswordMode] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  //TODO: maybe implement placeholder while user info in fetching

  async function jwtLogIn() {
    try {
      const response = await fetch("http://127.0.0.1:8080/getUserData", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        if (result.userType === "customer") {
          setFormData((prevData) => ({
            ...prevData,
            userType: result.userType,

            customerId: result._id,
            customerName: result.name,
            customerLastName: result.surname,
            customerDOB: result.dateOfBirth,
            customerEmail: result.email,
            customerPhone: result.phoneNum,
            customerPassword: result.password,
            customerImage: result.image,
            customerAddress: result.address,
          }));
        }
        if (result.userType === "charity") {
          setFormData((prevData) => ({
            ...prevData,
            userType: result.userType,

            charityId: result._id,
            charityName: result.name,
            charityEmail: result.email,
            charityPhone: result.phoneNum,
            charityPassword: result.password,
            charityImage: result.image,
            charityAddress: result.address,
            charityDescription: result.description,
          }));
        }
      } else if (response.status === 401) {
      } else {
        console.error(`Unexpected error: ${response.statusText}`);
      }
    } catch (error) {
      console.error("An error occurred while fetching a request");
    }
  }

  useEffect(() => {
    jwtLogIn();
  }, []);

  const handleChange = (
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
        canvas.width = 128;
        canvas.height = 128;
        ctx.drawImage(img, 0, 0, 128, 128);
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

  const validateProfile = () => {
    let newErrors: { [key: string]: string } = {};

    const today = new Date().toISOString().split("T")[0];

    // Check for customer fields
    if (formData.userType === "customer") {
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
    }

    // Check for charity fields
    if (formData.userType === "charity") {
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
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    let newErrors: { [key: string]: string } = {};

    if (editPasswordMode) {
      if (!formData.newPassword) {
        newErrors.newPassword = "Password is required";
      } else if (formData.newPassword.length < 8) {
        newErrors.newPassword = "Password is too weak";
      }
      if (formData.newPassword !== formData.repeatNewPassword) {
        newErrors.repeatNewPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    let changes;
    if (editProfileMode && validateProfile()) {
      setEditProfileMode(false);
      if (formData.userType === "customer") {
        changes = {
          customerImage: formData.customerImage,
          customerId: formData.customerId,
          customerName: formData.customerName,
          customerLastName: formData.customerLastName,
          customerDOB: formData.customerDOB,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          customerAddress: formData.customerAddress,
          customerPassword: formData.customerPassword,
        };
      }
      if (formData.userType === "charity") {
        changes = {
          charityImage: formData.charityImage,
          charityId: formData.charityId,
          charityName: formData.charityName,
          charityEmail: formData.charityEmail,
          charityPhone: formData.charityPhone,
          charityAddress: formData.charityAddress,
          charityDescription: formData.charityDescription,
          charityPassword: formData.charityPassword,
        };
      }
      console.log(changes);
      console.log(getCsrfToken());
      try {
        const response = await fetch(
          `http://127.0.0.1:8080/${
            formData.userType === "customer"
              ? "updateCustomerProfile"
              : "updateCharityProfile"
          }`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRF-TOKEN": getCsrfToken() || "",
            },
            body: JSON.stringify(changes),
            credentials: "include",
          },
        );

        if (!response.ok) {
          const error = await response.json();
          alert(error.message);
          throw new Error(`Failed to update ${formData.userType} details`);
        }

        jwtLogIn();
      } catch (error) {
        console.error("Profile update error:", error);
        throw error;
      }
    }
    if (editPasswordMode && validatePassword()) {
      setEditPasswordMode(false);
      changes = {
        newPassword: formData.newPassword,
      };
      try {
        const response = await fetch(
          `http://127.0.0.1:8080/${
            formData.userType === "customer"
              ? "updateCustomerPassword"
              : "updateCharityPassword"
          }`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRF-TOKEN": getCsrfToken() || "",
            },
            body: JSON.stringify(changes),
            credentials: "include",
          },
        );

        if (!response.ok) {
          const error = await response.json();
          alert(error.message);
          throw new Error(`Failed to update ${formData.userType} details`);
        }

        jwtLogIn();
      } catch (error) {
        console.error("Password update error:", error);
        throw error;
      }
      console.log(changes);
    }
  }; //TODO: sent request to Flask and save changes

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.tab_navigation}>
          <button
            className={`${styles.tab_button} ${activeTab === "profile" ? styles.active : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile Information
          </button>
          {formData.userType === "customer" && (
            <button
              className={`${styles.tab_button} ${activeTab === "bids" ? styles.active : ""}`}
              onClick={() => setActiveTab("bids")}
            >
              My Bids
            </button>
          )}
        </div>

        {activeTab === "profile" || formData.userType === "charity" ? (
          <div className={styles.user_info_container}>
            <div className={styles.user_info_header}>
              <img
                src={
                  formData.charityImage ||
                  "./src/assets/images/profile_img_placeholder.png"
                }
                alt={`${formData.userType} image`}
              />
              {!editProfileMode ? (
                <h2>
                  {formData.userType === "customer"
                    ? formData.customerName
                    : formData.charityName}
                </h2>
              ) : (
                <h2>Edit Profile Mode</h2>
              )}
            </div>
            {editProfileMode && (
              <input
                className={styles.input}
                type="file"
                name="profileImage"
                id="profileImage"
                accept="image/*"
                onChange={handleImageChange}
              />
            )}
            <div className={styles.user_info_details}>
              {formData.userType === "customer" && (
                <>
                  {editProfileMode ? (
                    <p>
                      <strong>First name:</strong>
                      <div className={styles.inputContainer}>
                        <input
                          className={styles.input}
                          type="text"
                          name="customerName"
                          placeholder="First name"
                          value={formData.customerName}
                          onChange={handleChange}
                        />
                        {errors.customerName && (
                          <div className={styles.errorContainer}>
                            <div className={styles.error}>
                              {errors.customerName}
                            </div>
                          </div>
                        )}
                      </div>
                    </p>
                  ) : null}
                  <p>
                    <strong>Last Name:</strong>
                    {editProfileMode ? (
                      <div className={styles.inputContainer}>
                        <input
                          className={styles.input}
                          type="text"
                          name="customerLastName"
                          value={formData.customerLastName}
                          placeholder="Last name"
                          onChange={handleChange}
                        />
                        {errors.customerLastName && (
                          <div className={styles.errorContainer}>
                            <div className={styles.error}>
                              {errors.customerLastName}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      formData.customerLastName
                    )}
                  </p>
                  <p>
                    <strong>Date Of Birth:</strong>
                    {editProfileMode ? (
                      <div className={styles.inputContainer}>
                        <input
                          className={styles.input}
                          type="date"
                          name="customerDOB"
                          value={formData.customerDOB}
                          onChange={handleChange}
                        />
                        {errors.customerDOB && (
                          <div className={styles.errorContainer}>
                            <div className={styles.error}>
                              {errors.customerDOB}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      formData.customerDOB
                    )}
                  </p>
                  <p>
                    <strong>Email:</strong>
                    {editProfileMode ? (
                      <div className={styles.inputContainer}>
                        <input
                          className={styles.input}
                          type="email"
                          name="customerEmail"
                          placeholder="youremail@domain.com"
                          value={formData.customerEmail}
                          onChange={handleChange}
                        />
                        {errors.customerEmail && (
                          <div className={styles.errorContainer}>
                            <div className={styles.error}>
                              {errors.customerEmail}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      formData.customerEmail
                    )}
                  </p>
                  <p>
                    <strong>Phone:</strong>
                    {editProfileMode ? (
                      <div className={styles.inputContainer}>
                        <input
                          className={styles.input}
                          type="tel"
                          name="customerPhone"
                          placeholder="123-456-7890"
                          value={formData.customerPhone}
                          onChange={handleChange}
                        />
                        {errors.customerPhone && (
                          <div className={styles.errorContainer}>
                            <div className={styles.error}>
                              {errors.customerPhone}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      formData.customerPhone
                    )}
                  </p>
                  <p>
                    <strong>Address:</strong>
                    {editProfileMode ? (
                      <div className={styles.inputContainer}>
                        <input
                          className={styles.input}
                          type="text"
                          name="customerAddress"
                          placeholder="Your address"
                          value={formData.customerAddress}
                          onChange={handleChange}
                        />
                        {errors.customerAddress && (
                          <div className={styles.errorContainer}>
                            <div className={styles.error}>
                              {errors.customerAddress}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      formData.customerAddress
                    )}
                  </p>
                </>
              )}
              {formData.userType === "charity" && (
                <>
                  {editProfileMode ? (
                    <p>
                      <strong>Charity Name:</strong>
                      <div className={styles.inputContainer}>
                        <input
                          className={styles.input}
                          type="text"
                          name="charityName"
                          placeholder="Charity name"
                          value={formData.charityName}
                          onChange={handleChange}
                        />
                        {errors.charityName && (
                          <div className={styles.errorContainer}>
                            <div className={styles.error}>
                              {errors.charityName}
                            </div>
                          </div>
                        )}
                      </div>
                    </p>
                  ) : null}
                  <p>
                    <strong>Email:</strong>
                    {editProfileMode ? (
                      <div className={styles.inputContainer}>
                        <input
                          className={styles.input}
                          type="email"
                          name="charityEmail"
                          placeholder="youremail@domain.com"
                          value={formData.charityEmail}
                          onChange={handleChange}
                        />
                        {errors.charityEmail && (
                          <div className={styles.errorContainer}>
                            <div className={styles.error}>
                              {errors.charityEmail}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      formData.charityAddress
                    )}
                  </p>
                  <p>
                    <strong>Phone:</strong>
                    {editProfileMode ? (
                      <div className={styles.inputContainer}>
                        <input
                          className={styles.input}
                          type="tel"
                          name="charityPhone"
                          placeholder="123-456-7890"
                          value={formData.charityPhone}
                          onChange={handleChange}
                        />
                        {errors.charityPhone && (
                          <div className={styles.errorContainer}>
                            <div className={styles.error}>
                              {errors.charityPhone}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      formData.charityPhone
                    )}
                  </p>
                  <p>
                    <strong>Address:</strong>
                    {editProfileMode ? (
                      <div className={styles.inputContainer}>
                        <input
                          className={styles.input}
                          type="text"
                          name="charityAddress"
                          placeholder="Charity address"
                          value={formData.charityAddress}
                          onChange={handleChange}
                        />
                        {errors.charityAddress && (
                          <div className={styles.errorContainer}>
                            <div className={styles.error}>
                              {errors.charityAddress}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      formData.charityAddress
                    )}
                  </p>
                  <p>
                    <strong>Description:</strong>
                    {editProfileMode ? (
                      <textarea
                        className={styles.input}
                        name="charityDescription"
                        value={formData.charityDescription}
                        rows={5}
                        onChange={handleChange}
                      />
                    ) : (
                      formData.charityDescription
                    )}
                  </p>
                </>
              )}
            </div>

            {editPasswordMode && (
              <div className={styles.password_section}>
                <p>
                  <strong>New Password:</strong>
                  <div className={styles.inputContainer}>
                    <input
                      className={styles.input}
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                    />
                    {errors.newPassword && (
                      <div className={styles.errorContainer}>
                        <div className={styles.error}>{errors.newPassword}</div>
                      </div>
                    )}
                  </div>
                </p>
                <p>
                  <strong>Repeat Password:</strong>
                  <div className={styles.inputContainer}>
                    <input
                      className={styles.input}
                      type="password"
                      name="repeatNewPassword"
                      value={formData.repeatNewPassword}
                      onChange={handleChange}
                    />
                    {errors.repeatNewPassword && (
                      <div className={styles.errorContainer}>
                        <div className={styles.error}>
                          {errors.repeatNewPassword}
                        </div>
                      </div>
                    )}
                  </div>
                </p>
              </div>
            )}

            <div className={styles.form_buttons}>
              {editProfileMode ? (
                <>
                  <button
                    className={styles.button}
                    type="button"
                    onClick={handleSave}
                  >
                    Save Profile
                  </button>
                  <button
                    className={styles.button}
                    type="button"
                    onClick={() => {
                      jwtLogIn();
                      setEditProfileMode(false);
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : !editPasswordMode ? (
                <button
                  className={styles.button}
                  type="button"
                  onClick={() => setEditProfileMode(true)}
                >
                  Edit Profile
                </button>
              ) : null}
              {editPasswordMode ? (
                <>
                  <button
                    className={styles.button}
                    type="button"
                    onClick={handleSave}
                  >
                    Save Password
                  </button>
                  <button
                    className={styles.button}
                    type="button"
                    onClick={() => {
                      formData.newPassword = "";
                      formData.repeatNewPassword = "";
                      setEditPasswordMode(false);
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : !editProfileMode ? (
                <button
                  className={styles.button}
                  type="button"
                  onClick={() => setEditPasswordMode(true)}
                >
                  Change Password
                </button>
              ) : null}
              {!editPasswordMode && !editProfileMode && (
                <button onClick={signOut} className={styles.button}>
                  Sign out
                </button>
              )}
            </div>
          </div>
        ) : (
          <BidDashboard />
        )}
      </main>

      <Footer />
    </>
  );
}
