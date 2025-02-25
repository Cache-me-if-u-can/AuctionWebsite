import React, { useState, useEffect } from "react";
import styles from "./SearchAuctionsContent.module.css";
import AuctionListing from "../AuctionListing/AuctionListing";
import ViewToggle from "../ViewToggle/ViewToggle";
import { AuctionItem } from "../../types/AuctionItem/AuctionItem";

export default function SearchAuctionsContent() {
  const [view, setView] = useState("list"); // Ensure initial state is 'list'
  const [auctions, setAuctions] = useState<AuctionItem[]>([]);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8080/getAuctionItems", {
          method: "GET",
        });

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

    fetchAuctions();
  }, []);

  const handleViewChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setView(event.target.value);
  };

  return (
    <div className={styles.mainContent}>
      <ViewToggle view={view} onViewChange={handleViewChange} />
      <div className={view === "grid" ? styles.gridView : styles.listView}>
        {auctions.map((auction) => (
          <AuctionListing key={auction._id} view={view} {...auction} />
        ))}
      </div>
    </div>
  );
}

