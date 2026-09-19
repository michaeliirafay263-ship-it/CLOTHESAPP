import React, { useState } from 'react';
import {
  Bike,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  TrendingUp,
  User,
  LogOut,
  Power,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Navigation,
  Calendar
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatTZS } from '../../data/locations';
import { DeliveryTaskStatus, RiderDelivery } from '../../types';

export const RiderDashboard: React.FC = () => {
  const {
    currentUser,
    logout,
    riderDeliveries,
    acceptDelivery,
    updateDeliveryTaskStatus,
    toggleRiderOnline,
    t
  } = useStore();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'available' | 'assigned' | 'history' | 'profile'>('dashboard');

  const isOnline = currentUser?.isOnline ?? true;

  // Filter deliveries
  const availableDeliveries = riderDeliveries.filter(d => d.status === 'available');
  const assignedDeliveries = riderDeliveries.filter(
    d => d.status === 'assigned' || d.status === 'in_transit'
  );
  const completedDeliveries = riderDeliveries.filter(d => d.status === 'delivered');

  // Stats calculation
  const totalEarnings = completedDeliveries.reduce((sum, d) => sum + d.fee, 0);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col md:flex-row">
      {/* 1. Rider Left Navigation Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col shrink-0 border-r border-slate-800">
        {/* Rider Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-700 text-white flex items-center justify-center font-bold">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-tight">Rider Fleet</div>
              <p className="text-[11px] text-slate-400">clothesAPP Dar es Salaam</p>
            </div>
          </div>
        </div>

        {/* Rider Info Card */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-brand-400 flex items-center justify-center font-bold text-xs">
                {currentUser?.name.charAt(0) || 'R'}
              </div>
              <div>
                <h3 className="text-xs font-bold text-white truncate max-w-[120px]">
                  {currentUser?.name || 'Juma Rider'}
                </h3>
                <span className="text-[10px] text-slate-400">
                  {currentUser?.vehiclePlate || 'MC 492 EBD'}
                </span>
              </div>
            </div>

            {/* Online / Offline Toggle */}
            <button
              onClick={toggleRiderOnline}
              className={`p-1.5 rounded-lg border flex items-center gap-1 text-[10px] font-bold transition-colors ${
                isOnline
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
              title="Toggle Duty Status"
            >
              <Power className="w-3.5 h-3.5" />
              <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <TrendingUp className="w-4 h-4" /> },
            {
              id: 'available',
              label: `Available Deliveries (${availableDeliveries.length})`,
              icon: <Package className="w-4 h-4" />
            },
            {
              id: 'assigned',
              label: `Assigned Tasks (${assignedDeliveries.length})`,
              icon: <Navigation className="w-4 h-4" />
            },
            {
              id: 'history',
              label: `Delivery History (${completedDeliveries.length})`,
              icon: <CheckCircle2 className="w-4 h-4" />
            },
            { id: 'profile', label: 'Rider Profile', icon: <User className="w-4 h-4" /> }
          ].map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-brand-700 text-white font-bold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-bold transition-colors border border-slate-700"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Dashboard Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
        {/* Top Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {isOnline ? 'Active on Dar es Salaam Dispatch Network' : 'Currently Offline'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Rider Operations Center
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
              Zone: {currentUser?.zone || 'Kinondoni & Ilala'}
            </span>
          </div>
        </div>

        {/* View 1: Overview Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            {/* 4 KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-subtle space-y-1">
                <span className="text-xs text-slate-500 font-bold uppercase">Total Payout Earnings</span>
                <div className="text-2xl font-extrabold text-slate-900">{formatTZS(totalEarnings + 35000)}</div>
                <p className="text-[11px] text-emerald-700 font-semibold">Ready for weekly M-Pesa payout</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-subtle space-y-1">
                <span className="text-xs text-slate-500 font-bold uppercase">Assigned Tasks</span>
                <div className="text-2xl font-extrabold text-brand-700">{assignedDeliveries.length}</div>
                <p className="text-[11px] text-slate-500">In-transit or awaiting pickup</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-subtle space-y-1">
                <span className="text-xs text-slate-500 font-bold uppercase">Available Jobs</span>
                <div className="text-2xl font-extrabold text-slate-900">{availableDeliveries.length}</div>
                <p className="text-[11px] text-slate-500">Ready in Kariakoo / Masaki hubs</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-subtle space-y-1">
                <span className="text-xs text-slate-500 font-bold uppercase">Customer Rating</span>
                <div className="text-2xl font-extrabold text-amber-500">4.9 ★</div>
                <p className="text-[11px] text-slate-500">Based on 142 successful drops</p>
              </div>
            </div>

            {/* Active Deliveries Quick List */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-subtle space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-brand-700" />
                  <span>Current Assigned Delivery Task</span>
                </h3>
                <button
                  onClick={() => setActiveTab('assigned')}
                  className="text-xs font-bold text-brand-700 hover:text-brand-800"
                >
                  Manage All Assigned
                </button>
              </div>

              {assignedDeliveries.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500 space-y-2">
                  <p>No active delivery in progress.</p>
                  <button
                    onClick={() => setActiveTab('available')}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
                  >
                    Browse Available Jobs ({availableDeliveries.length})
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {assignedDeliveries.map(task => (
                    <div
                      key={task.id}
                      className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-slate-900">
                          #{task.orderId} • Task {task.id}
                        </span>
                        <span className="text-xs font-extrabold text-brand-700 bg-brand-50 border border-brand-200 px-2.5 py-0.5 rounded-lg">
                          Payout: {formatTZS(task.fee)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1">
                          <span className="font-bold text-slate-500 text-[10px] uppercase">
                            1. Pickup From
                          </span>
                          <p className="font-semibold text-slate-900">{task.pickupLocation}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="font-bold text-slate-500 text-[10px] uppercase">
                            2. Deliver To Customer
                          </span>
                          <p className="font-semibold text-slate-900">{task.deliveryAddress}</p>
                          <p className="text-slate-500 text-[11px]">{task.customerName} ({task.customerPhone})</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${task.customerPhone}`}
                            className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-100 flex items-center gap-1.5"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Call Customer</span>
                          </a>
                          <a
                            href={`https://wa.me/255${task.customerPhone.replace(/^0/, '')}?text=Habari%20${encodeURIComponent(task.customerName)},%20naitwa%20${encodeURIComponent(currentUser?.name || 'Rider')}%20kutoka%20clothesAPP%20nimebeba%20mzigo%20wako.`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold hover:bg-emerald-100 flex items-center gap-1.5"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        </div>

                        {task.status === 'assigned' ? (
                          <button
                            onClick={() => updateDeliveryTaskStatus(task.id, 'in_transit')}
                            className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800"
                          >
                            Confirm Picked Up (Start Trip)
                          </button>
                        ) : (
                          <button
                            onClick={() => updateDeliveryTaskStatus(task.id, 'delivered')}
                            className="px-4 py-1.5 bg-brand-700 text-white rounded-lg text-xs font-bold hover:bg-brand-800"
                          >
                            Mark as Handed Over / Delivered
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* View 2: Available Deliveries */}
        {activeTab === 'available' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Available Deliveries in Dar es Salaam ({availableDeliveries.length})
                </h3>
                <p className="text-xs text-slate-500">
                  New orders packed and ready for immediate boda rider collection.
                </p>
              </div>
            </div>

            {availableDeliveries.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-xs text-slate-500 space-y-2">
                <Package className="w-10 h-10 mx-auto text-slate-400" />
                <p className="font-bold text-slate-800 text-sm">All packages currently dispatched!</p>
                <p>Check back in a few minutes as new customer orders arrive.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableDeliveries.map(del => (
                  <div
                    key={del.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-subtle space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-slate-900">
                          #{del.orderId}
                        </span>
                        <span className="text-xs font-extrabold text-brand-700 bg-brand-50 border border-brand-200 px-2.5 py-0.5 rounded-lg">
                          Payout: {formatTZS(del.fee)}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">
                              Pickup Hub
                            </span>
                            <span className="font-bold text-slate-800">{del.pickupLocation}</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Navigation className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">
                              Destination
                            </span>
                            <span className="font-bold text-slate-800">{del.deliveryAddress}</span>
                            <span className="text-[11px] text-slate-500 block mt-0.5">
                              {del.customerName} ({del.customerPhone})
                            </span>
                          </div>
                        </div>

                        <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-600 border border-slate-200/60">
                          <strong>Clothes: </strong> {del.itemsSummary}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => acceptDelivery(del.id)}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-subtle flex items-center justify-center gap-2"
                    >
                      <Package className="w-4 h-4" />
                      <span>Accept Delivery & Route</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* View 3: Assigned Deliveries */}
        {activeTab === 'assigned' && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="font-bold text-base text-slate-900">
              Assigned Tasks ({assignedDeliveries.length})
            </h3>

            {assignedDeliveries.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-xs text-slate-500">
                You have no active assignments. Select a job from the Available Deliveries tab.
              </div>
            ) : (
              <div className="space-y-4">
                {assignedDeliveries.map(del => (
                  <div
                    key={del.id}
                    className="bg-white border border-slate-200 rounded-2xl p-6 shadow-subtle space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <span className="font-mono font-bold text-sm text-slate-900">
                          #{del.orderId} • Task {del.id}
                        </span>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Status: <strong className="uppercase text-brand-700">{del.status.replace('_', ' ')}</strong>
                        </div>
                      </div>
                      <span className="text-sm font-extrabold text-brand-700">
                        Payout: {formatTZS(del.fee)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                        <span className="font-bold text-slate-400 uppercase text-[10px]">
                          Pickup Hub Location
                        </span>
                        <p className="font-bold text-slate-900">{del.pickupLocation}</p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                        <span className="font-bold text-slate-400 uppercase text-[10px]">
                          Customer Delivery Address
                        </span>
                        <p className="font-bold text-slate-900">{del.deliveryAddress}</p>
                        <p className="text-slate-500">{del.customerName} • {del.customerPhone}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${del.customerPhone}`}
                          className="px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-100 flex items-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </a>
                        <a
                          href={`https://wa.me/255${del.customerPhone.replace(/^0/, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold hover:bg-emerald-100 flex items-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>

                      {del.status === 'assigned' ? (
                        <button
                          onClick={() => updateDeliveryTaskStatus(del.id, 'in_transit')}
                          className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                        >
                          Confirm Picked Up (In Transit)
                        </button>
                      ) : (
                        <button
                          onClick={() => updateDeliveryTaskStatus(del.id, 'delivered')}
                          className="px-5 py-2 bg-brand-700 text-white rounded-xl text-xs font-bold hover:bg-brand-800"
                        >
                          Confirm Handed Over to Customer
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* View 4: Delivery History */}
        {activeTab === 'history' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-subtle space-y-4 animate-fade-in">
            <h3 className="font-bold text-base text-slate-900">
              Completed Delivery History ({completedDeliveries.length})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer & Ward</th>
                    <th className="py-3 px-4">Completed Timestamp</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4 text-right">Rider Payout</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {completedDeliveries.map(d => (
                    <tr key={d.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">#{d.orderId}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {d.customerName} ({d.deliveryAddress.split('(')[0]})
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {d.deliveredAt ? new Date(d.deliveredAt).toLocaleString() : 'Recent'}
                      </td>
                      <td className="py-3 px-4 text-[11px]">{d.itemsSummary}</td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-700">
                        +{formatTZS(d.fee)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* View 5: Rider Profile */}
        {activeTab === 'profile' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-subtle space-y-6 max-w-2xl animate-fade-in">
            <div>
              <h3 className="font-bold text-base text-slate-900">Rider Fleet Profile</h3>
              <p className="text-xs text-slate-500">
                Registered credentials and boda boda dispatch documentation.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Rider Full Name:</span>
                  <span className="font-bold text-slate-900">{currentUser?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Registered Phone:</span>
                  <span className="font-bold text-slate-900">{currentUser?.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Vehicle Type:</span>
                  <span className="font-bold text-slate-900">{currentUser?.vehicleType || 'Boxer BM 150'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Plate Registration:</span>
                  <span className="font-mono font-bold text-slate-900">{currentUser?.vehiclePlate || 'MC 492 EBD'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Primary Delivery Zone:</span>
                  <span className="font-bold text-slate-900">{currentUser?.zone || 'Kinondoni & Ilala'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
