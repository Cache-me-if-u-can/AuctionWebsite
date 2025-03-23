import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./SearchAuctionsContent.module.css";
import AuctionListing from "../AuctionListing/AuctionListing";
import ViewToggle from "../ViewToggle/ViewToggle";
import { AuctionItem } from "../../types/AuctionItem/AuctionItem";

interface SearchAuctionsContentProps {
  filters: { category: string; conditions: string[]; charity: string };
  onFilterChange: (filters: {
    category: string;
    conditions: string[];
    charity: string;
  }) => void;
}

const SearchAuctionsContent: React.FC<SearchAuctionsContentProps> = ({
  filters,
  onFilterChange,
}) => {
  const [view, setView] = useState("list");
  const location = useLocation();
  const [auctions, setAuctions] = useState<AuctionItem[]>([]);

  useEffect(() => {
    // Get preselectedCharity from location state
    const state = location.state as { preselectedCharity?: string };

    // If there's a preselectedCharity and it's different from current filter
    if (
      state?.preselectedCharity &&
      filters.charity !== state.preselectedCharity
    ) {
      onFilterChange({
        ...filters,
        charity: state.preselectedCharity,
      });
    } else {
      // If no preselectedCharity or filters changed normally, fetch auctions
      fetchAuctions(filters);
    }
  }, [location, filters]);

  const fetchAuctions = async (filters: {
    category: string;
    conditions: string[];
    charity: string;
  }) => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8080/getSearchedAuctionItems",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(filters),
        },
      );

      if (response.ok) {
        const result: AuctionItem[] = await response.json();
        setAuctions(result);
      } else {
        console.error(`Unexpected error: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching auctions:", error);
    }
  };

  const handleViewChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setView(event.target.value);
  };

  return (
    <div className={styles.mainContent}>
      <ViewToggle view={view} onViewChange={handleViewChange} />
      <div className={view === "grid" ? styles.gridView : styles.listView}>
        {auctions.length > 0 ? (
          auctions.map((auction) => (
            <AuctionListing key={auction._id} {...auction} view={view} />
          ))
        ) : (
          <p>No auctions match your filters.</p>
        )}
      </div>
    </div>
  );
};

export default SearchAuctionsContent;
