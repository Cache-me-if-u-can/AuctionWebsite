import React, { useState, useEffect } from "react";
import ViewToggle from "./../ViewToggle/ViewToggle";
import AddListingButton from "./../AddListingButton/AddListingButton";
import OverlayForm from "./../OverlayForm/OverlayForm";
import ManageableListing from "../ManageableListing/ManageableListing";
import styles from "./ManageListingsContent.module.css";
import { AuctionItem } from "../../types/AuctionItem/AuctionItem";
import { processAuctionStatuses } from "../../utils/auctionUtils";
import { useUser } from "../../context/UserProvider";

type SortType = "endDate" | "currentBid";
type SortDirection = "asc" | "desc";

interface ManageListingsContentProps {
  filters?: {
    category: string;
    conditions: string[];
    searchTerm?: string;
  };
  onFilterChange?: (filters: {
    category: string;
    conditions: string[];
    searchTerm?: string;
  }) => void;
}

const ManageListingsContent: React.FC<ManageListingsContentProps> = ({
  filters = { category: "all", conditions: [], searchTerm: "" },
  onFilterChange = () => {},
}) => {
  const [view, setView] = useState("list");
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [isEditOverlayVisible, setIsEditOverlayVisible] = useState(false);
  const [editingListing, setEditingListing] = useState<AuctionItem | null>(
    null,
  );
  const [listings, setListings] = useState<AuctionItem[]>([]);
  const [sortBy, setSortBy] = useState<SortType>("endDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [charityName, setCharityName] = useState<string | null>(null);

  // Get user data from context
  const { getUserType } = useUser();
  const userType = getUserType();

  // First, fetch the user data to get the charity name
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://127.0.0.1:8080/getUserData", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const result = await response.json();
          console.log("User data received:", result);

          if (result.userType === "charity") {
            // Save the charity name for filtering
            setCharityName(result.name);

            // Now fetch the auction items
            fetchAuctionItems({
              ...filters,
              charity: result.name,
              searchTerm: filters.searchTerm,
            });
          } else {
            setError("Access restricted to charity users");
            setIsLoading(false);
          }
        } else {
          setError("Failed to authenticate");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Error retrieving user information");
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // When filters change, refetch auction items with charity name included
  useEffect(() => {
    if (charityName) {
      fetchAuctionItems({
        ...filters,
        charity: charityName,
        searchTerm: filters.searchTerm,
      });
    }
  }, [filters, charityName]);

  // Fetch auction items - similar to SearchAuctionsContent
  const fetchAuctionItems = async (filterParams: {
    category: string;
    conditions: string[];
    charity: string;
    searchTerm?: string;
  }) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Fetching auction items with filters:", filterParams);

      const response = await fetch(
        "http://127.0.0.1:8080/getSearchedAuctionItems",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(filterParams),
        },
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Received listings:", result);

        // Process auction statuses
        const processedAuctions = await processAuctionStatuses(result);
        setListings(processedAuctions);
      } else {
        const errorStatus = response.status;
        let errorText = "Failed to fetch listings";

        try {
          const errorData = await response.json();
          errorText = errorData.message || errorText;
        } catch (e) {
          // If response is not JSON, use status text
          errorText = response.statusText || errorText;
        }

        console.error(`Error ${errorStatus}: ${errorText}`);
        setError(`Error: ${errorText}`);
      }
    } catch (error) {
      console.error("Error fetching auction items:", error);
      setError("Error connecting to server");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle view toggle
  const handleViewChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setView(event.target.value);
  };

  // Handle overlay toggles
  const toggleOverlay = () => {
    setOverlayVisible(!isOverlayVisible);
  };

  const handleAddListing = (newListing: AuctionItem) => {
    setListings((prevListings) => [...prevListings, newListing]);
    setOverlayVisible(false);
    // Refresh listings
    if (charityName) {
      fetchAuctionItems({
        ...filters,
        charity: charityName,
      });
    }
  };

  const handleEditStart = (listing: AuctionItem) => {
    setEditingListing(listing);
    setIsEditOverlayVisible(true);
  };

  const handleEditComplete = (updatedListing: AuctionItem) => {
    setIsEditOverlayVisible(false);
    setEditingListing(null);
    // Refresh listings
    if (charityName) {
      fetchAuctionItems({
        ...filters,
        charity: charityName,
      });
    }
  };

  // Function to sort auction items
  const getSortedAuctions = (auctions: AuctionItem[]) => {
    if (!auctions || auctions.length === 0) return [];

    const auctionsCopy = [...auctions];

    switch (sortBy) {
      case "endDate":
        return auctionsCopy.sort((a, b) => {
          const comparison =
            new Date(a.auctionEndDate).getTime() -
            new Date(b.auctionEndDate).getTime();
          return sortDirection === "asc" ? comparison : -comparison;
        });
      case "currentBid":
        return auctionsCopy.sort((a, b) => {
          const comparison = a.currentPrice - b.currentPrice;
          return sortDirection === "asc" ? comparison : -comparison;
        });
      default:
        return auctionsCopy;
    }
  };

  // Get the sorted auctions to display
  const displayAuctions = getSortedAuctions(listings);

  // Prevent non-charity users from viewing this component
  if (userType !== "charity") {
    return (
      <div className={styles["listing-container"]}>
        <p className={styles.errorMessage}>
          Only charity accounts can access this page.
        </p>
      </div>
    );
  }

  return (
    <div className={styles["listing-container"]}>
      <div className={styles.mainContent}>
        <div className={styles.listingControls}>
          <ViewToggle view={view} onViewChange={handleViewChange} />
          <AddListingButton onClick={toggleOverlay} />
          <div className={styles.sortControls}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className={styles.sortSelect}
            >
              <option value="endDate">Sort by End Date</option>
              <option value="currentBid">Sort by Current Bid</option>
            </select>
            <select
              value={sortDirection}
              onChange={(e) =>
                setSortDirection(e.target.value as SortDirection)
              }
              className={styles.sortSelect}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        <div
          className={`${styles.listingsWrapper} ${
            view === "grid" ? styles.gridView : ""
          }`}
        >
          {isLoading ? (
            <p>Loading listings...</p>
          ) : error ? (
            <p className={styles.errorMessage}>
              {error}
              <button
                className={styles.retryButton}
                onClick={() =>
                  charityName &&
                  fetchAuctionItems({
                    ...filters,
                    charity: charityName,
                  })
                }
              >
                Retry
              </button>
            </p>
          ) : displayAuctions.length > 0 ? (
            displayAuctions.map((listing) => (
              <ManageableListing
                key={listing._id}
                view={view}
                {...listing}
                onEditClick={() => handleEditStart(listing)}
              />
            ))
          ) : (
            <p>No listings match your filters.</p>
          )}
        </div>

        {isOverlayVisible && (
          <OverlayForm onClose={toggleOverlay} onSubmit={handleAddListing} />
        )}

        {isEditOverlayVisible && editingListing && (
          <OverlayForm
            onClose={() => setIsEditOverlayVisible(false)}
            onSubmit={handleEditComplete}
            initialData={editingListing}
            isEditing={true}
          />
        )}
      </div>
    </div>
  );
};

export default ManageListingsContent;
