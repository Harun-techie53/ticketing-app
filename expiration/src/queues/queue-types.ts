export const ordersExpiration = "orders-expiration";
export const auctionsExpiration = "auctions-expiration";

export interface OrdersExpirationQueuePayload {
  orderId: string;
}

export interface AuctionsExpirationQueuePayload {
  auctionId: string;
}
