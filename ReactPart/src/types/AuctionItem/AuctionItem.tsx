export interface AuctionItem {
    id: string;
    title: string;
    charity: string;
    description: string;
    status: 'live' | 'complete' | 'hidden';
    category: string;
    auctionDue: string;
    bid: number;
    image: File | null;
  }