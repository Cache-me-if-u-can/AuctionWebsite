import React, { useEffect, useState } from "react";
import { useUser } from "../../context/UserProvider";
import styles from "./SearchAuctions.module.css";
import Header from "../../components/Header/Header";
import AuctionBanner from "../../components/auctionBanner/auctionBanner";
import Sidebar from "../../components/Sidebar/Sidebar";
import SearchAuctionsContent from "../../components/SearchAuctionsContent/SearchAuctionsContent";
import ManageListingsContent from "../../components/ManageListingsContent/ManageListingsContent";
import QuizPopup from "../../components/QuizPopup/QuizPopup";
import { useLocation } from "react-router-dom";

const SearchAuctions: React.FC = () => {
  const { getUserType } = useUser();
  const userType = getUserType();
  const [filters, setFilters] = useState({
    category: "all",
    conditions: [],
    charity: "all",
    searchTerm: "",
  });

  const handleFilterChange = (newFilters: {
    category: string;
    conditions: string[];
    charity: string;
    searchTerm: string;
  }) => {
    setFilters(newFilters);
  };

  const [showQuizPopup, setShowQuizPopup] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const preselected = location.state?.preselectedCharity;
    if (preselected && preselected !== "all") {
      setFilters((prev) => ({ ...prev, charity: preselected }));
      setShowQuizPopup(true); // show popup from charity click
    }
  }, [location.state]);

  // When user applies filters via sidebar
  useEffect(() => {
    if (filters.charity !== "all") {
      setShowQuizPopup(true);
    }
  }, [filters.charity]);

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
              searchTerm: filters.searchTerm,
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
      {showQuizPopup && filters.charity !== "all" && (
        <QuizPopup
          charityName={filters.charity}
          onClose={() => setShowQuizPopup(false)}
        />
      )}
    </div>
  );
};

export default SearchAuctions;
