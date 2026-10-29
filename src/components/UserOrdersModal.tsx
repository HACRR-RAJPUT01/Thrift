import React, { useEffect, useState } from 'react';
import { fetchUserOrders } from '../firebase';
import { User } from 'firebase/auth';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';
import {
  X,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  Sparkles,
  MapPin,
  Home,
  ChevronDown,
  ChevronUp,
  Radio,
  Play,
  RotateCcw,
  ShoppingBag,
  Tag,
  CreditCard,
  ShieldCheck,
  Eye,
} from 'lucide-react';
import {
  OrderLifecycleStatus,
  ORDER_LIFECYCLE_STAGES,
  getNextOrderStatus,
  getOrderStatusProgress,
} from '../utils/calculations';

interface UserOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  localOrders: any[];
  onSelectProduct?: (product: Product) => void;
}

export const UserOrdersModal: React.FC<UserOrdersModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  localOrders,
  onSelectProduct,
}) => {
  const [orders, setOrders] = useState<any[]>(localOrders);
  const [loading, setLoading] = useState(false);

  // Simulated live status mapping for each order: orderId -> OrderLifecycleStatus
  const [orderStatuses, setOrderStatuses] = useState<Record<string, OrderLifecycleStatus>>({});
  const [isSimulating, setIsSimulating] = useState(true);

  // Set of order IDs that have their item breakdown expanded
  const [expandedOrderIds, setExpandedOrderIds] = useState<Set<string>>(new Set());

  // Load orders from Firestore or local fallback
  useEffect(() => {
    if (isOpen && currentUser) {
      setLoading(true);
      fetchUserOrders(currentUser.uid)
        .then((remoteOrders) => {
          const allOrders = [...localOrders];
          remoteOrders.forEach((ro) => {
            if (!allOrders.some((lo) => lo.id === ro.id)) {
              allOrders.push(ro);
            }
          });
          setOrders(allOrders);

          // Auto-expand the first order so item breakdown is instantly accessible
          if (allOrders.length > 0) {
            setExpandedOrderIds(new Set([allOrders[0].id]));
          }

          // Initialize order statuses
          setOrderStatuses((prev) => {
            const nextMap = { ...prev };
            allOrders.forEach((o, index) => {
              if (!nextMap[o.id]) {
                if (index === 0) nextMap[o.id] = 'Out for Delivery';
                else if (index === 1) nextMap[o.id] = 'Shipped';
                else nextMap[o.id] = 'Processing';
              }
            });
            return nextMap;
          });
        })
        .catch(() => {
          setOrders(localOrders);
          if (localOrders.length > 0) {
            setExpandedOrderIds(new Set([localOrders[0].id]));
          }
          setOrderStatuses((prev) => {
            const nextMap = { ...prev };
            localOrders.forEach((o) => {
              if (!nextMap[o.id]) nextMap[o.id] = 'Out for Delivery';
            });
            return nextMap;
          });
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (isOpen) {
      setOrders(localOrders);
      if (localOrders.length > 0) {
        setExpandedOrderIds(new Set([localOrders[0].id]));
      }
      setOrderStatuses((prev) => {
        const nextMap = { ...prev };
        localOrders.forEach((o) => {
          if (!nextMap[o.id]) nextMap[o.id] = 'Out for Delivery';
        });
        return nextMap;
      });
    }
  }, [isOpen, currentUser, localOrders]);

  // Simulated Real-Time Status Tracker Interval in useEffect hook
  useEffect(() => {
    if (!isOpen || !isSimulating) return;

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

    return () => {
      clearInterval(intervalId);
    };
  }, [isOpen, isSimulating]);

  // Toggle item breakdown expansion for an order
  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrderIds((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  };

  // Helper to resolve an item's thumbnail image
  const getItemThumbnail = (item: any): string => {
    if (item.image) return item.image;
    // Look up in catalog by productId or name
    const catalogMatch = PRODUCTS.find(
      (p) =>
        p.id === item.productId ||
        p.title.toLowerCase() === (item.productName || item.title || '').toLowerCase()
    );
    if (catalogMatch) return catalogMatch.image;
    // Default vintage fallback
    return 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=400&q=80';
  };

  // Helper to resolve product reference for Quick View click
  const findProductMatch = (item: any): Product | undefined => {
    return PRODUCTS.find(
      (p) =>
        p.id === item.productId ||
        p.title.toLowerCase() === (item.productName || item.title || '').toLowerCase()
    );
  };

  // Manually fast-forward status for an order
  const handleFastForward = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOrderStatuses((prev) => ({
      ...prev,
      [orderId]: getNextOrderStatus(prev[orderId] || 'Placed'),
    }));
  };

  // Reset status to 'Placed'
  const handleResetStatus = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOrderStatuses((prev) => ({
      ...prev,
      [orderId]: 'Placed',
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-3xl bg-[#FDFBF7] rounded-3xl shadow-2xl border border-[#A99B91]/30 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#201C1C] text-[#F8F3EB] p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#75192F] text-[#F8F3EB]">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl sm:text-2xl font-bold">Thrift Order Tracker</h2>
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-300 border border-green-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span>Real-Time Sync</span>
                </span>
              </div>
              <p className="text-xs text-[#A99B91] mt-0.5">
                {currentUser ? currentUser.email : 'Guest Session Demonstration'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-[#75192F] transition text-[#F8F3EB] cursor-pointer"
            aria-label="Close orders modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Simulation Control Ribbon */}
        <div className="bg-[#EDE5D8] px-6 py-2.5 border-b border-[#A99B91]/30 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#201C1C]">
            <Radio className="w-3.5 h-3.5 text-[#75192F]" />
            <span className="font-semibold">Simulated Courier Event Dispatcher:</span>
            <span className="text-[#201C1C]/75">
              {isSimulating ? 'Active (auto-advances every 4.5s)' : 'Paused'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className="px-3 py-1 rounded-md text-[11px] font-semibold bg-[#201C1C] text-[#F8F3EB] hover:bg-[#75192F] transition cursor-pointer"
            >
              {isSimulating ? 'Pause Auto-Tracker' : 'Resume Auto-Tracker'}
            </button>
          </div>
        </div>

        {/* Orders Content List */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6 divide-y divide-[#A99B91]/20">
          {loading ? (
            <div className="py-12 text-center text-xs text-[#A99B91]">
              Connecting to Firestore logistics stream...
            </div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#75192F]/10 text-[#75192F] flex items-center justify-center mx-auto">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#201C1C]">No orders placed yet</h3>
              <p className="text-xs text-[#201C1C]/70 max-w-sm mx-auto">
                Add any vintage denim, hoodie, or flannel to your cart and place a demo order to watch the live status tracker in action.
              </p>
            </div>
          ) : (
            orders.map((ord) => {
              const currentStatus: OrderLifecycleStatus = orderStatuses[ord.id] || 'Placed';
              const progressPercent = getOrderStatusProgress(currentStatus);
              const isExpanded = expandedOrderIds.has(ord.id);

              // Normalize items list
              const orderItems: any[] =
                ord.items && ord.items.length > 0
                  ? ord.items
                  : [
                      {
                        productId: 'vintage-denim-jacket',
                        productName: 'Vintage Denim Jacket',
                        image:
                          'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
                        size: 'M',
                        price: ord.total || 699,
                        quantity: 1,
                      },
                    ];

              return (
                <div
                  key={ord.id}
                  className="pt-6 first:pt-0 space-y-4 bg-[#FDFBF7] rounded-2xl transition"
                >
                  {/* Order Card Header (Clickable to Toggle Breakdown) */}
                  <div
                    onClick={() => toggleOrderExpansion(ord.id)}
                    className="p-4 rounded-2xl bg-[#F8F3EB] hover:bg-[#EDE5D8]/70 border border-[#A99B91]/30 transition cursor-pointer select-none space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-[#75192F] bg-[#75192F]/10 px-2.5 py-0.5 rounded-full border border-[#75192F]/20">
                            {ord.id}
                          </span>
                          <span className="text-xs text-[#A99B91]">
                            {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : 'Just now'}
                          </span>
                          <span className="text-xs font-semibold text-[#201C1C]/80 bg-[#EDE5D8] px-2 py-0.5 rounded-full">
                            {orderItems.length} {orderItems.length === 1 ? 'Garment' : 'Garments'}
                          </span>
                        </div>

                        <p className="text-xs font-medium text-[#201C1C] mt-1.5">
                          Recipient: <strong>{ord.customerName}</strong> • {ord.shippingAddress}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        {/* Status Badge */}
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

                        {/* Fast Forward Simulation button */}
                        <button
                          onClick={(e) => handleFastForward(ord.id, e)}
                          title="Simulate next status stage immediately"
                          className="p-1.5 rounded-lg border border-[#A99B91]/30 hover:bg-[#F8F3EB] text-[#201C1C] transition cursor-pointer"
                        >
                          <Play className="w-3 h-3 text-[#75192F]" />
                        </button>

                        {/* Reset button */}
                        <button
                          onClick={(e) => handleResetStatus(ord.id, e)}
                          title="Reset simulation to Placed"
                          className="p-1.5 rounded-lg border border-[#A99B91]/30 hover:bg-[#F8F3EB] text-[#A99B91] transition cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>

                        {/* Expand/Collapse Chevron Indicator */}
                        <div className="p-1.5 text-[#75192F] hover:text-[#201C1C]">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#201C1C]/75 pt-2 border-t border-[#A99B91]/15">
                      <span className="flex items-center gap-1 font-semibold text-[#75192F]">
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{isExpanded ? 'Hide Item Breakdown' : 'Click to view individual items & prices'}</span>
                      </span>

                      <div className="flex items-center gap-3">
                        <span>Payment: <strong className="uppercase">{ord.paymentMethod}</strong></span>
                        <span>Total: <strong className="font-serif text-sm font-bold text-[#75192F]">₹{ord.total}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Real-Time Stepper Progress Bar */}
                  <div className="bg-[#F8F3EB] p-4 sm:p-5 rounded-2xl border border-[#A99B91]/30 space-y-4">
                    {/* Progress Bar Line */}
                    <div className="relative">
                      <div className="w-full bg-[#EDE5D8] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#75192F] via-[#D4A72C] to-green-600 h-full rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Step-by-Step Milestones */}
                    <div className="grid grid-cols-5 gap-1 text-center">
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
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                                isCurrent
                                  ? 'bg-[#75192F] text-[#F8F3EB] ring-4 ring-[#75192F]/20 scale-110 shadow-md'
                                  : isCompleted
                                  ? 'bg-green-700 text-[#F8F3EB]'
                                  : 'bg-[#EDE5D8] text-[#A99B91]'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </div>

                            <span
                              className={`text-[10px] sm:text-xs font-semibold mt-1.5 leading-tight ${
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

                    {/* Active Status Live Narrative */}
                    <div className="pt-2 border-t border-[#A99B91]/20 flex items-start gap-2.5 text-xs text-[#201C1C]/80">
                      <Clock className="w-3.5 h-3.5 text-[#75192F] flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#201C1C]">Current Milestone: </span>
                        <span>
                          {ORDER_LIFECYCLE_STAGES.find((s) => s.status === currentStatus)?.description}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Breakdown of Items (Revealed when clicked) */}
                  {isExpanded && (
                    <div className="bg-[#FDFBF7] p-4 sm:p-5 rounded-2xl border-2 border-[#75192F]/20 shadow-inner space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center justify-between pb-3 border-b border-[#A99B91]/20">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4 text-[#75192F]" />
                          <h4 className="font-serif font-bold text-sm sm:text-base text-[#201C1C]">
                            Garments in this Shipment ({orderItems.length})
                          </h4>
                        </div>
                        <span className="text-[11px] font-semibold text-[#A99B91]">
                          Individual Item Breakdown
                        </span>
                      </div>

                      {/* Item Rows with Thumbnails and Prices */}
                      <div className="divide-y divide-[#A99B91]/20">
                        {orderItems.map((item, idx) => {
                          const thumbnail = getItemThumbnail(item);
                          const productMatch = findProductMatch(item);
                          const itemTotal = (item.price || 0) * (item.quantity || 1);

                          return (
                            <div
                              key={idx}
                              className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 group"
                            >
                              {/* Left Thumbnail & Info */}
                              <div className="flex items-center gap-3.5 min-w-0">
                                <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-[#EDE5D8] border border-[#A99B91]/30 flex-shrink-0 shadow-sm">
                                  <img
                                    src={thumbnail}
                                    alt={item.productName || item.title || 'Thrift Garment'}
                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
                                  />
                                </div>

                                <div className="min-w-0">
                                  <h5 className="font-serif font-bold text-sm text-[#201C1C] truncate">
                                    {item.productName || item.title || 'Curated Thrift Piece'}
                                  </h5>

                                  <div className="flex flex-wrap items-center gap-2 mt-1">
                                    {item.size && (
                                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#EDE5D8] text-[#201C1C]">
                                        Size: {item.size}
                                      </span>
                                    )}

                                    <span className="text-[11px] text-[#A99B91]">
                                      Qty: {item.quantity || 1}
                                    </span>

                                    <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                      Verified Vintage
                                    </span>
                                  </div>

                                  {productMatch && onSelectProduct && (
                                    <button
                                      onClick={() => {
                                        onSelectProduct(productMatch);
                                        onClose();
                                      }}
                                      className="text-[11px] text-[#75192F] hover:underline flex items-center gap-1 mt-1 font-semibold cursor-pointer"
                                    >
                                      <Eye className="w-3 h-3" />
                                      <span>View Product Details</span>
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Right Price Breakdown */}
                              <div className="text-right flex-shrink-0">
                                <span className="font-serif text-base sm:text-lg font-bold text-[#75192F]">
                                  ₹{itemTotal}
                                </span>
                                {(item.quantity || 1) > 1 && (
                                  <p className="text-[10px] text-[#A99B91]">
                                    (₹{item.price} each)
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Financial Calculation Recap */}
                      <div className="pt-3 border-t border-[#A99B91]/20 bg-[#EDE5D8]/40 p-3 rounded-xl space-y-1.5 text-xs">
                        <div className="flex justify-between text-[#201C1C]/75">
                          <span>Items Subtotal:</span>
                          <span className="font-mono">
                            ₹
                            {orderItems.reduce(
                              (sum, it) => sum + (it.price || 0) * (it.quantity || 1),
                              0
                            )}
                          </span>
                        </div>

                        <div className="flex justify-between text-[#201C1C]/75">
                          <span>Courier Delivery:</span>
                          <span className="text-emerald-700 font-semibold">
                            {ord.shippingFee === 0 || ord.total >= 999 ? 'FREE (Courier Express)' : '₹99'}
                          </span>
                        </div>

                        <div className="flex justify-between font-bold text-sm text-[#75192F] pt-1.5 border-t border-[#A99B91]/20">
                          <span>Final Total Charged:</span>
                          <span className="font-mono">₹{ord.total}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#EDE5D8]/50 border-t border-[#A99B91]/20 flex items-center justify-between">
          <p className="text-[11px] text-[#A99B91]">
            *Click on any order to expand or collapse the itemized garment breakdown.
          </p>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-[#201C1C] text-[#F8F3EB] text-xs font-semibold hover:bg-[#75192F] transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
