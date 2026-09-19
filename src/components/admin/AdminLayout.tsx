import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Package,
  ShoppingBag,
  Truck,
  Users,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Phone,
  MessageCircle,
  CheckCircle,
  AlertTriangle,
  Lock,
  ArrowUpDown,
  Search,
  RefreshCw,
  ExternalLink,
  Bike,
  Boxes,
  Settings
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { OrderStatus, Product, ProductSize } from '../../types';
import { formatTZS } from '../../data/locations';
import { DEMO_CREDENTIALS } from '../../data/mockAuth';

export const AdminLayout: React.FC = () => {
  const {
    currentUser,
    logout,
    orders,
    products,
    updateOrderStatus,
    addProduct,
    updateProduct,
    deleteProduct,
    deliveryZones,
    updateDeliveryFee,
    updateStock,
    riderDeliveries,
    t,
    language,
    setActiveView
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'products' | 'riders' | 'inventory' | 'delivery' | 'customers' | 'settings'
  >('overview');

  // Product Add / Edit Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodForm, setProdForm] = useState({
    name: '',
    nameSw: '',
    category: 'men',
    subcategory: 'Shirts',
    subcategorySw: 'Mashati',
    price: 35000,
    originalPrice: 40000,
    images: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    description: '',
    descriptionSw: '',
    sizes: 'S, M, L, XL',
    material: '100% Cotton',
    materialSw: '100% Pamba',
    careInstructions: 'Machine wash cold',
    careInstructionsSw: 'Fua kwa maji ya baridi'
  });

  // Delivery Fee Edit State
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);
  const [newZoneFee, setNewZoneFee] = useState<number>(3000);

  // Status Filter for Orders
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState<string>('');

  // If user is not logged in as Admin, redirect to admin_login
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-card space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-subtle">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Admin Authentication Required
            </h1>
            <p className="text-xs text-slate-500">
              Please sign in with authorized store administrator credentials.
            </p>
          </div>

          <button
            onClick={() => setActiveView('admin_login')}
            className="w-full py-3 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold transition-colors shadow-subtle"
          >
            Go to Admin Login Page
          </button>
        </div>
      </div>
    );
  }

  // Admin Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 0);
  const pendingOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
  const lowStockProducts = products.filter(p => {
    const total = Object.values(p.stock).reduce((a, b) => a + b, 0);
    return total <= 4;
  });

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdForm({
      name: '',
      nameSw: '',
      category: 'men',
      subcategory: 'Shirts',
      subcategorySw: 'Mashati',
      price: 35000,
      originalPrice: 40000,
      images: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      description: 'Dar es Salaam fashion wear',
      descriptionSw: 'Mavazi ya kisasa ya Dar es Salaam',
      sizes: 'S, M, L, XL',
      material: '100% Cotton',
      materialSw: '100% Pamba',
      careInstructions: 'Machine wash cold',
      careInstructionsSw: 'Fua kwa maji ya baridi'
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProdForm({
      name: prod.name,
      nameSw: prod.nameSw,
      category: prod.category,
      subcategory: prod.subcategory,
      subcategorySw: prod.subcategorySw,
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      images: prod.images.join(', '),
      description: prod.description,
      descriptionSw: prod.descriptionSw,
      sizes: prod.sizes.join(', '),
      material: prod.material,
      materialSw: prod.materialSw,
      careInstructions: prod.careInstructions,
      careInstructionsSw: prod.careInstructionsSw
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const sizeList = prodForm.sizes.split(',').map(s => s.trim() as ProductSize).filter(Boolean);
    const imagesList = prodForm.images.split(',').map(i => i.trim()).filter(Boolean);

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: prodForm.name,
        nameSw: prodForm.nameSw,
        category: prodForm.category as any,
        subcategory: prodForm.subcategory,
        subcategorySw: prodForm.subcategorySw,
        price: Number(prodForm.price),
        originalPrice: Number(prodForm.originalPrice),
        images: imagesList,
        description: prodForm.description,
        descriptionSw: prodForm.descriptionSw,
        sizes: sizeList,
        material: prodForm.material,
        materialSw: prodForm.materialSw,
        careInstructions: prodForm.careInstructions,
        careInstructionsSw: prodForm.careInstructionsSw
      });
    } else {
      const initialStock: Record<string, number> = {};
      sizeList.forEach(s => {
        initialStock[s] = 10;
      });

      addProduct({
        name: prodForm.name,
        nameSw: prodForm.nameSw || prodForm.name,
        category: prodForm.category as any,
        subcategory: prodForm.subcategory,
        subcategorySw: prodForm.subcategorySw,
        price: Number(prodForm.price),
        originalPrice: Number(prodForm.originalPrice),
        images: imagesList,
        description: prodForm.description,
        descriptionSw: prodForm.descriptionSw,
        sizes: sizeList,
        colors: [
          { name: 'Pure White', nameSw: 'Nyeupe', hex: '#ffffff' },
          { name: 'Dark Navy', nameSw: 'Bluu', hex: '#1e293b' }
        ],
        stock: initialStock,
        material: prodForm.material,
        materialSw: prodForm.materialSw,
        careInstructions: prodForm.careInstructions,
        careInstructionsSw: prodForm.careInstructionsSw
      });
    }
    setIsProductModalOpen(false);
  };

  const filteredOrdersList = orders.filter(o => {
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.customer.fullName.toLowerCase().includes(q) ||
        o.customer.phoneNumber.includes(q) ||
        o.customer.ward.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Admin Header Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              clothesAPP Admin Management Portal
            </h1>
            <p className="text-xs text-slate-500">
              Logged in as <strong className="text-slate-800">{currentUser.name}</strong> • Dar es Salaam Store Hub
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('home')}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700"
          >
            Storefront View
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Admin Full Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'overview', label: 'Dashboard', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'products', label: `Products (${products.length})`, icon: <Package className="w-4 h-4" /> },
          { id: 'orders', label: `Orders (${pendingOrders.length} pending)`, icon: <ShoppingBag className="w-4 h-4" /> },
          { id: 'customers', label: 'Customers', icon: <Users className="w-4 h-4" /> },
          { id: 'riders', label: `Riders Fleet (${riderDeliveries.length})`, icon: <Bike className="w-4 h-4" /> },
          { id: 'inventory', label: `Inventory & Stock`, icon: <Boxes className="w-4 h-4" /> },
          { id: 'delivery', label: 'Delivery Pricing', icon: <Truck className="w-4 h-4" /> },
          { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-slate-900 text-white shadow-subtle'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Dashboard Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-subtle space-y-1">
              <span className="text-xs text-slate-500 font-bold uppercase">Total Revenue</span>
              <div className="text-2xl font-extrabold text-slate-900">{formatTZS(totalRevenue)}</div>
              <p className="text-[11px] text-emerald-700 font-semibold">From paid orders in TZS</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-subtle space-y-1">
              <span className="text-xs text-slate-500 font-bold uppercase">Active Orders</span>
              <div className="text-2xl font-extrabold text-slate-900">{orders.length}</div>
              <p className="text-[11px] text-slate-500">All registered customer orders</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-subtle space-y-1">
              <span className="text-xs text-slate-500 font-bold uppercase">Rider Dispatches</span>
              <div className="text-2xl font-extrabold text-brand-700">{riderDeliveries.length}</div>
              <p className="text-[11px] text-brand-800 font-semibold">Deliveries tracked in Dar</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-subtle space-y-1">
              <span className="text-xs text-slate-500 font-bold uppercase">Low Stock Warnings</span>
              <div className="text-2xl font-extrabold text-amber-600">{lowStockProducts.length}</div>
              <p className="text-[11px] text-amber-700 font-semibold">Items $\le 4$ units left</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-subtle space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm text-slate-900">Recent Customer Orders</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-brand-700 hover:text-brand-800"
                >
                  View All Orders
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {orders.slice(0, 4).map(o => (
                  <div key={o.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">#{o.id}</span>
                        <span className="text-slate-500">{o.customer.fullName}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {o.customer.district} • {formatTZS(o.total)}
                      </p>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                      {o.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Low Stock Alerts */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-subtle space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Low Inventory Warnings</span>
                </h3>
                <button
                  onClick={() => setActiveTab('inventory')}
                  className="text-xs font-bold text-brand-700 hover:text-brand-800"
                >
                  Manage Stock
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {lowStockProducts.length === 0 ? (
                  <p className="py-4 text-xs text-slate-400 text-center">All clothes have adequate stock levels.</p>
                ) : (
                  lowStockProducts.map(p => {
                    const total = Object.values(p.stock).reduce((a, b) => a + b, 0);
                    return (
                      <div key={p.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <img src={p.images[0]} alt="" className="w-8 h-8 rounded object-cover" />
                          <div>
                            <p className="font-bold text-slate-900">{p.name}</p>
                            <p className="text-[11px] text-slate-400">{p.subcategory}</p>
                          </div>
                        </div>

                        <span className="font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px]">
                          {total} units left
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Products Management */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">
              Clothing Catalog ({products.length} active items)
            </h3>
            <button
              onClick={handleOpenAddProduct}
              className="flex items-center gap-1.5 px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold transition-colors shadow-subtle"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-subtle">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Photo</th>
                    <th className="py-3 px-4">Product Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price (TZS)</th>
                    <th className="py-3 px-4">Sizes & Stock</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {products.map(prod => {
                    const totalStock = Object.values(prod.stock).reduce((a, b) => a + b, 0);

                    return (
                      <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-10 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{prod.name}</div>
                          <div className="text-[11px] text-slate-400">{prod.nameSw}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="capitalize font-semibold text-slate-700">
                            {prod.category}
                          </span>
                          <span className="text-[11px] text-slate-400 block">{prod.subcategory}</span>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {formatTZS(prod.price)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {prod.sizes.map(sz => (
                              <span
                                key={sz}
                                className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-700"
                              >
                                {sz}: {prod.stock[sz] || 0}
                              </span>
                            ))}
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            Total: {totalStock} units
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditProduct(prod)}
                              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200"
                              title="Edit product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteProduct(prod.id)}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Orders Management */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={orderSearch}
                onChange={e => setOrderSearch(e.target.value)}
                placeholder="Search orders by customer name, phone, or ward..."
                className="w-full text-xs pl-10 pr-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-slate-900"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-500 font-bold whitespace-nowrap">Status:</span>
              <select
                value={orderStatusFilter}
                onChange={e => setOrderStatusFilter(e.target.value)}
                className="text-xs font-semibold p-2 rounded-xl border border-slate-300 bg-white"
              >
                <option value="all">All Statuses ({orders.length})</option>
                <option value="new_order">New Orders</option>
                <option value="payment_confirmed">Payment Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-subtle">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Order ID & Date</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Area & Landmark</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status Update</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {filteredOrdersList.map(ord => (
                    <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        <div>#{ord.id}</div>
                        <div className="text-[10px] text-slate-400 font-sans font-normal">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{ord.customer.fullName}</div>
                        <div className="text-[11px] text-slate-500">{ord.customer.phoneNumber}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">
                          {ord.customer.district} - {ord.customer.ward}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 max-w-[160px]">
                          {ord.customer.streetLandmark}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {ord.items.map(i => (
                          <div key={i.id} className="text-[11px]">
                            {i.quantity}x {i.product.name} ({i.selectedSize})
                          </div>
                        ))}
                      </td>

                      <td className="py-3 px-4 font-bold text-slate-900">
                        <div>{formatTZS(ord.total)}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">
                          {ord.paymentMethod} ({ord.paymentStatus})
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <select
                          value={ord.status}
                          onChange={e => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className="text-[11px] font-bold py-1 px-2 rounded-lg border bg-white focus:outline-none"
                        >
                          <option value="new_order">New Order</option>
                          <option value="payment_confirmed">Payment Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`https://wa.me/255${ord.customer.phoneNumber.replace(/^0/, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                            title="Message on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`tel:${ord.customer.phoneNumber}`}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                            title="Call Customer"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Riders Fleet Management */}
      {activeTab === 'riders' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-subtle space-y-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">Rider Fleet & Assignments</h3>
              <p className="text-xs text-slate-500">
                Track registered boda riders, operational status, and pending package assignments.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Task ID & Order</th>
                    <th className="py-3 px-4">Pickup Point</th>
                    <th className="py-3 px-4">Destination Area</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Payout Fee</th>
                    <th className="py-3 px-4">Delivery Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {riderDeliveries.map(d => (
                    <tr key={d.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        <div>{d.id}</div>
                        <div className="text-[10px] text-slate-400">Order #{d.orderId}</div>
                      </td>
                      <td className="py-3 px-4">{d.pickupLocation}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{d.deliveryAddress}</td>
                      <td className="py-3 px-4">
                        <div>{d.customerName}</div>
                        <div className="text-[10px] text-slate-400">{d.customerPhone}</div>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">{formatTZS(d.fee)}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                          {d.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Inventory & Stock */}
      {activeTab === 'inventory' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-subtle space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Live Inventory & Size Stock Manager</h3>
            <p className="text-xs text-slate-500">
              Adjust size stock levels in real time. Automatic deductions occur upon customer checkout.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {products.map(p => (
              <div key={p.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img src={p.images[0]} alt="" className="w-12 h-14 rounded-lg object-cover bg-slate-100 border border-slate-200" />
                  <div>
                    <h4 className="font-bold text-slate-900">{p.name}</h4>
                    <p className="text-slate-500 text-[11px]">{p.subcategory} • {formatTZS(p.price)}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {p.sizes.map(sz => (
                    <div key={sz} className="flex items-center border border-slate-200 rounded-lg p-1 bg-slate-50">
                      <span className="px-1.5 font-bold text-slate-700 text-[11px]">{sz}:</span>
                      <input
                        type="number"
                        min="0"
                        value={p.stock[sz] ?? 0}
                        onChange={e => updateStock(p.id, sz, Number(e.target.value))}
                        className="w-14 p-1 text-xs font-bold rounded border border-slate-300 bg-white text-center"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Delivery Fees */}
      {activeTab === 'delivery' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-subtle space-y-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Dar es Salaam District Delivery Fees
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure boda and courier delivery prices per district across Dar es Salaam.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {deliveryZones.map(zone => (
                <div
                  key={zone.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900">{zone.district}</span>
                    <span className="text-xs font-bold text-brand-700">{formatTZS(zone.fee)}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Est: {zone.estimatedHours}
                  </p>
                  <div className="text-[10px] text-slate-400 line-clamp-2">
                    Wards: {zone.wards.join(', ')}
                  </div>

                  {editingZoneId === zone.id ? (
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                      <input
                        type="number"
                        step="500"
                        value={newZoneFee}
                        onChange={e => setNewZoneFee(Number(e.target.value))}
                        className="w-24 text-xs p-1.5 rounded border border-slate-300"
                      />
                      <button
                        onClick={() => {
                          updateDeliveryFee(zone.id, newZoneFee);
                          setEditingZoneId(null);
                        }}
                        className="px-2.5 py-1.5 bg-slate-900 text-white rounded text-xs font-bold"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingZoneId(null)}
                        className="text-xs text-slate-500"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingZoneId(zone.id);
                        setNewZoneFee(zone.fee);
                      }}
                      className="w-full py-1.5 text-xs font-bold rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-700"
                    >
                      Update Fee
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Customers */}
      {activeTab === 'customers' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-subtle space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Customers Directory</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified customer contact profiles and total lifetime value.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Phone Number</th>
                  <th className="py-3 px-4">Delivery Area</th>
                  <th className="py-3 px-4">Total Orders</th>
                  <th className="py-3 px-4 text-right">Total Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{o.customer.fullName}</td>
                    <td className="py-3 px-4">{o.customer.phoneNumber}</td>
                    <td className="py-3 px-4">
                      {o.customer.district} — {o.customer.ward}
                    </td>
                    <td className="py-3 px-4">1 order</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      {formatTZS(o.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 8: Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-subtle space-y-4 max-w-xl">
          <h3 className="font-bold text-base text-slate-900">Store Settings & Operations</h3>
          <div className="space-y-3 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Store Name:</span>
                <span className="font-bold text-slate-900">clothesAPP (DarStore)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Hub Location:</span>
                <span className="font-bold text-slate-900">Kariakoo & Masaki, Dar es Salaam</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Owner Contact:</span>
                <span className="font-bold text-slate-900">+255 754 000 000 (Michaeli)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Supported Networks:</span>
                <span className="font-bold text-slate-900">M-Pesa, Tigo Pesa, Airtel Money, COD</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Add / Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-modal p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Name (English)</label>
                <input
                  type="text"
                  required
                  value={prodForm.name}
                  onChange={e => setProdForm({ ...prodForm, name: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Name (Swahili)</label>
                <input
                  type="text"
                  required
                  value={prodForm.nameSw}
                  onChange={e => setProdForm({ ...prodForm, nameSw: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={prodForm.category}
                    onChange={e => setProdForm({ ...prodForm, category: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subcategory</label>
                  <input
                    type="text"
                    value={prodForm.subcategory}
                    onChange={e => setProdForm({ ...prodForm, subcategory: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (TZS)</label>
                  <input
                    type="number"
                    required
                    value={prodForm.price}
                    onChange={e => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Original Price (TZS)</label>
                  <input
                    type="number"
                    value={prodForm.originalPrice}
                    onChange={e => setProdForm({ ...prodForm, originalPrice: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="text"
                  required
                  value={prodForm.images}
                  onChange={e => setProdForm({ ...prodForm, images: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Available Sizes (comma separated)</label>
                <input
                  type="text"
                  value={prodForm.sizes}
                  onChange={e => setProdForm({ ...prodForm, sizes: e.target.value })}
                  placeholder="S, M, L, XL"
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-brand-700 text-white font-bold hover:bg-brand-800"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
