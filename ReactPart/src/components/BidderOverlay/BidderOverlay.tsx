import React, { useState, useEffect } from "react";
import styles from "./BidderOverlay.module.css";

interface Bid {
  userName: string;
  bidAmount: number;
}

interface BidderOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  auctionId: string;
}

const BidderOverlay: React.FC<BidderOverlayProps> = ({
  isVisible,
  onClose,
  auctionId,
}) => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://127.0.0.1:8080/getTopBids/${auctionId}`,
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch bids");
        }

        const data = await response.json();
        console.log("Received bid data:", data);
        setBids(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (isVisible) {
      fetchBids();
    }
  }, [auctionId, isVisible]);

  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.overlay_content}>
        <span className={styles.close_button} onClick={onClose}>
          &times;
        </span>
        <h2>Top Bidders</h2>
        {loading ? (
          <p>Loading bidders...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : bids.length === 0 ? (
          <p>No bids yet</p>
        ) : (
          <div className={styles.bidderList}>
            {bids.map((bid, index) => (
              <div key={index} className={styles.bidderItem}>
                <span className={styles.position}>#{index + 1}</span>
                <span className={styles.userName}>{bid.userName}</span>
                <span className={styles.amount}>${bid.bidAmount}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BidderOverlay;
