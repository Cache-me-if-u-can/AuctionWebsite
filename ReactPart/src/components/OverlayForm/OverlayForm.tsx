import React, { useState } from 'react';
import styles from './OverlayForm.module.css';

interface OverlayFormProps {
  onClose: () => void;
  onSubmit: (listing: ListingData) => void;
}

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

const OverlayForm: React.FC<OverlayFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState<ListingData>({
    title: '',
    charity: '',
    description: '',
    status: 'live',
    category: '',
    auctionDue: '',
    bid: 0,
    image: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement & HTMLTextAreaElement & HTMLSelectElement;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    // Optionally reset the form
    setFormData({
      title: '',
      charity: '',
      description: '',
      status: 'live',
      category: '',
      auctionDue: '',
      bid: 0,
      image: null,
    });
  };

  return (
    <div id="overlayForm" className={styles.overlay}>
      <div className={styles.overlay_content}>
        <span className={styles.close_button} id="closeButton" onClick={onClose}>
          &times;
        </span>
        <h2>Add New Listing</h2>
        <form id="addListingForm" className={styles.addListingForm} onSubmit={handleSubmit}>
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" name="title" value={formData.title} required onChange={handleChange} />

          <label htmlFor="charity">Charity:</label>
          <input type="text" id="charity" name="charity" value={formData.charity} required onChange={handleChange} />

          <label htmlFor="description">Description:</label>
          <textarea id="description" name="description" value={formData.description} required onChange={handleChange}></textarea>

          <label htmlFor="status">Status:</label>
          <select id="status" name="status" value={formData.status} required onChange={handleChange}>
            <option value="live">Live/In Progress</option>
            <option value="complete">Complete</option>
            <option value="hidden">Hidden</option>
          </select>

          <label htmlFor="category">Category:</label>
          <input type="text" id="category" name="category" value={formData.category} required onChange={handleChange} />

          <label htmlFor="auctionDue">Auction Ends:</label>
          <input type="datetime-local" id="auctionDue" name="auctionDue" value={formData.auctionDue} required onChange={handleChange} />

          <label htmlFor="bid">Starting Bid:</label>
          <input type="number" id="bid" name="bid" value={formData.bid} required onChange={handleChange} />

          <label htmlFor="image">Image:</label>
          <input type="file" id="image" name="image" onChange={handleChange} />

          <button type="submit">Add Listing</button>
        </form>
      </div>
    </div>
  );
};

export default OverlayForm;