import { AuctionItem, AuctionStatus } from '../types/AuctionItem/AuctionItem';

export const updateAuctionStatus = (auction: AuctionItem): AuctionStatus => {
  const now = new Date();
  const endDate = new Date(auction.auctionEndDate);

  if (endDate < now) {
    return "completed";
  }
  return auction.status;
};

export const processAuctionStatuses = (auctions: AuctionItem[]): AuctionItem[] => {
  return auctions.map(auction => ({
    ...auction,
    status: updateAuctionStatus(auction)
  }));
};
