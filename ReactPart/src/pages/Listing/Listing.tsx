import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import styles from "./Listing.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import AuctionBanner from "../../components/auctionBanner/auctionBanner";
import { AuctionItem } from "../../types/AuctionItem/AuctionItem";
import { useUser } from "../../context/UserProvider";

const Listing: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [maxBid, setMaxBid] = React.useState<number | string>("");
  const [warningVisible, setWarningVisible] = React.useState(false);
  const { getCsrfToken } = useUser();
  const [isAnonymous, setIsAnonymous] = React.useState<boolean>(false);
  const [auctionItem, setAuctionItem] = React.useState<AuctionItem | null>(
    null,
  );
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  useEffect(() => {
    const fetchAuctionItem = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8080/getAuctionItem/${id}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch auction item");
        }
        const data = await response.json();
        setAuctionItem(data);
      } catch (error) {
        console.error("Error fetching auction item:", error);
      }
    };

    if (id) {
      fetchLeaderboard();
      fetchAuctionItem();
    }
  }, [id]);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8080/getTopBids/${id}`);
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  // Add loading state
  if (!auctionItem) {
    return <div className={styles.loadingContainer}>Loading...</div>;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleBid = async () => {
    // Validate bid amount
    if (typeof maxBid !== "number" || maxBid <= auctionItem.currentPrice) {
      setWarningVisible(true);
      return;
    }

    setWarningVisible(false);

    try {
      const csrfToken = getCsrfToken();
      if (!csrfToken) {
        throw new Error("No authentication token found");
      }

      // Get the current user data to extract customerId
      const userResponse = await fetch("http://127.0.0.1:8080/getUserData", {
        method: "GET",
        credentials: "include",
      });

      if (!userResponse.ok) {
        throw new Error("Failed to get user data");
      }

      const userData = await userResponse.json();

      const bidData = {
        auctionItemId: auctionItem._id,
        bidAmount: maxBid,
        customerId: userData._id,
        isAnonymous: isAnonymous,
      };

      console.log("Submitting bid:", bidData);

      // Create the bid (which will also update the price on the backend)
      const bidResponse = await fetch("http://127.0.0.1:8080/createBid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify(bidData),
      });

      if (!bidResponse.ok) {
        const errorData = await bidResponse.json();
        throw new Error(
          errorData.message || errorData.error || "Failed to place bid",
        );
      }

      // Bid was successful - update local state
      setAuctionItem({
        ...auctionItem,
        currentPrice: maxBid,
      });

      // Clear the bid input
      setMaxBid("");

      // Show success message
      const bidResult = await bidResponse.json();
      alert(bidResult.message || "Bid placed successfully!");
      fetchLeaderboard();
    } catch (error) {
      console.error("Error placing bid:", error);
      alert(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    }
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
    <div className={styles.container}>
      <Header />
      <AuctionBanner />
      <div className={styles.content}>
        <div className={styles.mainContent}>
          <div className={styles.auctionContainer}>
            <div className={styles.auctionImageContainer}>
              <img
                className={styles.auctionImage}
                src={renderImage()}
                alt={auctionItem.title}
              />
            </div>
            <div className={styles.auctionDetails}>
              <h2 className={styles.auctionTitle}>{auctionItem.title}</h2>
              <div className={styles.statusBadge}>
                Status: {auctionItem.status}
              </div>
              <div className={styles.charityBadge}>
                Charity ID: {auctionItem.charityId}
              </div>
              <div className={styles.categoryBadge}>
                Category: {auctionItem.categoryId}
              </div>
              <div className={styles.descriptionSection}>
                <p>{auctionItem.description}</p>
              </div>

              <div className={styles.biddingSection}>
                <div className={styles.priceContainer}>
                  <div className={styles.priceCard}>
                    <span className={styles.priceLabel}>Starting Bid</span>
                    <span className={styles.priceValue}>
                      £{auctionItem.startingPrice}
                    </span>
                  </div>
                  <div className={styles.priceCard}>
                    <span className={styles.priceLabel}>Current Bid</span>
                    <span className={styles.priceValue}>
                      £{auctionItem.currentPrice}
                    </span>
                  </div>
                  <div className={styles.priceCard}>
                    <span className={styles.priceLabel}>Buy Now</span>
                    <span className={styles.priceValue}>
                      £{auctionItem.startingPrice * 10}
                    </span>
                  </div>
                </div>

                <div className={styles.bidInputContainer}>
                  <label htmlFor="maxBid">Enter your max bid:</label>
                  <input
                    type="number"
                    id="maxBid"
                    name="maxBid"
                    value={maxBid}
                    onChange={(e) =>
                      setMaxBid(e.target.value ? parseInt(e.target.value) : "")
                    }
                    className={styles.bidInput}
                  />

                  {warningVisible && (
                    <div className={styles.warningText}>
                      Your bid must be higher than the current bid.
                    </div>
                  )}
                  <div className={styles.anonymousBidOption}>
                    <label className={styles.anonymousCheckbox}>
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                      />
                      <span className={styles.checkmark}></span>
                      Bid anonymously
                    </label>
                  </div>

                  <button className={styles.bidButton} onClick={handleBid}>
                    Place Bid
                  </button>
                </div>

                <div className={styles.timeSection}>
                  <div className={styles.timeCard}>
                    <span className={styles.timeLabel}>Start</span>
                    <span className={styles.timeValue}>
                      {formatDate(auctionItem.auctionStartDate)}
                    </span>
                  </div>
                  <div className={styles.timeCard}>
                    <span className={styles.timeLabel}>End</span>
                    <span className={styles.timeValue}>
                      {formatDate(auctionItem.auctionEndDate)}
                    </span>
                  </div>
                </div>

                <div className={styles.additionalInfo}>
                  <div className={styles.infoCard}>
                    <span>People bidding on this item: 3</span>
                  </div>
                  <div className={styles.infoCard}>
                    <span>Ends in: 3 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.bidderLeaderboard}>
            <h3>Leaderboard</h3>
            {leaderboard.length > 0 ? (
              leaderboard.map((bid, index) => (
                <div key={index} className={styles.bidder}>
                  <h4>
                    {index + 1}. {bid.userName}
                  </h4>
                  <h4>£{bid.bidAmount}</h4>
                </div>
              ))
            ) : (
              <p>No bids found for this auction item.</p>
            )}{" "}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Listing;
