export interface Notification {
  _id: string;
  userId: string;
  message: string;
  type: "bid_won" | "bid_outbid" | "auction_ended";
  auctionId: string;
  read: boolean;
  createdAt: string;
}
