import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Order,
  DeliveryZone,
  Language,
  ActiveView,
  GenderCategory,
  OrderStatus,
  PromoCode,
  ProductSize,
  ProductColor,
  AuthUser,
  UserRole,
  RiderDelivery,
  DeliveryTaskStatus
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_PROMO_CODES } from '../data/mockProducts';
import { DAR_DELIVERY_ZONES } from '../data/locations';
import { DEMO_CREDENTIALS, INITIAL_RIDER_DELIVERIES } from '../data/mockAuth';
import { translations } from '../i18n/translations';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  text: string;
}

interface StoreContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['en'], params?: Record<string, string | number>) => string;
  
  // Navigation & Views
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  selectedCategory: GenderCategory;
  setSelectedCategory: (cat: GenderCategory) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Authentication
  currentUser: AuthUser | null;
  login: (email: string, pass: string, role: UserRole) => { success: boolean; message?: string };
  register: (userData: Partial<AuthUser>, role: UserRole) => { success: boolean; message?: string };
  logout: () => void;
  
  // Products
  products: Product[];
  selectedProduct: Product | null;
  setSelectedProduct: (prod: Product | null) => void;
  addProduct: (prod: Omit<Product, 'id' | 'rating' | 'reviewCount' | 'reviews'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (productId: string, size: string, newStock: number) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size: ProductSize, color: ProductColor, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemsCount: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (isOpen: boolean) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Checkout & Orders
  orders: Order[];
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'timeline'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByPhone: (phone: string) => Order[];

  // Rider Tasks
  riderDeliveries: RiderDelivery[];
  acceptDelivery: (deliveryId: string) => void;
  updateDeliveryTaskStatus: (deliveryId: string, status: DeliveryTaskStatus) => void;
  toggleRiderOnline: () => void;

  // Delivery Zones
  deliveryZones: DeliveryZone[];
  updateDeliveryFee: (zoneId: string, newFee: number) => void;
  selectedZone: DeliveryZone | null;
  setSelectedZone: (zone: DeliveryZone | null) => void;

  // Promo Codes
  appliedPromo: PromoCode | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;

  // Size Guide Modal
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (text: string, type?: 'success' | 'info' | 'error') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const INITIAL_MOCK_ORDERS: Order[] = [
  {
    id: 'DAR-1082',
    createdAt: '2026-09-18T14:30:00.000Z',
    customer: {
      fullName: 'Amina Salum',
      phoneNumber: '0754223344',
      district: 'Kinondoni',
      ward: 'Sinza',
      streetLandmark: 'Sinza Mori near Meeda Bar, House 12',
      deliveryNotes: 'Please ring the bell upon arrival'
    },
    items: [
      {
        id: 'ci-1',
        productId: 'prod-001',
        product: INITIAL_PRODUCTS[0],
        selectedSize: 'L',
        selectedColor: INITIAL_PRODUCTS[0].colors[0],
        quantity: 1,
        unitPrice: 38000
      },
      {
        id: 'ci-2',
        productId: 'prod-007',
        product: INITIAL_PRODUCTS[6],
        selectedSize: 'M',
        selectedColor: INITIAL_PRODUCTS[6].colors[0],
        quantity: 1,
        unitPrice: 46000
      }
    ],
    subtotal: 84000,
    deliveryFee: 3000,
    discount: 0,
    total: 87000,
    status: 'out_for_delivery',
    paymentMethod: 'mpesa',
    paymentReference: 'MP-TZ-9847291',
    paymentStatus: 'paid',
    timeline: [
      { status: 'new_order', timestamp: '2026-09-18T14:30:00.000Z', note: 'Customer ordered on web app' },
      { status: 'payment_confirmed', timestamp: '2026-09-18T14:32:10.000Z', note: 'M-Pesa payment confirmed (TZS 87,000)' },
      { status: 'preparing', timestamp: '2026-09-18T14:45:00.000Z', note: 'Packed at Kariakoo Hub by Michaeli' },
      { status: 'out_for_delivery', timestamp: '2026-09-18T15:20:00.000Z', note: 'Rider Juma (TZ-MC-492) dispatched towards Sinza' }
    ]
  },
  {
    id: 'DAR-1081',
    createdAt: '2026-09-18T11:15:00.000Z',
    customer: {
      fullName: 'David Mwakalinga',
      phoneNumber: '0713998877',
      district: 'Ilala',
      ward: 'Posta / CBD',
      streetLandmark: 'Samora Tower, 4th Floor',
      deliveryNotes: 'Deliver during office hours'
    },
    items: [
      {
        id: 'ci-3',
        productId: 'prod-003',
        product: INITIAL_PRODUCTS[2],
        selectedSize: '32',
        selectedColor: INITIAL_PRODUCTS[2].colors[1],
        quantity: 2,
        unitPrice: 42000
      }
    ],
    subtotal: 84000,
    deliveryFee: 3000,
    discount: 8400,
    total: 78600,
    status: 'delivered',
    paymentMethod: 'tigopesa',
    paymentReference: 'TP-TZ-837491',
    paymentStatus: 'paid',
    timeline: [
      { status: 'new_order', timestamp: '2026-09-18T11:15:00.000Z' },
      { status: 'payment_confirmed', timestamp: '2026-09-18T11:16:40.000Z' },
      { status: 'preparing', timestamp: '2026-09-18T11:30:00.000Z' },
      { status: 'out_for_delivery', timestamp: '2026-09-18T12:00:00.000Z' },
      { status: 'delivered', timestamp: '2026-09-18T12:45:00.000Z', note: 'Customer accepted and signed package' }
    ]
  }
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Language
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('darstore_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('darstore_lang', lang);
  };

  const t = (key: keyof typeof translations['en'], params?: Record<string, string | number>): string => {
    const langDict = translations[language] || translations.en;
    let str = (langDict[key] as string) || (translations.en[key] as string) || key;
    if (params) {
      Object.entries(params).forEach(([pKey, pVal]) => {
        str = str.replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal));
      });
    }
    return str;
  };

  // Auth User State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('darstore_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Navigation State with URL Hash Synchronization
  const [activeView, setActiveViewState] = useState<ActiveView>(() => {
    const hash = window.location.hash.replace('#/', '');
    if (hash === 'login') return 'login';
    if (hash === 'rider') return 'rider_dashboard';
    if (hash === 'admin/login') return 'admin_login';
    if (hash === 'admin') return 'admin_dashboard';
    if (hash === 'catalog') return 'catalog';
    if (hash === 'wishlist') return 'wishlist';
    if (hash === 'orders') return 'orders';
    return 'home';
  });

  const setActiveView = (view: ActiveView) => {
    setActiveViewState(view);
    // Sync hash
    if (view === 'login') window.location.hash = '#/login';
    else if (view === 'rider_dashboard') window.location.hash = '#/rider';
    else if (view === 'admin_login') window.location.hash = '#/admin/login';
    else if (view === 'admin_dashboard') window.location.hash = '#/admin';
    else if (view === 'catalog') window.location.hash = '#/catalog';
    else if (view === 'wishlist') window.location.hash = '#/wishlist';
    else if (view === 'orders') window.location.hash = '#/orders';
    else window.location.hash = '#/';
  };

  // Listen for hash change in window
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      if (hash === 'login') setActiveViewState('login');
      else if (hash === 'rider') setActiveViewState('rider_dashboard');
      else if (hash === 'admin/login') setActiveViewState('admin_login');
      else if (hash === 'admin') setActiveViewState('admin_dashboard');
      else if (hash === 'catalog') setActiveViewState('catalog');
      else if (hash === 'wishlist') setActiveViewState('wishlist');
      else if (hash === 'orders') setActiveViewState('orders');
      else if (!hash || hash === '/') setActiveViewState('home');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<GenderCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('darstore_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('darstore_products', JSON.stringify(products));
  }, [products]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const addProduct = (prod: Omit<Product, 'id' | 'rating' | 'reviewCount' | 'reviews'>) => {
    const newProd: Product = {
      ...prod,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      reviews: []
    };
    setProducts(prev => [newProd, ...prev]);
    showToast(`Product "${newProd.name}" added successfully!`, 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    showToast('Product updated successfully!', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Product deleted.', 'info');
  };

  const updateStock = (productId: string, size: string, newStock: number) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id !== productId) return p;
        return {
          ...p,
          stock: {
            ...p.stock,
            [size]: Math.max(0, newStock)
          }
        };
      })
    );
  };

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('darstore_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('darstore_cart', JSON.stringify(cart));
  }, [cart]);

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);

  const addToCart = (product: Product, size: ProductSize, color: ProductColor, quantity = 1) => {
    const cartItemId = `${product.id}-${size}-${color.name}`;
    setCart(prev => {
      const existing = prev.find(item => item.id === cartItemId);
      if (existing) {
        return prev.map(item =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [
          ...prev,
          {
            id: cartItemId,
            productId: product.id,
            product,
            selectedSize: size,
            selectedColor: color,
            quantity,
            unitPrice: product.price
          }
        ];
      }
    });
    showToast(t('addedToCartSuccess', { name: language === 'sw' ? product.nameSw : product.name }), 'success');
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev => prev.map(item => (item.id === cartItemId ? { ...item, quantity } : item)));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('darstore_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('darstore_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to wishlist!', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('darstore_orders');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('darstore_orders', JSON.stringify(orders));
  }, [orders]);

  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'timeline'>): Order => {
    const newId = `DAR-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();
    
    const newOrder: Order = {
      ...orderData,
      id: newId,
      createdAt: now,
      timeline: [
        {
          status: 'new_order',
          timestamp: now,
          note: 'Customer placed order online'
        },
        ...(orderData.paymentStatus === 'paid'
          ? [
              {
                status: 'payment_confirmed' as OrderStatus,
                timestamp: new Date(Date.now() + 2000).toISOString(),
                note: `Mobile money received (${orderData.paymentReference || 'Direct'})`
              }
            ]
          : [])
      ]
    };

    // Add to Rider available deliveries
    const newRiderDelivery: RiderDelivery = {
      id: `DEL-${Math.floor(200 + Math.random() * 800)}`,
      orderId: newId,
      pickupLocation: 'DarStore Kariakoo Hub, Uhuru Street',
      deliveryAddress: `${orderData.customer.district} - ${orderData.customer.ward} (${orderData.customer.streetLandmark})`,
      customerName: orderData.customer.fullName,
      customerPhone: orderData.customer.phoneNumber,
      itemsSummary: orderData.items.map(i => `${i.quantity}x ${i.product.name} (${i.selectedSize})`).join(', '),
      packageCount: orderData.items.reduce((s, i) => s + i.quantity, 0),
      fee: Math.max(3500, orderData.deliveryFee + 1000),
      status: 'available',
      createdAt: now
    };

    setRiderDeliveries(prev => [newRiderDelivery, ...prev]);

    // Decrement stock
    setProducts(prevProducts => {
      const updated = [...prevProducts];
      orderData.items.forEach(cartItem => {
        const prodIndex = updated.findIndex(p => p.id === cartItem.productId);
        if (prodIndex !== -1) {
          const prod = { ...updated[prodIndex] };
          const sizeStock = prod.stock[cartItem.selectedSize] || 0;
          prod.stock = {
            ...prod.stock,
            [cartItem.selectedSize]: Math.max(0, sizeStock - cartItem.quantity)
          };
          updated[prodIndex] = prod;
        }
      });
      return updated;
    });

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id !== orderId) return ord;
        const now = new Date().toISOString();
        return {
          ...ord,
          status: newStatus,
          paymentStatus: newStatus === 'delivered' && ord.paymentMethod === 'cod' ? 'paid' : ord.paymentStatus,
          timeline: [
            ...ord.timeline,
            {
              status: newStatus,
              timestamp: now,
              note: note || `Status updated to ${newStatus}`
            }
          ]
        };
      })
    );
    showToast(`Order #${orderId} status: ${newStatus.replace('_', ' ')}`, 'info');
  };

  const getOrderById = (orderId: string) => {
    return orders.find(o => o.id.toLowerCase() === orderId.toLowerCase());
  };

  const getOrdersByPhone = (phone: string) => {
    const clean = phone.replace(/[^0-9]/g, '');
    return orders.filter(o => o.customer.phoneNumber.replace(/[^0-9]/g, '').includes(clean));
  };

  // Rider Deliveries Management
  const [riderDeliveries, setRiderDeliveries] = useState<RiderDelivery[]>(() => {
    const saved = localStorage.getItem('darstore_rider_deliveries');
    return saved ? JSON.parse(saved) : INITIAL_RIDER_DELIVERIES;
  });

  useEffect(() => {
    localStorage.setItem('darstore_rider_deliveries', JSON.stringify(riderDeliveries));
  }, [riderDeliveries]);

  const acceptDelivery = (deliveryId: string) => {
    const now = new Date().toISOString();
    setRiderDeliveries(prev =>
      prev.map(del => {
        if (del.id !== deliveryId) return del;
        return {
          ...del,
          status: 'assigned',
          assignedRiderId: currentUser?.id || 'rider-demo',
          assignedAt: now
        };
      })
    );
    // Sync order status
    const target = riderDeliveries.find(d => d.id === deliveryId);
    if (target) {
      updateOrderStatus(target.orderId, 'preparing', `Rider ${currentUser?.name || 'Juma'} accepted delivery assignment`);
    }
    showToast('Delivery accepted! Please proceed to pickup hub.', 'success');
  };

  const updateDeliveryTaskStatus = (deliveryId: string, status: DeliveryTaskStatus) => {
    const now = new Date().toISOString();
    setRiderDeliveries(prev =>
      prev.map(del => {
        if (del.id !== deliveryId) return del;
        return {
          ...del,
          status,
          ...(status === 'delivered' ? { deliveredAt: now } : {})
        };
      })
    );

    const target = riderDeliveries.find(d => d.id === deliveryId);
    if (target) {
      if (status === 'in_transit') {
        updateOrderStatus(target.orderId, 'out_for_delivery', 'Rider is en route to customer location');
      } else if (status === 'delivered') {
        updateOrderStatus(target.orderId, 'delivered', 'Rider completed parcel handover to customer');
      }
    }
    showToast(`Delivery updated to ${status.replace('_', ' ')}!`, 'success');
  };

  const toggleRiderOnline = () => {
    if (currentUser && currentUser.role === 'rider') {
      const updated = { ...currentUser, isOnline: !currentUser.isOnline };
      setCurrentUser(updated);
      localStorage.setItem('darstore_current_user', JSON.stringify(updated));
      showToast(`Status: Rider is now ${updated.isOnline ? 'ONLINE' : 'OFFLINE'}`, 'info');
    }
  };

  // Delivery Zones
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(() => {
    const saved = localStorage.getItem('darstore_zones');
    return saved ? JSON.parse(saved) : DAR_DELIVERY_ZONES;
  });

  useEffect(() => {
    localStorage.setItem('darstore_zones', JSON.stringify(deliveryZones));
  }, [deliveryZones]);

  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(deliveryZones[0]);

  const updateDeliveryFee = (zoneId: string, newFee: number) => {
    setDeliveryZones(prev =>
      prev.map(z => (z.id === zoneId ? { ...z, fee: Math.max(0, newFee) } : z))
    );
    showToast('Delivery fee updated!', 'success');
  };

  // Promo Codes
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

  const applyPromoCode = (code: string): { success: boolean; message: string } => {
    const found = INITIAL_PROMO_CODES.find(p => p.code.toUpperCase() === code.trim().toUpperCase() && p.isActive);
    if (!found) {
      return { success: false, message: t('invalidPromo') };
    }
    if (found.minOrderAmount && cartTotal < found.minOrderAmount) {
      return {
        success: false,
        message: `Requires minimum order of TZS ${found.minOrderAmount.toLocaleString()}`
      };
    }
    setAppliedPromo(found);
    showToast(t('promoApplied', { code: found.code }), 'success');
    return { success: true, message: 'Promo applied!' };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    showToast('Promo code removed', 'info');
  };

  // Authentication Logic (Customer / Rider / Admin)
  const login = (email: string, pass: string, role: UserRole): { success: boolean; message?: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    const demo = DEMO_CREDENTIALS[role];

    // Check credentials against demo role or general match
    if (
      (trimmedEmail === demo.email && pass === demo.password) ||
      (role === 'admin' && (pass === 'admin123' || pass === 'michaeli2026')) ||
      (pass === 'password123' || pass === 'demo123')
    ) {
      const user: AuthUser = {
        id: `${role}-${Date.now()}`,
        email: trimmedEmail,
        name: demo.name,
        role,
        phone: demo.phone,
        ...(role === 'rider'
          ? {
              vehicleType: (demo as any).vehicleType,
              vehiclePlate: (demo as any).vehiclePlate,
              zone: (demo as any).zone,
              rating: (demo as any).rating,
              completedDeliveries: (demo as any).completedDeliveries,
              isOnline: true
            }
          : {})
      };

      setCurrentUser(user);
      localStorage.setItem('darstore_current_user', JSON.stringify(user));

      if (role === 'customer') {
        showToast(`Welcome back, ${user.name}!`, 'success');
        setActiveView('home');
      } else if (role === 'rider') {
        showToast(`Welcome back Rider ${user.name}!`, 'success');
        setActiveView('rider_dashboard');
      } else if (role === 'admin') {
        showToast(`Logged into Owner Admin Portal.`, 'success');
        setActiveView('admin_dashboard');
      }

      return { success: true };
    }

    return {
      success: false,
      message: `Invalid credentials. For demo use: ${demo.email} and password: ${demo.password}`
    };
  };

  const register = (userData: Partial<AuthUser>, role: UserRole): { success: boolean; message?: string } => {
    const newUser: AuthUser = {
      id: `${role}-${Date.now()}`,
      email: userData.email || `user@clothesapp.tz`,
      name: userData.name || 'Demo User',
      role,
      phone: userData.phone || '0754000000',
      ...(role === 'rider'
        ? {
            vehicleType: userData.vehicleType || 'Boxer BM 150',
            vehiclePlate: userData.vehiclePlate || 'MC 123 ABC',
            zone: userData.zone || 'Kinondoni',
            rating: 5.0,
            completedDeliveries: 0,
            isOnline: true
          }
        : {})
    };

    setCurrentUser(newUser);
    localStorage.setItem('darstore_current_user', JSON.stringify(newUser));

    if (role === 'customer') {
      showToast(`Account created! Welcome, ${newUser.name}.`, 'success');
      setActiveView('home');
    } else if (role === 'rider') {
      showToast(`Rider registration successful! Welcome to the delivery fleet.`, 'success');
      setActiveView('rider_dashboard');
    }

    return { success: true };
  };

  const logout = () => {
    const prevRole = currentUser?.role;
    setCurrentUser(null);
    localStorage.removeItem('darstore_current_user');
    showToast('You have been logged out.', 'info');
    if (prevRole === 'admin') {
      setActiveView('admin_login');
    } else {
      setActiveView('login');
    }
  };

  // Size Guide
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  return (
    <StoreContext.Provider
      value={{
        language,
        setLanguage,
        t,
        activeView,
        setActiveView,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        currentUser,
        login,
        register,
        logout,
        products,
        selectedProduct,
        setSelectedProduct,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartItemsCount,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        orders,
        activeOrder,
        setActiveOrder,
        createOrder,
        updateOrderStatus,
        getOrderById,
        getOrdersByPhone,
        riderDeliveries,
        acceptDelivery,
        updateDeliveryTaskStatus,
        toggleRiderOnline,
        deliveryZones,
        updateDeliveryFee,
        selectedZone,
        setSelectedZone,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        toasts,
        showToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
