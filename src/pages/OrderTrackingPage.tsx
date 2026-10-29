import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';
import {
  Package,
  Search,
  Truck,
  Sparkles,
  MapPin,
  Home,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  Radio,
  ShoppingBag,
  Eye,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import {
  OrderLifecycleStatus,
  ORDER_LIFECYCLE_STAGES,
  getNextOrderStatus,
  getOrderStatusProgress,
} from '../utils/calculations';

interface OrderTrackingPageProps {
  orders: any[];
  currentUser: User | null;
  onSelectProduct?: (product: Product) => void;
  onNavigateToShop: () => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  orders,
  currentUser,
  onSelectProduct,
  onNavigateToShop,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    orders.length > 0 ? orders[0].id : ''
  );
  const [orderStatuses, setOrderStatuses] = useState<Record<string, OrderLifecycleStatus>>({});
  const [isSimulating, setIsSimulating] = useState(true);

  // Initialize status for each order
  useEffect(() => {
    if (orders.length > 0) {
      setOrderStatuses((prev) => {
        const next = { ...prev };
        orders.forEach((o, i) => {
          if (!next[o.id]) {
            if (i === 0) next[o.id] = 'Out for Delivery';
            else if (i === 1) next[o.id] = 'Shipped';
            else next[o.id] = 'Processing';
          }
        });
        return next;
      });

      if (!selectedOrderId && orders[0]) {
        setSelectedOrderId(orders[0].id);
      }
    }
  }, [orders]);

  // Automated simulated progression interval in useEffect hook
  useEffect(() => {
    if (!isSimulating) return;

    const intervalId = setInterval(() => {
      setOrderStatuses((prev) => {
        const updated = { ...prev };
        let anyChanged = false;

        Object.keys(updated).forEach((id) => {
          const current = updated[id];
          if (current !== 'Delivered') {
            updated[id] = getNextOrderStatus(current);
            anyChanged = true;
          }
        });

        return anyChanged ? updated : prev;
      });
    }, 4500);

    return () => clearInterval(intervalId);
  }, [isSimulating]);

  // Active selected order
  const activeOrder = orders.find(
    (o) => o.id.toLowerCase() === selectedOrderId.toLowerCase()
  ) || orders[0];

  const currentStatus: OrderLifecycleStatus =
    activeOrder && orderStatuses[activeOrder.id]
      ? orderStatuses[activeOrder.id]
      : 'Out for Delivery';

  const progressPercent = getOrderStatusProgress(currentStatus);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const match = orders.find((o) =>
      o.id.toLowerCase().includes(searchInput.trim().toLowerCase())
    );
    if (match) {
      setSelectedOrderId(match.id);
    } else {
      // Mock match so user can test tracking any ID
      setSelectedOrderId(searchInput.trim().toUpperCase());
    }
  };

  const handleFastForward = () => {
    if (!activeOrder) return;
    setOrderStatuses((prev) => ({
      ...prev,
      [activeOrder.id]: getNextOrderStatus(prev[activeOrder.id] || 'Placed'),
    }));
  };

  const handleReset = () => {
    if (!activeOrder) return;
    setOrderStatuses((prev) => ({
      ...prev,
      [activeOrder.id]: 'Placed',
    }));
  };

  // Thumbnail helper
  const getItemThumbnail = (item: any): string => {
    if (item.image) return item.image;
    const match = PRODUCTS.find(
      (p) =>
        p.id === item.productId ||
        p.title.toLowerCase() === (item.productName || item.title || '').toLowerCase()
    );
    return match
      ? match.image
      : 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=400&q=80';
  };

  const findProductMatch = (item: any): Product | undefined => {
    return PRODUCTS.find(
      (p) =>
        p.id === item.productId ||
        p.title.toLowerCase() === (item.productName || item.title || '').toLowerCase()
    );
  };

  const orderItems: any[] =
    activeOrder?.items && activeOrder.items.length > 0
      ? activeOrder.items
      : [
          {
            productId: 'vintage-denim-jacket',
            productName: 'Vintage Denim Jacket',
            image:
              'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
            size: 'M',
            price: 699,
            quantity: 1,
          },
        ];

  return (
    <div className="bg-[#F8F3EB] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Banner with Tracking Search */}
        <div className="relative rounded-3xl overflow-hidden bg-[#201C1C] text-[#F8F3EB] p-8 md:p-12 shadow-xl border border-[#A99B91]/30">
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2.5 mb-3">
              <img
                src="/thrift_style_logo.jpg"
                alt="Thrift & Style Logo"
                className="w-7 h-7 rounded-full object-cover border border-[#D4A72C]/50"
              />
              <span className="text-xs uppercase tracking-[0.2em] text-[#D4A72C] font-semibold flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#D4A72C]" />
                <span>Express Thrift Courier Stream • Est. 2025</span>
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight mb-2">
              Live Order Tracker
            </h1>
            <p className="text-[#A99B91] text-sm sm:text-base leading-relaxed">
              Track your sanitized, authenticated vintage shipments from warehouse inspection to doorstep delivery in real-time.
            </p>

            {/* Tracking ID search input */}
            <form onSubmit={handleSearchSubmit} className="mt-6 flex max-w-lg gap-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Enter Order ID (e.g. ORD-THRIFT-91823)"
                  className="w-full text-xs sm:text-sm pl-11 pr-4 py-3 rounded-xl bg-[#F8F3EB] text-[#201C1C] placeholder-[#A99B91] outline-none focus:ring-2 focus:ring-[#75192F]"
                />
                <Search className="w-4 h-4 text-[#A99B91] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#75192F] hover:bg-[#5a1122] text-[#F8F3EB] font-semibold text-xs sm:text-sm transition cursor-pointer"
              >
                Track
              </button>
            </form>
          </div>
        </div>

        {/* Live Simulation Ribbon */}
        <div className="bg-[#EDE5D8] p-4 rounded-2xl border border-[#A99B91]/30 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#201C1C]">
            <Radio className="w-4 h-4 text-[#75192F]" />
            <span className="font-bold">Automated Logistics Simulator:</span>
            <span className="text-[#201C1C]/75">
              {isSimulating ? 'Active • Updates dispatched every 4.5s' : 'Simulation Paused'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#201C1C] text-[#F8F3EB] hover:bg-[#75192F] transition cursor-pointer"
            >
              {isSimulating ? 'Pause Auto-Tracker' : 'Resume Auto-Tracker'}
            </button>
            <button
              onClick={handleFastForward}
              className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#75192F] text-[#F8F3EB] hover:bg-[#5a1122] transition cursor-pointer"
            >
              <Play className="w-3 h-3" />
              <span>Step Next Stage</span>
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FDFBF7] border border-[#A99B91]/40 text-[#201C1C] hover:bg-[#EDE5D8] transition cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Order Selector Chips if multiple orders */}
        {orders.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-[#A99B91] uppercase tracking-wider min-w-max mr-1">
              Select Shipment:
            </span>
            {orders.map((ord) => (
              <button
                key={ord.id}
                onClick={() => setSelectedOrderId(ord.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold font-mono transition cursor-pointer border ${
                  activeOrder?.id === ord.id
                    ? 'bg-[#75192F] text-[#F8F3EB] border-[#75192F] shadow-sm'
                    : 'bg-[#FDFBF7] text-[#201C1C] border-[#A99B91]/30 hover:border-[#75192F]'
                }`}
              >
                {ord.id}
              </button>
            ))}
          </div>
        )}

        {/* Main Tracking Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Multi-stage Visual Tracker & Event Timeline */}
          <div className="lg:col-span-8 bg-[#FDFBF7] p-6 sm:p-8 rounded-3xl border border-[#A99B91]/30 shadow-sm space-y-8">
            {/* Top Order Meta */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#A99B91]/20 gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="font-mono font-bold text-lg sm:text-xl text-[#75192F]">
                    {activeOrder?.id || 'ORD-THRIFT-91823'}
                  </h2>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border shadow-sm flex items-center gap-1.5 ${
                      currentStatus === 'Placed'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : currentStatus === 'Processing'
                        ? 'bg-blue-50 text-blue-800 border-blue-300'
                        : currentStatus === 'Shipped'
                        ? 'bg-purple-50 text-purple-800 border-purple-300'
                        : currentStatus === 'Out for Delivery'
                        ? 'bg-orange-50 text-orange-800 border-orange-300'
                        : 'bg-green-50 text-green-800 border-green-300'
                    }`}
                  >
                    {currentStatus === 'Delivered' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                    ) : currentStatus === 'Shipped' ? (
                      <Truck className="w-3.5 h-3.5 text-purple-600" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-[#D4A72C]" />
                    )}
                    <span>{currentStatus}</span>
                  </span>
                </div>

                <p className="text-xs text-[#A99B91] mt-1 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    Placed on{' '}
                    {activeOrder?.createdAt
                      ? new Date(activeOrder.createdAt).toLocaleDateString()
                      : 'Today'}
                  </span>
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[11px] text-[#A99B91] uppercase font-bold tracking-wider">
                  Estimated Delivery
                </span>
                <p className="font-serif font-bold text-base text-[#201C1C]">
                  {currentStatus === 'Delivered' ? 'Delivered Today' : 'Within 2-3 Business Days'}
                </p>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="space-y-4">
              <div className="relative">
                <div className="w-full bg-[#EDE5D8] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#75192F] via-[#D4A72C] to-green-600 h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* 5 Milestone Icons */}
              <div className="grid grid-cols-5 gap-2 text-center pt-2">
                {ORDER_LIFECYCLE_STAGES.map((stage) => {
                  const isCompleted = progressPercent >= stage.percent;
                  const isCurrent = currentStatus === stage.status;

                  let Icon = CheckCircle2;
                  if (stage.status === 'Processing') Icon = Sparkles;
                  if (stage.status === 'Shipped') Icon = Truck;
                  if (stage.status === 'Out for Delivery') Icon = MapPin;
                  if (stage.status === 'Delivered') Icon = Home;

                  return (
                    <div key={stage.status} className="flex flex-col items-center">
                      <div
                        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isCurrent
                            ? 'bg-[#75192F] text-[#F8F3EB] ring-4 ring-[#75192F]/20 scale-110 shadow-lg'
                            : isCompleted
                            ? 'bg-green-700 text-[#F8F3EB]'
                            : 'bg-[#EDE5D8] text-[#A99B91]'
                        }`}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>

                      <span
                        className={`text-[11px] sm:text-xs font-semibold mt-2 ${
                          isCurrent
                            ? 'text-[#75192F] font-bold'
                            : isCompleted
                            ? 'text-[#201C1C]'
                            : 'text-[#A99B91]'
                        }`}
                      >
                        {stage.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Logistics Activity Log */}
            <div className="pt-6 border-t border-[#A99B91]/20 space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#201C1C] flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#75192F]" />
                <span>Courier Dispatch Activity Log</span>
              </h3>

              <div className="space-y-3 relative pl-6 border-l-2 border-[#75192F]/30 ml-2">
                {progressPercent >= 90 && (
                  <div className="relative">
                    <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[#75192F] ring-4 ring-[#FDFBF7]" />
                    <p className="text-xs font-bold text-[#201C1C]">
                      Out for Delivery • Local Express Rider
                    </p>
                    <p className="text-[11px] text-[#201C1C]/70">
                      Package is with the delivery executive for final doorstep delivery.
                    </p>
                  </div>
                )}

                {progressPercent >= 75 && (
                  <div className="relative">
                    <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[#D4A72C] ring-4 ring-[#FDFBF7]" />
                    <p className="text-xs font-bold text-[#201C1C]">
                      Shipped • Logistics Transit Hub
                    </p>
                    <p className="text-[11px] text-[#201C1C]/70">
                      Dispatched from central thrift fulfillment facility via express courier.
                    </p>
                  </div>
                )}

                {progressPercent >= 45 && (
                  <div className="relative">
                    <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[#75192F] ring-4 ring-[#FDFBF7]" />
                    <p className="text-xs font-bold text-[#201C1C]">
                      Processing • Sanitization &amp; Quality Check
                    </p>
                    <p className="text-[11px] text-[#201C1C]/70">
                      Garment inspected for flaw disclosures, steam sanitized, and packed in eco-kraft mailer.
                    </p>
                  </div>
                )}

                <div className="relative">
                  <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-green-600 ring-4 ring-[#FDFBF7]" />
                  <p className="text-xs font-bold text-[#201C1C]">
                    Order Placed • Payment Verified
                  </p>
                  <p className="text-[11px] text-[#201C1C]/70">
                    Payment verified via {activeOrder?.paymentMethod || 'UPI'}. Piece reserved from vintage catalog.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Garment Items Breakdown & Shipping Address */}
          <div className="lg:col-span-4 space-y-6">
            {/* Shipment Items Breakdown with Thumbnails and Prices */}
            <div className="bg-[#FDFBF7] p-6 rounded-3xl border border-[#A99B91]/30 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#A99B91]/20">
                <h3 className="font-serif text-lg font-bold text-[#201C1C] flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#75192F]" />
                  <span>Items in Shipment ({orderItems.length})</span>
                </h3>
              </div>

              <div className="divide-y divide-[#A99B91]/20">
                {orderItems.map((item, idx) => {
                  const thumbnail = getItemThumbnail(item);
                  const productMatch = findProductMatch(item);
                  const itemPrice = (item.price || 0) * (item.quantity || 1);

                  return (
                    <div key={idx} className="py-3.5 first:pt-0 last:pb-0 flex items-center gap-3">
                      <img
                        src={thumbnail}
                        alt={item.productName || item.title}
                        className="w-16 h-20 rounded-xl object-cover bg-[#EDE5D8] border border-[#A99B91]/30 flex-shrink-0"
                      />

                      <div className="min-w-0 flex-grow">
                        <h4 className="font-serif font-bold text-xs sm:text-sm text-[#201C1C] truncate">
                          {item.productName || item.title || 'Curated Thrift Garment'}
                        </h4>

                        <div className="flex items-center gap-2 text-[11px] text-[#A99B91] mt-0.5">
                          {item.size && <span>Size: {item.size}</span>}
                          <span>•</span>
                          <span>Qty: {item.quantity || 1}</span>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-xs text-[#75192F]">₹{itemPrice}</span>

                          {productMatch && onSelectProduct && (
                            <button
                              onClick={() => onSelectProduct(productMatch)}
                              className="text-[10px] text-[#75192F] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Details</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price Calculation Box */}
              <div className="pt-3 border-t border-[#A99B91]/20 bg-[#EDE5D8]/50 p-3.5 rounded-2xl text-xs space-y-1.5">
                <div className="flex justify-between text-[#201C1C]/75">
                  <span>Subtotal:</span>
                  <span className="font-mono">
                    ₹
                    {orderItems.reduce(
                      (sum, it) => sum + (it.price || 0) * (it.quantity || 1),
                      0
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-[#201C1C]/75">
                  <span>Shipping:</span>
                  <span className="text-green-700 font-semibold">
                    {activeOrder?.shippingFee === 0 || (activeOrder?.total || 0) >= 999
                      ? 'FREE'
                      : '₹99'}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#75192F] pt-1.5 border-t border-[#A99B91]/20">
                  <span>Total Paid:</span>
                  <span className="font-mono">₹{activeOrder?.total || 1298}</span>
                </div>
              </div>
            </div>

            {/* Delivery Recipient Card */}
            <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-[#A99B91]/30 space-y-2 text-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#A99B91]">
                Delivery Address
              </span>
              <p className="font-bold text-[#201C1C] text-sm">
                {activeOrder?.customerName || 'Aarav Mehta'}
              </p>
              <p className="text-[#201C1C]/75 leading-relaxed">
                {activeOrder?.shippingAddress ||
                  '42 Heritage Lane, Bandra West, Mumbai - 400050'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
