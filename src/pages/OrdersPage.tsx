import React from 'react';
import { User } from 'firebase/auth';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import {
  Package,
  Calendar,
  Truck,
  Sparkles,
  CheckCircle2,
  MapPin,
  ShoppingBag,
  ArrowRight,
  Eye,
  Receipt,
  Clock,
} from 'lucide-react';

interface OrdersPageProps {
  orders: any[];
  currentUser: User | null;
  onTrackOrder: (orderId: string) => void;
  onSelectProduct?: (product: Product) => void;
  onNavigateToShop: () => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({
  orders,
  currentUser,
  onTrackOrder,
  onSelectProduct,
  onNavigateToShop,
}) => {
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

  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalItemsCount = orders.reduce(
    (sum, o) => sum + (o.items ? o.items.length : 1),
    0
  );

  return (
    <div className="bg-[#F8F3EB] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-[#201C1C] text-[#F8F3EB] p-8 md:p-12 shadow-xl border border-[#A99B91]/30">
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2.5 mb-3">
              <img
                src="/thrift_style_logo.jpg"
                alt="Thrift & Style Logo"
                className="w-7 h-7 rounded-full object-cover border border-[#D4A72C]/50"
              />
              <span className="text-xs uppercase tracking-[0.2em] text-[#D4A72C] font-semibold flex items-center gap-1.5">
                <Package className="w-4 h-4 text-[#D4A72C]" />
                <span>Customer Order Vault • Est. 2025</span>
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight mb-2">
              My Thrift Orders
            </h1>
            <p className="text-[#A99B91] text-sm sm:text-base leading-relaxed">
              Track your deliveries, review itemized receipts, and check inspection notes for all past orders.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-white/10 text-xs">
              <div>
                <span className="text-[#A99B91]">Total Orders:</span>{' '}
                <strong className="text-[#F8F3EB]">{orders.length} orders</strong>
              </div>
              <span className="text-white/20">•</span>
              <div>
                <span className="text-[#A99B91]">Garments Thrifted:</span>{' '}
                <strong className="text-[#F8F3EB]">{totalItemsCount} pieces</strong>
              </div>
              <span className="text-white/20">•</span>
              <div>
                <span className="text-[#A99B91]">Total Invested:</span>{' '}
                <strong className="font-mono text-[#D4A72C]">₹{totalSpent}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {orders.length === 0 ? (
          <div className="bg-[#FDFBF7] rounded-3xl border border-[#A99B91]/30 p-12 sm:p-16 text-center space-y-5 shadow-sm max-w-2xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-[#75192F]/10 text-[#75192F] flex items-center justify-center mx-auto">
              <Package className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#201C1C]">
                No orders found
              </h2>
              <p className="text-xs sm:text-sm text-[#201C1C]/75 max-w-md mx-auto">
                You haven&apos;t placed any orders yet. Check out our latest drop of hand-picked vintage jackets, hoodies, and denim.
              </p>
            </div>

            <button
              onClick={onNavigateToShop}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#75192F] hover:bg-[#5a1122] text-[#F8F3EB] font-semibold text-xs sm:text-sm transition shadow-md cursor-pointer"
            >
              <span>Shop Curated Thrift</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((ord) => {
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
                  className="bg-[#FDFBF7] rounded-3xl border border-[#A99B91]/30 shadow-sm p-6 sm:p-8 space-y-6 transition hover:shadow-md"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#A99B91]/20 gap-3">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-sm text-[#75192F] bg-[#75192F]/10 px-3 py-1 rounded-full border border-[#75192F]/20">
                          {ord.id}
                        </span>
                        <span className="text-xs text-[#A99B91] flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {ord.createdAt
                              ? new Date(ord.createdAt).toLocaleDateString()
                              : 'Recent'}
                          </span>
                        </span>
                      </div>

                      <p className="text-xs text-[#201C1C]/75 mt-1">
                        Recipient: <strong>{ord.customerName}</strong> • {ord.shippingAddress}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onTrackOrder(ord.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#75192F] hover:bg-[#5a1122] text-[#F8F3EB] text-xs font-semibold shadow-sm transition cursor-pointer"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track Live Delivery</span>
                      </button>
                    </div>
                  </div>

                  {/* Individual Items Breakdown */}
                  <div className="space-y-3">
                    <span className="text-xs uppercase font-bold tracking-wider text-[#A99B91] block">
                      Ordered Garments ({orderItems.length})
                    </span>

                    <div className="divide-y divide-[#A99B91]/20 border border-[#A99B91]/25 rounded-2xl p-4 bg-[#F8F3EB]">
                      {orderItems.map((item, idx) => {
                        const thumbnail = getItemThumbnail(item);
                        const productMatch = findProductMatch(item);
                        const lineTotal = (item.price || 0) * (item.quantity || 1);

                        return (
                          <div
                            key={idx}
                            className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3.5">
                              <img
                                src={thumbnail}
                                alt={item.productName || item.title}
                                className="w-16 h-20 rounded-xl object-cover bg-[#EDE5D8] border border-[#A99B91]/30 flex-shrink-0"
                              />

                              <div>
                                <h4 className="font-serif font-bold text-sm text-[#201C1C]">
                                  {item.productName || item.title || 'Curated Thrift Piece'}
                                </h4>

                                <div className="flex items-center gap-2 text-xs text-[#A99B91] mt-0.5">
                                  {item.size && <span>Size: {item.size}</span>}
                                  <span>•</span>
                                  <span>Qty: {item.quantity || 1}</span>
                                </div>

                                {productMatch && onSelectProduct && (
                                  <button
                                    onClick={() => onSelectProduct(productMatch)}
                                    className="text-[11px] text-[#75192F] hover:underline flex items-center gap-1 font-semibold mt-1 cursor-pointer"
                                  >
                                    <Eye className="w-3 h-3" />
                                    <span>View Piece</span>
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="font-serif font-bold text-base text-[#75192F]">
                                ₹{lineTotal}
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
                  </div>

                  {/* Summary & Payment Info */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#201C1C]/80 gap-2">
                    <div className="flex items-center gap-2">
                      <span>Payment Method:</span>
                      <strong className="uppercase bg-[#EDE5D8] px-2.5 py-0.5 rounded text-[#201C1C]">
                        {ord.paymentMethod || 'UPI'}
                      </strong>
                    </div>

                    <div className="flex items-center gap-4">
                      <span>Total Paid:</span>
                      <strong className="font-serif text-lg font-bold text-[#75192F]">
                        ₹{ord.total}
                      </strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
