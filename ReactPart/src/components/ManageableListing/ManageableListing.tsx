import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ManageableListing.module.css';
import { AuctionItem } from '../../types/AuctionItem/AuctionItem';

interface ManageableListingProps extends AuctionItem {
  view: string;
}

const ManageableListing: React.FC<ManageableListingProps> = ({
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
  const navigate = useNavigate();
  const imageUrl = image ? URL.createObjectURL(new Blob([image])) : '';

  const viewListing = () => {
    navigate(`/listing/${title}`, { state: { listing: { title, charityId, status, categoryId, auctionEndDate, currentPrice, image } } });
  };

  return (
    <div className={view === 'grid' ? styles.gridView : styles.listView}>
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
      <div className={styles.managementTools}>
        <a className={styles.editListing}>Edit</a>
        <a className={styles.deleteListing}>Delete</a>
        <a className={styles.exportMailList}>Export Mailing list</a>
        <a className={styles.viewBidders}>View Bidders</a>
        <a className={styles.viewListing} onClick={viewListing}>View Listing</a>
      </div>
    </div>
  );
};

export default ManageableListing;