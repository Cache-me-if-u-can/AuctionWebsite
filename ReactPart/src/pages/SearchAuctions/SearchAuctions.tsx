import React from 'react';
import styles from './SearchAuctions.module.css';
import Header from '../../components/Header/Header';
import AuctionBanner from '../../components/auctionBanner/auctionBanner';
import Sidebar from '../../components/Sidebar/Sidebar';
import SearchAuctionContent from '../../components/SearchAuctionsContent/SearchAuctionsContent';

const App: React.FC = () => {
  return (
    <div className={styles.container}>
      <Header />
      <AuctionBanner />
      <div className={styles.content}>
        <Sidebar />
        <SearchAuctionContent />
      </div>
    </div>
  );
};
export default App;