export type ApiCategory = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type ApiProductImage = {
  id: string;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
};

export type ApiBrand = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ApiProductSpec = {
  id: string;
  key: string;
  value: string;
  sortOrder: number;
};

export type ApiProductDocument = {
  id: string;
  url: string;
  name: string;
  sortOrder: number;
};

export type ApiProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  stockStatus: "in_stock" | "out_of_stock" | "limited_stock";
  modelNumber: string;
  salesRepName: string | null;
  salesRepPhone: string | null;
  isFeatured: boolean;
  isNewArrival: boolean;
  isActive: boolean;
  category: ApiCategory | null;
  brand: ApiBrand | null;
  images: ApiProductImage[];
  specs?: ApiProductSpec[];
  documents?: ApiProductDocument[];
  createdAt: string;
  updatedAt: string;
};

export type ApiCartItem = {
  id: string;
  quantity: number;
  product: ApiProduct;
};

export type ApiCartSummary = {
  subtotal: number;
  gstAmount: number;
  discountAmount: number;
  shippingAmount: number;
  totalAmount: number;
  advanceAmount: number;
  balanceAmount: number;
};

export type ApiCart = {
  id: string;
  guestId: string | null;
  items: ApiCartItem[];
  savedItems: ApiCartItem[];
  summary: ApiCartSummary;
  createdAt: string;
  updatedAt: string;
};

export type ApiQuote = {
  id: string;
  status: "pending" | "quote_sent" | "accepted" | "declined";
  notes: string | null;
  quantity: number;
  quotedPrice: string | null;
  validUntil: string | null;
  adminResponse: string | null;
  product: ApiProduct;
  createdAt: string;
  updatedAt: string;
};

export type ApiCompareSpec = {
  key: string;
  values: (string | null)[];
};

export type ApiCompareProduct = {
  id: string;
  name: string;
  brand: string;
  image: string;
  price: string;
  priceLabel: string;
  stockStatus: "in_stock" | "out_of_stock" | "limited_stock";
};

export type ApiCompareData = {
  products: ApiCompareProduct[];
  specs: ApiCompareSpec[];
};

export type ApiOrderShippingAddress = {
  city: string;
  state: string;
  pincode: string;
  phone: string;
  fullName: string;
  addressLine1: string;
  addressLine2: string;
};

export type ApiOrderTrackingEvent = {
  status: string;
  message: string;
  timestamp: string;
};

export type ApiOrderTracking = {
  id: string;
  courierName: string | null;
  awbNumber: string | null;
  trackingUrl: string | null;
  events: ApiOrderTrackingEvent[];
  updatedAt: string;
};

export type ApiOrderItem = {
  id: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  productName: string;
  product: ApiProduct;
};

export type ApiOrderStatus =
  | "pending_advance_payment"
  | "advance_paid"
  | "balance_paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type ApiOrder = {
  id: string;
  orderId: string;
  status: ApiOrderStatus;
  subtotal: string;
  gstAmount: string;
  shippingAmount: string;
  totalAmount: string;
  shippingAddress: ApiOrderShippingAddress;
  paymentMethod: string;
  transactionId: string | null;
  advanceAmount: string;
  balanceAmount: string;
  advancePaid: boolean;
  balancePaid: boolean;
  neftReferenceNumber: string | null;
  balanceNeftReferenceNumber: string | null;
  requiresGstBill: boolean;
  salesRepName: string | null;
  salesRepPhone: string | null;
  estimatedDeliveryStart: string;
  estimatedDeliveryEnd: string;
  items: ApiOrderItem[];
  tracking: ApiOrderTracking;
  createdAt: string;
  updatedAt: string;
};
