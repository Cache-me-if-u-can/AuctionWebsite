import React from 'react';
import styles from './AddListingButton.module.css';

interface AddListingButtonProps {
  onClick: () => void;
}

const AddListingButton: React.FC<AddListingButtonProps> = ({ onClick }) => {
  return (
    <div className={styles.addListing}>
      <a href="#" id="addListingButton" onClick={onClick}>
        {' '}
        + Add Listing
      </a>
    </div>
  );
};

export default AddListingButton;