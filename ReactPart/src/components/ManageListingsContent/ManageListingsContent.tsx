import React, { useState, useEffect } from "react";
import ViewToggle from "./../ViewToggle/ViewToggle";
import AddListingButton from "./../AddListingButton/AddListingButton";
import OverlayForm from "./../OverlayForm/OverlayForm";
import ManageableListing from "../ManageableListing/ManageableListing";
import styles from "./ManageListingsContent.module.css";
import { AuctionItem } from "../../types/AuctionItem/AuctionItem";
import { processAuctionStatuses } from "../../utils/auctionUtils";

type SortType = "endDate" | "currentBid";
type SortDirection = "asc" | "desc";

const ManageListingsContent: React.FC = () => {
  const [view, setView] = useState("list");
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [isEditOverlayVisible, setIsEditOverlayVisible] = useState(false);
  const [editingListing, setEditingListing] = useState<AuctionItem | null>(
    null,
  );
  const [listings, setListings] = useState<AuctionItem[]>([]);
  const [sortBy, setSortBy] = useState<SortType>("endDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  useEffect(() => {
    const fetchAuctionItems = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8080/getCharityAuctionItems",
          {
            method: "GET",
            credentials: "include", // Include cookies for JWT authentication
          },
        );

        if (response.ok) {
          const result: AuctionItem[] = await response.json();
          const processedAuctions = await processAuctionStatuses(result);
          setListings(processedAuctions);
        } else {
          console.error(`Unexpected error: ${response.statusText}`);
        }
      } catch (error) {
        console.error("Error fetching auction items:", error);
      }
    };

    fetchAuctionItems();
  }, []);

  useEffect(() => {
    const statusCheckInterval = setInterval(async () => {
      if (!listings) return;
      const updatedAuctions = await processAuctionStatuses(listings);
      if (JSON.stringify(listings) !== JSON.stringify(updatedAuctions)) {
        setListings(updatedAuctions);
      }
    }, 60000);

    return () => clearInterval(statusCheckInterval);
  }, [listings]);

  const handleViewChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setView(event.target.value);
  };

  const toggleOverlay = () => {
    setOverlayVisible(!isOverlayVisible);
  };

  const handleAddListing = (newListing: AuctionItem) => {
    setListings((prevListings) => [...prevListings, newListing]);
  };

  const handleEditStart = (listing: AuctionItem) => {
    setEditingListing(listing);
    setIsEditOverlayVisible(true);
  };

  const handleEditComplete = (updatedListing: AuctionItem) => {
    setIsEditOverlayVisible(false);
    setEditingListing(null);
    // Optionally update the listings state here instead of reloading the page
  };

  const getSortedAuctions = (auctions: AuctionItem[]) => {
    switch (sortBy) {
      case "endDate":
        return [...auctions].sort((a, b) => {
          const comparison =
            new Date(a.auctionEndDate).getTime() -
            new Date(b.auctionEndDate).getTime();
          return sortDirection === "asc" ? comparison : -comparison;
        });
      case "currentBid":
        return [...auctions].sort((a, b) => {
          const comparison = a.currentPrice - b.currentPrice;
          return sortDirection === "asc" ? comparison : -comparison;
        });
      default:
        return auctions;
    }
  };

  return (
    <div className={styles["listing-container"]}>
      <div className={styles.mainContent}>
        <div className={styles.listingControls}>
          <ViewToggle view={view} onViewChange={handleViewChange} />
          <AddListingButton onClick={toggleOverlay} />
          <div className={styles.sortControls}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className={styles.sortSelect}
            >
              <option value="endDate">Sort by End Date</option>
              <option value="currentBid">Sort by Current Bid</option>
            </select>
            <select
              value={sortDirection}
              onChange={(e) =>
                setSortDirection(e.target.value as SortDirection)
              }
              className={styles.sortSelect}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        <div
          className={`${styles.listingsWrapper} ${
            view === "grid" ? styles.gridView : ""
          }`}
        >
          {getSortedAuctions(listings).map((listing) => (
            <ManageableListing
              key={listing._id}
              view={view}
              {...listing}
              onEditClick={() => handleEditStart(listing)}
            />
          ))}
        </div>

        {isOverlayVisible && (
          <OverlayForm onClose={toggleOverlay} onSubmit={handleAddListing} />
        )}

        {isEditOverlayVisible && editingListing && (
          <OverlayForm
            onClose={() => setIsEditOverlayVisible(false)}
            onSubmit={handleEditComplete}
            initialData={editingListing}
            isEditing={true}
          />
        )}
      </div>
    </div>
  );
};

export default ManageListingsContent;
