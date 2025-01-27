import React from 'react';
import Header from '../../components/Header/Header';
import AuctionBanner from '../../components/auctionBanner/auctionBanner';
import Sidebar from '../../components/Sidebar/Sidebar';
import ManageListingsContent from '../../components/ManageListingsContent/ManageListingsContent';
import styles from './ManageListings.module.css';

const App: React.FC = () => {
  return (
    <div className={styles.container}>
      <Header />
      <AuctionBanner />
      <div className={styles.content}>
        <Sidebar />
        <ManageListingsContent />
      </div>
    </div>
  );
};

export default App;