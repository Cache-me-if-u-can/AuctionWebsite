import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AuctionListing.module.css";
import { AuctionItem } from "../../types/AuctionItem/AuctionItem";
import { formatDateString } from "../../utils/timeUtils";

interface AuctionListingProps extends Omit<AuctionItem, "_id"> {
  _id?: string;
  view: string;
}

const AuctionListing: React.FC<AuctionListingProps> = ({
  _id,
  title,
  charityId,
  description,
  status,
  categoryId,
  auctionStartDate,
  auctionEndDate,
  currentPrice,
  image,
  view,
}) => {
  const isAuctionEnded =
    new Date(auctionEndDate) < new Date() || status === "completed";

  const navigate = useNavigate();

  const viewListing = () => {
    navigate(`/listing/${_id}`, {
      state: {
        listing: {
          _id,
          title,
          charityId,
          description,
          status,
          categoryId,
          auctionStartDate,
          auctionEndDate,
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
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error rendering image:", error);
      return null;
    }
  };

  return (
    <div
      className={`${styles.listing} ${
        view === "grid" ? styles.gridItem : styles.listItem
      }`}
    >
      {renderImage()}
      <div className={styles.listingContent}>
        <h3>{title}</h3>
        <p>Charity: {charityId}</p>
        <p className={styles.status}>Status: {status}</p>
        <p>Description: {description}</p>
        <p>Category: {categoryId}</p>
        <div className={styles.auctionDetails}>
          <p>Auction Starts: {formatDateString(auctionStartDate)}</p>
          <p>Auction Ends: {formatDateString(auctionEndDate)}</p>
          <h1 className={styles.bid}>Current bid: £{currentPrice}</h1>
          {isAuctionEnded ? (
            <p className={styles.auctionEnded}>Auction Ended</p>
          ) : (
            <button className={styles.bidButton} onClick={viewListing}>
              Place Bid
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuctionListing;
