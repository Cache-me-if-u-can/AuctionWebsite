import React, { useState, useEffect } from 'react';
import styles from './OverlayForm.module.css';
import { AuctionItem } from '../../types/AuctionItem/AuctionItem';

interface OverlayFormProps {
  onClose: () => void;
  onSubmit: (listing: AuctionItem) => void;
}
//Overlay Form component that allows charity users to add a new listing
const OverlayForm: React.FC<OverlayFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState<Omit<AuctionItem, '_id' | 'currentPrice'>>({
    title: '',
    charityId: '',
    description: '',
    startingPrice: 0,
    status: 'live',
    categoryId: '',
    auctionStartDate: '',
    auctionEndDate: '',
    image: null,
  });
//Fetches user info to get the charity ID for user creation. 
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8080/getUserData', {
          method: 'GET',
          credentials: 'include', // Include cookies for JWT authentication
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Fetched user info:', result); // Add logging to debug
          if (result.userType === 'charity') {
            setFormData((prevData) => ({
              ...prevData,
              charityId: result._id,
            }));
          }
        } else {
          console.error(`Unexpected error: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);
//Handles changes to the form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement & HTMLTextAreaElement & HTMLSelectElement;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };
//Sets the start date of the auction to the current date and time
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const startDate = new Date(value);
    const now = new Date();
    const status = startDate > now ? 'hidden' : 'live';
    setFormData((prevData) => ({
      ...prevData,
      auctionStartDate: value,
      status,
    }));
  };
//Handles the form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Create a new AuctionItem object with a unique id and currentPrice set to startingPrice
    const newAuctionItem: AuctionItem = { ...formData, _id: Date.now().toString(), currentPrice: formData.startingPrice };

    console.log('Submitting new auction item:', newAuctionItem); // Add logging to debug

    try {
      const response = await fetch('http://127.0.0.1:8080/createAuctionItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAuctionItem),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Auction item created:', result);
        onSubmit(newAuctionItem);
        onClose();
      } else {
        console.error('Failed to create auction item:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating auction item:', error);
    }

    // Optionally reset the form data to its initial state
    setFormData({
      title: '',
      charityId: '',
      description: '',
      startingPrice: 0,
      status: 'live',
      categoryId: '',
      auctionStartDate: '',
      auctionEndDate: '',
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

          <label htmlFor="description">Description:</label>
          <textarea id="description" name="description" value={formData.description} required onChange={handleChange}></textarea>

          <label htmlFor="status">Status:</label>
          <select id="status" name="status" value={formData.status} required onChange={handleChange}>
            <option value="live">Live/In Progress</option>
            <option value="complete">Complete</option>
            <option value="hidden">Hidden</option>
          </select>

          <label htmlFor="category">Category:</label>
          <input type="text" id="category" name="categoryId" value={formData.categoryId} required onChange={handleChange} />

          <label htmlFor="auctionStartDate">Auction Starts:</label>
          <input type="datetime-local" id="auctionStartDate" name="auctionStartDate" value={formData.auctionStartDate} onChange={handleStartDateChange} />
          <label>
            <input type="checkbox" name="startNow" onChange={() => setFormData((prevData) => ({ ...prevData, auctionStartDate: new Date().toISOString().slice(0, 16), status: 'live' }))} />
            Start Now
          </label>

          <label htmlFor="auctionEndDate">Auction Ends:</label>
          <input type="datetime-local" id="auctionEndDate" name="auctionEndDate" value={formData.auctionEndDate} required onChange={handleChange} />

          <label htmlFor="bid">Starting Bid:</label>
          <input type="number" id="bid" name="startingPrice" value={formData.startingPrice} required onChange={handleChange} />

          <label htmlFor="image">Image:</label>
          <input type="file" id="image" name="image" onChange={handleChange} />

          <button type="submit">Add Listing</button>
        </form>
      </div>
    </div>
  );
};

export default OverlayForm;