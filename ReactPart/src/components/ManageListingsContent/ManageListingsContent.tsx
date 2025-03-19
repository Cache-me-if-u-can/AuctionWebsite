import React, { useState, useEffect } from "react";
import ViewToggle from "./../ViewToggle/ViewToggle";
import AddListingButton from "./../AddListingButton/AddListingButton";
import OverlayForm from "./../OverlayForm/OverlayForm";
import ManageableListing from "../ManageableListing/ManageableListing";
import styles from "./ManageListingsContent.module.css";
import { AuctionItem } from "../../types/AuctionItem/AuctionItem";

const ManageListingsContent: React.FC = () => {
  const [view, setView] = useState("list");
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [isEditOverlayVisible, setIsEditOverlayVisible] = useState(false);
  const [editingListing, setEditingListing] = useState<AuctionItem | null>(
    null
  );
  const [listings, setListings] = useState<AuctionItem[]>([]);

  useEffect(() => {
    const fetchAuctionItems = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8080/getCharityAuctionItems",
          {
            method: "GET",
            credentials: "include", // Include cookies for JWT authentication
          }
        );

        if (response.ok) {
          const result: AuctionItem[] = await response.json();
          setListings(result);
        } else {
          console.error(`Unexpected error: ${response.statusText}`);
        }
      } catch (error) {
        console.error("Error fetching auction items:", error);
      }
    };

    fetchAuctionItems();
  }, []);

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

  return (
    <div className={styles["listing-container"]}>
      <div className={styles.mainContent}>
        <div className={styles.listingControls}>
          <ViewToggle view={view} onViewChange={handleViewChange} />
          <AddListingButton onClick={toggleOverlay} />
        </div>

        <div
          className={`${styles.listingsWrapper} ${
            view === "grid" ? styles.gridView : ""
          }`}
        >
          {listings.map((listing) => (
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
