import React, { useState } from 'react';
import ViewToggle from './../ViewToggle/ViewToggle';
import AddListingButton from './../AddListingButton/AddListingButton';
import OverlayForm from './../OverlayForm/OverlayForm';
import ManageableListing from '../ManageableListing/ManageableListing';
import styles from './ManageListingsContent.module.css';

interface ListingData {
    title: string;
    charity: string;
    description: string;
    status: string;
    category: string;
    auctionDue: string;
    bid: number;
    image: File | null;
  }

const ManageListingsContent: React.FC = () => {
    const [view, setView] = useState('list');
    const [isOverlayVisible, setOverlayVisible] = useState(false);
    const [listings, setListings] = useState<ListingData[]>([]);

    const handleViewChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setView(event.target.value);
    };
  
    const toggleOverlay = () => {
      setOverlayVisible(!isOverlayVisible);
    };
    const handleAddListing = (newListing: ListingData) => {
        setListings((prevListings) => [...prevListings, newListing]);
        };
  
    return (
      
      <div className={styles.mainContent} id="listing_container">
      <ViewToggle view={view} onViewChange={handleViewChange} />
      <AddListingButton onClick={toggleOverlay} />
      {isOverlayVisible && <OverlayForm onClose={toggleOverlay} onSubmit={handleAddListing} />}
      <div id={styles.listings_container} className={view === 'grid' ? styles.gridView : styles.listView}>
        {listings.map((listing, index) => (
          <ManageableListing key={index} view={view} {...listing} />
        ))}
      </div>
    </div>
    );
  };
  
  export default ManageListingsContent;