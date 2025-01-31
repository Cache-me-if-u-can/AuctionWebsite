import React from 'react';
import styles from './AuctionListing.module.css';
import { AuctionItem } from '../../types/AuctionItem/AuctionItem';

interface AuctionListingProps extends Omit<AuctionItem, 'id'> {
  view: string;
}
 //Auction Listing component for displaying auction items/ and take user to listing page
const AuctionListing: React.FC<AuctionListingProps> = ({
  title,
  charity,
  description,
  status,
  category,
  auctionDue,
  bid,
  image,
  view,
}) => {
  return (
    <div className={`${styles.listing} ${view === 'grid' ? styles.gridItem : styles.listItem}`}>
      {image && <img src={URL.createObjectURL(image)} alt={title} className={styles.listingImage} />}
      <div className={styles.listingContent}>
        <h3>{title}</h3>
        <p>Charity: {charity}</p>
        <p className={styles.status}>Status: {status}</p>
        <p>Description: {description}</p>
        <p>Category: {category}</p>
        <div className={styles.auctionDetails}>
          <p>Auction Ends: {auctionDue}</p>
          <h1 className={styles.bid}>Current bid: £{bid}</h1>
          <button className={styles.bidButton}>Place Bid</button>
        </div>
        
      </div>
    </div>
  );
};

export default AuctionListing;