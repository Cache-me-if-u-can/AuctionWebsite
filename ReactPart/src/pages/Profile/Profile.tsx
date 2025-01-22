import { useEffect, useState } from "react";
import styles from "./Profile.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { useUser } from "../../context/UserProvider";

export default function Profile() {
  const { signOut } = useUser();

  const [formData, setFormData] = useState({
    userType: "",

    customerId: "",
    customerName: "",
    customerLastName: "",
    customerDOB: "",
    customerPhone: "",
    customerAddress: "",
    customerEmail: "",
    customerPassword: "",

    charityId: "",
    charityName: "",
    charityDescription: "",
    charityPhone: "",
    charityAddress: "",
    charityEmail: "",
    charityPassword: "",
    charityImage: "",
  });

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
            ["userType"]: result.userType,

            ["customerId"]: result._id,
            ["customerName"]: result.name,
            ["customerLastName"]: result.surname,
            ["customerDOB"]: result.dateOfBirth,
            ["customerEmail"]: result.email,
            ["customerPhone"]: result.phoneNum,
            ["customerPassword"]: result.password,
            ["customerAddress"]: result.address,
          }));
        }
        if (result.userType === "charity") {
          setFormData((prevData) => ({
            ...prevData,
            ["userType"]: result.userType,

            ["charityId"]: result._id,
            ["charityName"]: result.name,
            ["charityDescription"]: result.description,
            ["charityPhone"]: result.phoneNum,
            ["charityAddress"]: result.address,
            ["charityEmail"]: result.email,
            ["charityPassword"]: result.password,
            ["charityImage"]: result.imageData,
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

  return (
    <>
      <Header />

      <main className={styles.main}>
        <div className={styles.user_info_container}>
          <div className={styles.user_info_header}>
            <img
              src={formData.charityImage}
              alt={`${formData.userType} image`}
            />
            <h2>
              {formData.userType === "customer"
                ? formData.customerName
                : formData.charityName}
            </h2>
          </div>
          <div className={styles.user_info_details}>
            {formData.userType === "customer" && (
              <>
                <p>
                  <strong>ID:</strong> {formData.customerId}
                </p>
                <p>
                  <strong>Last Name:</strong> {formData.customerLastName}
                </p>
                <p>
                  <strong>Date of Birth:</strong> {formData.customerDOB}
                </p>
                <p>
                  <strong>Phone:</strong> {formData.customerPhone}
                </p>
                <p>
                  <strong>Address:</strong> {formData.customerAddress}
                </p>
                <p>
                  <strong>Email:</strong> {formData.customerEmail}
                </p>
                <p className={styles.password}>
                  <strong>Password:</strong> {formData.customerPassword}
                </p>
              </>
            )}
            {formData.userType === "charity" && (
              <>
                <p>
                  <strong>ID:</strong> {formData.charityId}
                </p>
                <p>
                  <strong>Phone:</strong> {formData.charityPhone}
                </p>
                <p>
                  <strong>Address:</strong> {formData.charityAddress}
                </p>
                <p>
                  <strong>Email:</strong> {formData.charityEmail}
                </p>
                <p>
                  <strong>Description:</strong> {formData.charityDescription}
                </p>
                <p className="password">
                  <strong>Password:</strong> {formData.charityPassword}
                </p>
              </>
            )}
          </div>
        </div>

        {(formData.userType == "customer" ||
          formData.userType == "charity") && (
          <button onClick={signOut} className={styles.signOut_button}>
            Sign out
          </button>
        )}
      </main>

      <Footer />
    </>
  );
}
