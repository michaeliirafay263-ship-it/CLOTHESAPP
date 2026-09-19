import { AuthUser, RiderDelivery } from '../types';

export const DEMO_CREDENTIALS = {
  customer: {
    email: 'customer@clothesapp.tz',
    password: 'customer123',
    name: 'Amina Mwamburi',
    phone: '0754 112 233',
    role: 'customer' as const
  },
  rider: {
    email: 'rider@clothesapp.tz',
    password: 'rider123',
    name: 'Juma Selemani (Rider)',
    phone: '0713 889 900',
    role: 'rider' as const,
    vehicleType: 'Boxer BM 150 (Boda Boda)',
    vehiclePlate: 'MC 492 EBD',
    zone: 'Kinondoni & Ilala',
    rating: 4.9,
    completedDeliveries: 142,
    isOnline: true
  },
  admin: {
    email: 'admin@clothesapp.tz',
    password: 'admin123',
    name: 'Michaeli Mtambo (Owner)',
    phone: '0754 000 000',
    role: 'admin' as const
  }
};

export const INITIAL_RIDER_DELIVERIES: RiderDelivery[] = [
  {
    id: 'DEL-201',
    orderId: 'DAR-1082',
    pickupLocation: 'DarStore Kariakoo Hub, Uhuru Street',
    deliveryAddress: 'Sinza Mori near Afrikana Hotel, House 12',
    customerName: 'Amina Salum',
    customerPhone: '0754223344',
    itemsSummary: '1x Classic Linen Shirt (L), 1x Wide Leg Linen Trousers (M)',
    packageCount: 2,
    fee: 4500,
    status: 'assigned',
    assignedRiderId: 'rider-demo',
    createdAt: '2026-09-18T14:30:00Z',
    assignedAt: '2026-09-18T15:20:00Z'
  },
  {
    id: 'DEL-202',
    orderId: 'DAR-1085',
    pickupLocation: 'DarStore Masaki Depot, Haile Selassie Rd',
    deliveryAddress: 'Mikocheni B, Block 45 near Shoppers Plaza',
    customerName: 'Kelvin Mushi',
    customerPhone: '0718334455',
    itemsSummary: '2x Slim-Fit Chino Pants (32), 1x Cotton Polo (L)',
    packageCount: 3,
    fee: 4000,
    status: 'available',
    createdAt: '2026-09-19T08:15:00Z'
  },
  {
    id: 'DEL-203',
    orderId: 'DAR-1086',
    pickupLocation: 'DarStore Kariakoo Hub, Uhuru Street',
    deliveryAddress: 'Posta CBD, Samora Avenue Tower',
    customerName: 'Fatma Al-Harthy',
    customerPhone: '0767998811',
    itemsSummary: '1x Modern Kitenge Blazer (M)',
    packageCount: 1,
    fee: 3500,
    status: 'available',
    createdAt: '2026-09-19T09:00:00Z'
  },
  {
    id: 'DEL-200',
    orderId: 'DAR-1081',
    pickupLocation: 'DarStore Kariakoo Hub, Uhuru Street',
    deliveryAddress: 'Samora Tower, 4th Floor, Posta',
    customerName: 'David Mwakalinga',
    customerPhone: '0713998877',
    itemsSummary: '2x Slim-Fit Chino Pants (32)',
    packageCount: 2,
    fee: 4000,
    status: 'delivered',
    assignedRiderId: 'rider-demo',
    createdAt: '2026-09-18T11:15:00Z',
    assignedAt: '2026-09-18T12:00:00Z',
    deliveredAt: '2026-09-18T12:45:00Z'
  }
];
