export type OrderStatus = "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";

export type Order = {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  date: string;
  amount: number;
  amountLabel: string;
  quantity: number;
  status: OrderStatus;
  paymentMethod: string;
  transactionId: string;
  trackingId: string;
  trackingCarrier: string;
  serialNumber?: string;
};

export const orders: Order[] = [
  {
    id: "JP-2025-00124",
    productId: "leica-gs18",
    productName: "Leica GS18 I GNSS RTK Rover",
    productImage: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800",
    date: "12 Jan 2026",
    amount: 1450000,
    amountLabel: "₹14,50,000",
    quantity: 1,
    status: "Delivered",
    paymentMethod: "UPI · arjun@okaxis",
    transactionId: "TXN-UPI-789456123",
    trackingId: "IN2026011200124",
    trackingCarrier: "Blue Dart",
    serialNumber: "LG18-220451",
  },
  {
    id: "JP-2025-00098",
    productId: "trimble-tsc7",
    productName: "Trimble TSC7 Data Controller",
    productImage: "https://images.unsplash.com/photo-1580910051070-7d3e6f0ed1f5?w=800",
    date: "04 Nov 2025",
    amount: 285000,
    amountLabel: "₹2,85,000",
    quantity: 1,
    status: "Delivered",
    paymentMethod: "Net Banking · HDFC Bank",
    transactionId: "TXN-NB-558721",
    trackingId: "IN2025110400098",
    trackingCarrier: "DTDC",
    serialNumber: "TSC7-770221",
  },
  {
    id: "JP-2025-00211",
    productId: "dji-zenmuse-l2",
    productName: "DJI Zenmuse L2 LiDAR Survey Drone",
    productImage: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800",
    date: "18 Mar 2026",
    amount: 975000,
    amountLabel: "₹9,75,000",
    quantity: 1,
    status: "Shipped",
    paymentMethod: "Credit Card · HDFC ••4567",
    transactionId: "TXN-CC-998877",
    trackingId: "IN2026051800123",
    trackingCarrier: "Blue Dart",
  },
];
