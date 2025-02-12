export interface AuctionItem {
    _id: string;
    title: string;
    charityId: string;
    description: string;
    startingPrice: number;
    currentPrice: number;
    status: 'live' | 'complete' | 'hidden';
    categoryId: string;
    auctionStartDate: string;
    auctionEndDate: string;
    image: File | null;
    
  }