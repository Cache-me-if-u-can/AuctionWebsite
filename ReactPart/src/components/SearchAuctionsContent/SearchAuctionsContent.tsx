import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./SearchAuctionsContent.module.css";
import AuctionListing from "../AuctionListing/AuctionListing";
import ViewToggle from "../ViewToggle/ViewToggle";
import { AuctionItem } from "../../types/AuctionItem/AuctionItem";
import { processAuctionStatuses } from "../../utils/auctionUtils";

interface SearchAuctionsContentProps {
  filters: { category: string; conditions: string[]; charity: string };
  onFilterChange: (filters: {
    category: string;
    conditions: string[];
    charity: string;
  }) => void;
}
type SortType = "endDate" | "currentBid";

const SearchAuctionsContent: React.FC<SearchAuctionsContentProps> = ({
  filters,
  onFilterChange,
}) => {
  const [view, setView] = useState("list");
  const [sortBy, setSortBy] = useState<sortType>("endDate");
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

  useEffect(() => {
    const statusCheckInterval = setInterval(async () => {
      if (!auctions) return;
      const updatedAuctions = await processAuctionStatuses(auctions);
      if (JSON.stringify(auctions) !== JSON.stringify(updatedAuctions)) {
        setAuctions(updatedAuctions);
      }
    }, 60000);

    return () => clearInterval(statusCheckInterval);
  }, [auctions]);

  const getSortedAuctions = (auctions: AuctionItem[]) => {
    const visibleAuctions = auctions.filter(
      (auction) => auction.status !== "hidden",
    );

    switch (sortBy) {
      case "endDate":
        return [...visibleAuctions].sort(
          (a, b) =>
            new Date(a.auctionEndDate).getTime() -
            new Date(b.auctionEndDate).getTime(),
        );
      case "currentBid":
        return [...visibleAuctions].sort(
          (a, b) => b.currentPrice - a.currentPrice,
        );
      default:
        return visibleAuctions;
    }
  };

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
        // Update status for each item based on auction end date
        const processedAuctions = await processAuctionStatuses(result);
        setAuctions(processedAuctions);
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

  const visibleAuctions = auctions.filter(
    (auction) => auction.status !== "hidden",
  );

  return (
    <div className={styles.mainContent}>
      <div className={styles.controls}>
        <ViewToggle view={view} onViewChange={handleViewChange} />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortType)}
          className={styles.sortSelect}
        >
          <option value="endDate">Sort by End Date</option>
          <option value="currentBid">Sort by Current Bid</option>
        </select>
      </div>
      <div className={view === "grid" ? styles.gridView : styles.listView}>
        {getSortedAuctions(auctions).length > 0 ? (
          getSortedAuctions(auctions).map((auction) => (
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
