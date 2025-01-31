import React, { useState, useEffect } from 'react';
import styles from './SearchAuctionsContent.module.css';
import AuctionListing from '../AuctionListing/AuctionListing';
import ViewToggle from '../ViewToggle/ViewToggle';
import { AuctionItem } from '../../types/AuctionItem/AuctionItem';

export default function SearchAuctionsContent() {
  const [view, setView] = useState('list'); // Ensure initial state is 'list'
  const [auctions, setAuctions] = useState<AuctionItem[]>([]);

  useEffect(() => {
    // Mock data for testing
    const mockData: AuctionItem[] = [
      {
        id: '1',
        title: 'Vintage Clock',
        charity: 'Charity A',
        description: 'A beautiful vintage clock.',
        status: 'live',
        category: 'Antiques',
        auctionDue: '2023-12-31T23:59:59',
        bid: 100,
        image: null,
      },
      {
        id: '2',
        title: 'Painting',
        charity: 'Charity B',
        description: 'A stunning painting.',
        status: 'live',
        category: 'Art',
        auctionDue: '2023-12-31T23:59:59',
        bid: 200,
        image: null,
      },
    ];

    // Simulate fetching data from the backend API
    const fetchAuctions = async () => {
      try {
        // Simulate a delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setAuctions(mockData);
      } catch (error) {
        console.error('Error fetching auctions:', error);
      }
    };

    fetchAuctions();
  }, []);

  const handleViewChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setView(event.target.value);
  };

  return (
    <div className={styles.mainContent}>
      <ViewToggle view={view} onViewChange={handleViewChange} />
      <div className={view === 'grid' ? styles.gridView : styles.listView}>
        {auctions.map((auction) => (
          <AuctionListing key={auction.id} view={view} {...auction} />
        ))}
      </div>
    </div>
  );
}