import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./BidDashboard.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { useUser } from "../../context/UserProvider";

interface Bid {
  bid_id: string;
  auction_item_id: string;
  title: string;
  image: string;
  bid_amount: number;
  current_highest_bid: number;
  is_highest_bidder: boolean;
  bid_date: string;
  auction_end_date: string;
  auction_status: string;
}

type FilterType = "all" | "active" | "completed";
type SortType = "endDate" | "bidAmount" | "status";

const BidDashboard: React.FC = () => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>("endDate");
  const navigate = useNavigate();
  const { getCsrfToken } = useUser();

  useEffect(() => {
    const fetchUserBids = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8080/getUserBids", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 401) {
            navigate("/login");
            return;
          }
          throw new Error("Failed to fetch bids");
        }

        const data = await response.json();
        setBids(data.bids || []);
      } catch (error) {
        console.error("Error fetching bids:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch bids",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserBids();
  }, [navigate, getCsrfToken]);

  const getFilteredAndSortedBids = () => {
    let filteredBids = [...bids];

    if (filter !== "all") {
      filteredBids = filteredBids.filter((bid) =>
        filter === "active"
          ? bid.auction_status === "active"
          : bid.auction_status === "completed",
      );
    }

    switch (sortBy) {
      case "endDate":
        filteredBids.sort(
          (a, b) =>
            new Date(a.auction_end_date).getTime() -
            new Date(b.auction_end_date).getTime(),
        );
        break;
      case "bidAmount":
        filteredBids.sort((a, b) => b.bid_amount - a.bid_amount);
        break;
      case "status":
        filteredBids.sort((a, b) =>
          a.is_highest_bidder === b.is_highest_bidder
            ? 0
            : a.is_highest_bidder
              ? -1
              : 1,
        );
        break;
    }

    return filteredBids;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return <div className={styles.loadingContainer}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.errorContainer}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        <h2 className={styles.title}>My Bids</h2>

        <div className={styles.controls}>
          <div className={styles.filters}>
            <button
              className={`${styles.filterButton} ${filter === "all" ? styles.active : ""}`}
              onClick={() => setFilter("all")}
            >
              All Bids
            </button>
            <button
              className={`${styles.filterButton} ${filter === "active" ? styles.active : ""}`}
              onClick={() => setFilter("active")}
            >
              Active
            </button>
            <button
              className={`${styles.filterButton} ${filter === "completed" ? styles.active : ""}`}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortType)}
            className={styles.sortSelect}
          >
            <option value="endDate">Sort by End Date</option>
            <option value="bidAmount">Sort by Bid Amount</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>

        <div className={styles.bidsGrid}>
          {getFilteredAndSortedBids().length === 0 ? (
            <div className={styles.noBids}>
              <p>You haven't placed any bids yet.</p>
            </div>
          ) : (
            getFilteredAndSortedBids().map((bid) => (
              <div key={bid.bid_id} className={styles.bidCard}>
                <div className={styles.bidImageContainer}>
                  <img
                    src={bid.image}
                    alt={bid.title}
                    className={styles.bidImage}
                  />
                </div>
                <div className={styles.bidInfo}>
                  <h3 className={styles.bidTitle}>{bid.title}</h3>
                  <div className={styles.bidDetails}>
                    <p>Your bid: £{bid.bid_amount.toFixed(2)}</p>
                    <p>
                      Current highest: £{bid.current_highest_bid.toFixed(2)}
                    </p>
                    <p
                      className={`${styles.bidStatus} ${bid.is_highest_bidder ? styles.leading : styles.outbid}`}
                    >
                      {bid.is_highest_bidder ? "✅ Leading" : "❌ Outbid"}
                    </p>
                  </div>
                  <div className={styles.bidTimeInfo}>
                    <p>Bid placed: {formatDate(bid.bid_date)}</p>
                    <p>
                      {bid.auction_status === "active"
                        ? `Ends: ${formatDate(bid.auction_end_date)}`
                        : "Auction ended"}
                    </p>
                  </div>
                  {bid.auction_status === "active" && (
                    <button
                      className={styles.viewButton}
                      onClick={() =>
                        navigate(`/listing/${bid.auction_item_id}`)
                      }
                    >
                      View Auction
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BidDashboard;
