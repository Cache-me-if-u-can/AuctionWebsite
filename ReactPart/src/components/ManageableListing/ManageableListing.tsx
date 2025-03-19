import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ManageableListing.module.css";
import { AuctionItem } from "../../types/AuctionItem/AuctionItem";
import ConfirmDelete from "../ConfirmDelete/ConfirmDelete";

interface ManageableListingProps extends AuctionItem {
  view: string;
  onEditClick: () => void;
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
  onEditClick,
}) => {
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const navigate = useNavigate();
  const imageUrl = image ? URL.createObjectURL(new Blob([image])) : "";

  // View the listing details
  const viewListing = () => {
    navigate(`/listing/${_id}`, {
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

  const renderImage = () => {
    try {
      if (image instanceof Blob) {
        return (
          <img
            src={URL.createObjectURL(image)}
            alt={title}
            className={styles.listingImage}
          />
        );
      } else if (typeof image === "string") {
        return <img src={image} alt={title} className={styles.listingImage} />;
      }
      return null;
    } catch (error) {
      console.error("Error rendering image:", error);
      return null;
    }
  };

  return (
    <div
      className={`${styles.listing} ${
        view === "grid" ? styles.gridView : styles.listView
      }`}
    >
      {renderImage()}
      <div className={styles.details}>
        <h3>{title}</h3>
        <p className={styles.status}>Status: {status}</p>
        <p>Category: {categoryId}</p>
        <p>{description}</p>
        <div className={styles.auctionDetails}>
          <p>Starting Price: ${startingPrice}</p>
          <p>Current Price: ${currentPrice}</p>
          <p>Start Date: {new Date(auctionStartDate).toLocaleString()} </p>
          <p>End Date: {new Date(auctionEndDate).toLocaleString()}</p>
        </div>
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
        <a className={styles.viewListing} onClick={viewListing}>
          Listing
        </a>
        <a className={styles.viewBidders}>Bidders</a>
        <a className={styles.editListing} onClick={onEditClick}>
          Edit
        </a>
        <a
          className={styles.deleteListing}
          onClick={() => setIsDeleteConfirmVisible(true)}
        >
          Delete
        </a>
      </div>
    </div>
  );
};

export default ManageableListing;
