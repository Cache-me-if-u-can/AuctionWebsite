import { AuctionItem, AuctionStatus } from "../types/AuctionItem/AuctionItem";

export const updateAuctionStatus = async (
  auction: AuctionItem
): Promise<boolean> => {
  const now = new Date();
  const endDate = new Date(auction.auctionEndDate);
  const startDate = new Date(auction.auctionStartDate);

  let newStatus: AuctionStatus = auction.status;

  // Determine the correct status based on dates
  if (endDate < now) {
    newStatus = "completed";
  } else if (startDate > now) {
    newStatus = "hidden";
  } else {
    newStatus = "live";
  }

  // Only update if status needs to change
  if (newStatus !== auction.status) {
    try {
      const response = await fetch(
        `http://127.0.0.1:8080/updateAuctionStatus/${auction._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
          credentials: "include",
        }
      );

      if (response.ok) {
        auction.status = newStatus;
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to update auction status:", error);
      return false;
    }
  }
  return true;
};

export const processAuctionStatuses = async (
  auctions: AuctionItem[]
): Promise<AuctionItem[]> => {
  const updatedAuctions = [...auctions];

  for (let auction of updatedAuctions) {
    await updateAuctionStatus(auction);
  }

  return updatedAuctions;
};
