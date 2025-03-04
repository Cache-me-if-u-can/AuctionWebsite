import React from "react";
import { useUser } from "../../context/UserProvider";
import styles from "./SearchAuctions.module.css";
import Header from "../../components/Header/Header";
import AuctionBanner from "../../components/auctionBanner/auctionBanner";
//import Sidebar from "../../components/Sidebar/Sidebar";
import SearchAuctionsContent from "../../components/SearchAuctionsContent/SearchAuctionsContent";
import ManageListingsContent from "../../components/ManageListingsContent/ManageListingsContent";

const SearchAuctions: React.FC = () => {
  const { getUserType } = useUser();
  const userType = getUserType();

  return (
    <div className={styles.container}>
      <Header />
      <AuctionBanner />
      <div className={styles.content}>
        {userType === "charity" && <ManageListingsContent />}
        {userType === "customer" && <SearchAuctionsContent />}
        {!userType && <SearchAuctionsContent />}
      </div>
    </div>
  );
};

export default SearchAuctions;

