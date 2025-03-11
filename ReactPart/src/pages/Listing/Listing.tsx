import React from "react";
import { useLocation } from "react-router-dom";
import styles from "./Listing.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import AuctionBanner from "../../components/auctionBanner/auctionBanner";
import { AuctionItem } from "../../types/AuctionItem/AuctionItem";

//:TODO: Fix passing Listing props from search Auctions page to the Listing page
const Listing: React.FC = () => {
  const location = useLocation();
  const auctionItem = location.state?.listing as AuctionItem;
  const [maxBid, setMaxBid] = React.useState<number | string>("");
  const [warningVisible, setWarningVisible] = React.useState(false);

  // Add loading state
  if (!auctionItem) {
    return <div>Loading...</div>;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleBid = () => {
    if (typeof maxBid === "number" && maxBid <= auctionItem.currentPrice) {
      setWarningVisible(true);
      return;
    }
    setWarningVisible(false);
    // Add your bid submission logic here
    console.log(`Placing bid: ${maxBid}`);
  };

  const renderImage = () => {
    try {
      if (auctionItem.image instanceof Blob) {
        return URL.createObjectURL(auctionItem.image);
      }
      return auctionItem.image ? (auctionItem.image as string) : "";
    } catch (error) {
      console.error("Error rendering image:", error);
      return "";
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
            src={renderImage()}
            alt={auctionItem.title}
          />
          <div className={styles.auctionListing_details}>
            <h3>{auctionItem.title}</h3>
            <h2 className={styles.charity_seller}>
              Charity ID: {auctionItem.charityId}
            </h2>
            <p>{auctionItem.description}</p>
            <div className={styles.bidding_details}>
              <div className={styles.bidValues}>
                <h3 className={styles.sBid}>
                  Starting Bid: £{auctionItem.startingPrice}
                </h3>
                <h3 className={styles.cBid}>
                  Current Bid: £{auctionItem.currentPrice}
                </h3>
                <h3 className={styles.buyNow}>
                  Buy Now: £{auctionItem.startingPrice * 10}
                </h3>
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
                <button className={styles.bid_button} onClick={handleBid}>
                  Place Bid
                </button>
              </div>
              <div className={styles.timeTillEnd}>
                <span>Start: {formatDate(auctionItem.auctionStartDate)}</span>
                <span>End: {formatDate(auctionItem.auctionEndDate)}</span>
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
            <h4>£100</h4>
          </div>
          <div className={styles.bidder}>
            <h4>2. Jane Doe</h4>
            <h4>£90</h4>
          </div>
          <div className={styles.bidder}>
            <h4>3. John Smith</h4>
            <h4>£80</h4>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Listing;
