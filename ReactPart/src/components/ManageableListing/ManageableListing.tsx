import React from 'react';
import styles from './ManageableListing.module.css';

interface ManageableListingProps {
  title: string;
  charity: string;
  description: string;
  status: string;
  category: string;
  auctionDue: string;
  bid: number;
  image: File | null;
  view: string;
}

const ManageableListing: React.FC<ManageableListingProps> = ({
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
        </div>
      </div>
      <div className={styles.managementTools}>
        <a className={styles.editListing}>Edit</a>
        <a className={styles.deleteListing}>Delete</a>
        <a className={styles.exportMailList}>Export Mailing list</a>
        <a className={styles.viewBidders}>View Bidders</a>
        <a className={styles.viewBids}>View Bids</a>
      </div>
    </div>
  );
};

export default ManageableListing;