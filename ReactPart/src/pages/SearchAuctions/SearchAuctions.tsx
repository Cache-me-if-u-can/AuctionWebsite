import React, { useState } from "react";
import { useUser } from "../../context/UserProvider";
import styles from "./SearchAuctions.module.css";
import Header from "../../components/Header/Header";
import AuctionBanner from "../../components/auctionBanner/auctionBanner";
import Sidebar from "../../components/Sidebar/Sidebar";
import SearchAuctionsContent from "../../components/SearchAuctionsContent/SearchAuctionsContent";
import ManageListingsContent from "../../components/ManageListingsContent/ManageListingsContent";

const SearchAuctions: React.FC = () => {
  const { getUserType } = useUser();
  const userType = getUserType();
  const [filters, setFilters] = useState({
    category: "all",
    conditions: [],
    charity: "all",
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className={styles.container}>
      <Header />
      <AuctionBanner />
      <div className={styles.content}>
        <Sidebar onFilterChange={handleFilterChange} />
        {userType === "charity" ? (
          <ManageListingsContent
            filters={{
              category: filters.category,
              conditions: filters.conditions,
            }}
            onFilterChange={(newFilters) =>
              handleFilterChange({
                ...filters,
                ...newFilters,
              })
            }
          />
        ) : (
          <SearchAuctionsContent
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        )}
      </div>
    </div>
  );
};

export default SearchAuctions;
