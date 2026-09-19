export type Language = 'en' | 'sw';

export type GenderCategory = 'all' | 'men' | 'women' | 'kids' | 'accessories';

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | '28' | '30' | '32' | '34' | '36' | '38' | 'Free Size';

export interface ProductColor {
  name: string;
  nameSw: string;
  hex: string;
}

export interface ProductReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  commentSw?: string;
}

export interface Product {
  id: string;
  name: string;
  nameSw: string;
  category: GenderCategory;
  subcategory: string;
  subcategorySw: string;
  price: number; // in TZS
  originalPrice?: number;
  images: string[];
  description: string;
  descriptionSw: string;
  sizes: ProductSize[];
  colors: ProductColor[];
  stock: Record<string, number>;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
  material: string;
  materialSw: string;
  careInstructions: string;
  careInstructionsSw: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  selectedSize: ProductSize;
  selectedColor: ProductColor;
  quantity: number;
  unitPrice: number;
}

export type OrderStatus =
  | 'new_order'
  | 'payment_confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'mpesa' | 'tigopesa' | 'airtel' | 'halopesa' | 'cod';

export interface DeliveryZone {
  id: string;
  district: string;
  districtSw: string;
  wards: string[];
  fee: number;
  estimatedHours: string;
  estimatedHoursSw: string;
}

export interface OrderCustomerInfo {
  fullName: string;
  phoneNumber: string;
  district: string;
  ward: string;
  streetLandmark: string;
  deliveryNotes?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: OrderCustomerInfo;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentReference?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'on_delivery';
  timeline: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
}

export interface PromoCode {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  minOrderAmount?: number;
  description: string;
  isActive: boolean;
}

// -------------------------------------------------------------------
// Authentication & Rider Types
// -------------------------------------------------------------------

export type UserRole = 'customer' | 'rider' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  // Rider specific attributes
  vehicleType?: string;
  vehiclePlate?: string;
  zone?: string;
  rating?: number;
  completedDeliveries?: number;
  isOnline?: boolean;
}

export type DeliveryTaskStatus = 'available' | 'assigned' | 'in_transit' | 'delivered';

export interface RiderDelivery {
  id: string;
  orderId: string;
  pickupLocation: string;
  deliveryAddress: string;
  customerName: string;
  customerPhone: string;
  itemsSummary: string;
  packageCount: number;
  fee: number; // rider payout in TZS
  status: DeliveryTaskStatus;
  assignedRiderId?: string;
  createdAt: string;
  assignedAt?: string;
  deliveredAt?: string;
}

export type ActiveView =
  | 'home'
  | 'catalog'
  | 'cart'
  | 'wishlist'
  | 'orders'
  | 'login'
  | 'rider_dashboard'
  | 'admin_login'
  | 'admin_dashboard';
