import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ManageableListing.module.css";
import { AuctionItem } from "../../types/AuctionItem/AuctionItem";
import OverlayForm from "../OverlayForm/OverlayForm";
import ConfirmDelete from "../ConfirmDelete/ConfirmDelete";

interface ManageableListingProps extends AuctionItem {
  view: string;
}

const ManageableListing: React.FC<ManageableListingProps> = ({
  _id,
  title,
  description,
  startingPrice,
  currentPrice,
  image,
  auctionStartDate,
  auctionEndDate,
  categoryId,
  charityId,
  status,
  view,
}) => {
  const [isEditOverlayVisible, setIsEditOverlayVisible] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const navigate = useNavigate();
  const imageUrl = image ? URL.createObjectURL(new Blob([image])) : "";

  const toggleEditOverlay = () => {
    setIsEditOverlayVisible(!isEditOverlayVisible);
  };

  const handleEditSubmit = async (updatedListing: AuctionItem) => {
    try {
      console.log("Submitting updated listing:", updatedListing);

      const response = await fetch("http://127.0.0.1:8080/updateAuctionItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...updatedListing,
          _id: _id, // Ensure we're passing the correct ID
        }),
      });

      console.log("Update response status:", response.status);

      if (response.ok) {
        console.log("Update successful");
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error("Failed to update listing:", errorData);
        alert(errorData.message || "Failed to update listing");
      }
    } catch (error) {
      console.error("Error updating listing:", error);
      alert("An error occurred while updating the listing");
    }

    setIsEditOverlayVisible(false);
  };

  // View the listing details
  const viewListing = () => {
    navigate(`/listing/${charityId}/${categoryId}/${_id}`, {
      state: {
        listing: {
          title,
          charityId,
          status,
          categoryId,
          description,
          auctionStartDate,
          auctionEndDate,
          startingPrice,
          currentPrice,
          image,
        },
      },
    });
  };

  return (
    <div className={view === "grid" ? styles.gridView : styles.listView}>
      {isEditOverlayVisible && (
        <OverlayForm
          onClose={toggleEditOverlay}
          onSubmit={handleEditSubmit}
          initialData={{
            _id, // Add this
            title,
            description,
            startingPrice,
            currentPrice,
            image,
            auctionStartDate,
            auctionEndDate,
            categoryId,
            charityId,
            status,
          }}
          isEditing={true}
        />
      )}
      <img src={imageUrl} alt={title} className={styles.image} />
      <div className={styles.details}>
        <h3>{title}</h3>
        <p>{description}</p>
        <p>Starting Price: ${startingPrice}</p>
        <p>Current Price: ${currentPrice}</p>
        <p>Start Date: {new Date(auctionStartDate).toLocaleString()} </p>
        <p>End Date: {new Date(auctionEndDate).toLocaleString()}</p>
        <p>Status: {status}</p>
      </div>
      <ConfirmDelete
        isVisible={isDeleteConfirmVisible}
        itemId={_id || ""} // Add default empty string if _id is undefined
        onClose={() => setIsDeleteConfirmVisible(false)}
        onConfirm={() => {
          setIsDeleteConfirmVisible(false);
          // Optionally trigger a callback to parent component for refresh
          window.location.reload();
        }}
      />
      <div className={styles.managementTools}>
        <a className={styles.editListing} onClick={toggleEditOverlay}>
          Edit
        </a>
        <a
          className={styles.deleteListing}
          onClick={() => setIsDeleteConfirmVisible(true)}
        >
          Delete
        </a>
        <a className={styles.exportMailList}>Export Mailing list</a>
        <a className={styles.viewBidders}>View Bidders</a>
        <a className={styles.viewListing} onClick={viewListing}>
          View Listing
        </a>
      </div>
    </div>
  );
};

export default ManageableListing;
