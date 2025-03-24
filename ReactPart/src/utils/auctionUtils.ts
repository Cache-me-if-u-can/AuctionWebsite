import { AuctionItem, AuctionStatus } from "../types/AuctionItem/AuctionItem";

export const updateAuctionStatus = async (
  auction: AuctionItem
): Promise<boolean> => {
  const now = new Date();
  const endDate = new Date(auction.auctionEndDate);
  const startDate = new Date(auction.auctionStartDate);

  if (endDate < now && auction.status !== "completed") {
    try {
      const response = await fetch(
        `http://127.0.0.1:8080/updateAuctionStatus/${auction._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "completed" }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error("Failed to update auction status:", error);
      return false;
    }
  } else if (startDate < now && auction.status !== "active") {
    try {
      const response = await fetch(
        `http://127.0.0.1:8080/updateAuctionStatus/${auction._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "active" }),
        }
      );

      return response.ok;
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
    const endDate = new Date(auction.auctionEndDate);
    const startDate = new Date(auction.auctionStartDate);
    if (endDate < new Date()) {
      const updated = await updateAuctionStatus(auction);
      if (updated) {
        auction.status = "completed";
      }
    } else if (startDate < new Date()) {
      const updated = await updateAuctionStatus(auction);
      if (updated) {
        auction.status = "active";
      }
    }
  }
  return updatedAuctions;
};
