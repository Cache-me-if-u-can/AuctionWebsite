export type AuctionStatus = "hidden" | "live" | "completed";

export interface AuctionItem {
  _id?: string;
  title: string;
  description: string;
  startingPrice: number;
  currentPrice: number;
  image: File | null;
  auctionStartDate: string;
  auctionEndDate: string;
  categoryId: string;
  charityId: string;
  status: AuctionStatus;
  //Optional, not sure if they will be used elsewhere for now
  charityName?: string;
  categoryName?: string;
}
