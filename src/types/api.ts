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
