import React, { useState, useEffect } from "react";
import styles from "./SearchAuctionsContent.module.css";
import AuctionListing from "../AuctionListing/AuctionListing";
import Sidebar from "../Sidebar/Sidebar";
import ViewToggle from "../ViewToggle/ViewToggle";
import { AuctionItem } from "../../types/AuctionItem/AuctionItem";

export default function SearchAuctionsContent() {
  const [view, setView] = useState("list");
  const [auctions, setAuctions] = useState<AuctionItem[]>([]);

  useEffect(() => {
    fetchAuctions({ category: "all", conditions: [], charity: "all" });
  }, []);

  const fetchAuctions = async (filters: { category: string; conditions: string[]; charity: string }) => {
    try {
      const response = await fetch("http://127.0.0.1:8080/getSearchedAuctionItems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),  
      });
  
      if (response.ok) {
        const result: AuctionItem[] = await response.json();
        setAuctions(result);
      } else {
        console.error("Unexpected error: ${response.statusText}");
      }
    } catch (error) {
      console.error("Error fetching auctions:", error);
    }
  };

  const handleFilterChange = (filters: { category: string; conditions: string[]; charity: string }) => {
    console.log(filters);
    fetchAuctions(filters);
  };

  const handleViewChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setView(event.target.value);
  };

  console.log(styles);


  return (
    <div className={styles.mainContent}>
      <Sidebar onFilterChange={handleFilterChange} />
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
}