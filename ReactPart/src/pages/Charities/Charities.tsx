import React, { useEffect, useState } from "react";
import styles from "./Charities.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Charity from "../../components/Charity/Charity";

interface CharityData {
  id: string;
  name: string;
  description: string;
  phone: string;
  address: string;
  email: string;
  password: string;
  image: string;
}

export default function Charities() {
  const [charityData, setCharityData] = useState<CharityData[]>([]);

  async function requestingCharities() {
    try {
      const response = await fetch("http://127.0.0.1:8080/getCharitiesList", {
        method: "GET",
      });

      if (response.ok) {
        const result: any[] = await response.json();
        const formattedData = result.map((charity: any) => ({
          id: charity._id,
          name: charity.name,
          description: charity.description,
          phone: charity.phoneNum,
          address: charity.address,
          email: charity.email,
          password: charity.password,
          image: charity.image,
        }));
        setCharityData(formattedData);
        console.log(formattedData);
      } else if (response.status === 401) {
      } else {
        console.error(`Unexpected error: ${response.statusText}`);
      }
    } catch (error) {
      console.error("An error occurred while fetching a request");
    }
  }

  useEffect(() => {
    requestingCharities();
  }, []);

  return (
    <>
      <Header />
      <div className={styles.charityList}>
        {charityData.map((charity) => (
          <Charity
            key={charity.id}
            name={charity.name}
            location={charity.address}
            description={charity.description}
            logo={charity.image}
          />
        ))}
      </div>
      <Footer />
    </>
  );
}
