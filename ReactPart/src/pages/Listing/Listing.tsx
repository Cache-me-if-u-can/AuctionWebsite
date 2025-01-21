import React, { useState } from "react";
import styles from "./Listing.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import AuctionBanner from "../../components/auctionBanner/auctionBanner";


const Listing: React.FC = () => {
  const [maxBid, setMaxBid] = useState<number | string>("");
  const [warningVisible, setWarningVisible] = useState(false);

  const checkBid = () => {
    const currentBid = 100; // Example value
    if (typeof maxBid === "number" && maxBid <= currentBid) {
      setWarningVisible(true);
    } else {
      setWarningVisible(false);
      alert(`Bid of $${maxBid} placed!`);
    }
  };


  return (
    <>
      <Header />
      <AuctionBanner />
      <div className={styles.main_content}>
        <div className={styles.auction_container}>
          <img
            className={styles.auction_image}
            src="../../assets/images/art.png"
            alt="Artwork"
          />
          <div className={styles.auctionListing_details}>
            <h3>Auction Item Title</h3>
            <h2 className={styles.charity_seller}>Charity name </h2>
            <p className={styles.auction_description}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
              odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla
              quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent
              mauris. Fusce nec tellus sed augue semper porta. Mauris massa.
              Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad
              litora torquent per conubia nostra, per inceptos himenaeos. Curabitur
            </p>
            <div className={styles.bidding_details}>
              <div className={styles.bidValues}>
                <h3 className={styles.sBid}>Starting Bid: $50</h3>
                <h3 className={styles.cBid}>Current Bid: $100</h3>
                <h3 className={styles.buyNow}>Buy Now: $500</h3>
              </div>
              <div className={styles.input_field}>
                <label htmlFor="maxBid">Enter your max bid:</label>
                <input
                  type="number"
                  id="maxBid"
                  name="maxBid"
                  value={maxBid}
                  onChange={(e) =>
                    setMaxBid(e.target.value ? parseInt(e.target.value) : "")
                  }
                />
                {warningVisible && (
                  <p id="warning" className={styles.warning_text}>
                    Your bid must be higher than the current bid.
                  </p>
                )}
                <button className={styles.bid_button} onClick={checkBid}>
                  Place Bid
                </button>
              </div>
              <div className={styles.additionalDetails}>
                <h4 className={styles.activeBidders}>
                  People bidding on this item: 3
                </h4>
                <h4 className={styles.timeTillEnd}>Ends in: 3 days</h4>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.bidderLeaderboard}>
          <h3>Leaderboard</h3>
          <div className={styles.bidder}>
            <h4>1. John Doe</h4>
            <h4>$100</h4>
          </div>
          <div className={styles.bidder}>
            <h4>2. Jane Doe</h4>
            <h4>$90</h4>
          </div>
          <div className={styles.bidder}>
            <h4>3. John Smith</h4>
            <h4>$80</h4>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Listing;
