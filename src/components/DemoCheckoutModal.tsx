import React, { useState } from 'react';
import { CartItem } from '../types';
import { createOrderInFirestore } from '../firebase';
import { User } from 'firebase/auth';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, CreditCard, Smartphone, Banknote, Building2 } from 'lucide-react';

interface DemoCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  total: number;
  currentUser: User | null;
  onOrderSuccess: (orderId: string) => void;
}

export const DemoCheckoutModal: React.FC<DemoCheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  shippingFee,
  discountAmount,
  total,
  currentUser,
  onOrderSuccess,
}) => {
  const [customerName, setCustomerName] = useState(currentUser?.displayName || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !shippingAddress.trim() || !city.trim() || !pinCode.trim()) {
      setErrorMsg('Please complete all delivery fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const fullAddress = `${shippingAddress.trim()}, ${city.trim()} - PIN: ${pinCode.trim()}`;
      const userId = currentUser ? currentUser.uid : 'guest-thrift-shopper';

      const orderPayload = {
        userId,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim() || undefined,
        shippingAddress: fullAddress,
        paymentMethod,
        subtotal,
        shippingFee,
        total,
        status: 'placed' as const,
        itemCount: items.reduce((s, it) => s + it.quantity, 0),
        items: items.map((it) => ({
          productId: it.productId,
          productName: it.title,
          image: it.image,
          size: it.size,
          price: it.price,
          quantity: it.quantity,
        })),
      };

      let orderId = 'DEMO-ORD-' + Math.floor(100000 + Math.random() * 900000);

      // Save order to Firestore if signed in
      if (currentUser) {
        try {
          const docId = await createOrderInFirestore(orderPayload);
          if (docId) orderId = docId;
        } catch (err) {
          console.warn('Saved demo order in local state due to guest or rule fallback:', err);
        }
      }

      setCompletedOrderId(orderId);
      onOrderSuccess(orderId);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error creating demo order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-2xl bg-[#FDFBF7] rounded-3xl shadow-2xl border border-[#A99B91]/30 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#201C1C] text-[#F8F3EB] p-5 sm:p-6 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold">
              {completedOrderId ? 'Order Confirmed!' : 'Thrift & Style Demo Checkout'}
            </h2>
            <p className="text-xs text-[#A99B91] mt-0.5">
              Curated thrift fashion • Student startup prototype
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-[#75192F] transition text-[#F8F3EB] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Disclaimer Banner (Mandated by PDF) */}
        <div className="bg-amber-50 border-b border-amber-200 p-3 sm:px-6 flex items-start gap-2.5 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Prototype Demo Notice:</span> This is a student startup simulation. No actual credit card or real money will be charged. All payments are strictly processed in demonstration mode.
          </div>
        </div>

        {/* Body */}
        {completedOrderId ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-2xl font-bold text-[#201C1C]">
                Thank You for Your Order!
              </h3>
              <p className="text-sm text-[#201C1C]/75">
                Your pre-loved pieces have been reserved. Order Ref:
              </p>
              <div className="inline-block bg-[#EDE5D8] text-[#75192F] font-mono font-bold text-sm px-4 py-1.5 rounded-lg border border-[#A99B91]/30 mt-2">
                {completedOrderId}
              </div>
            </div>

            <div className="bg-[#F8F3EB] p-4 rounded-2xl border border-[#A99B91]/30 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-[#A99B91]">Customer:</span>
                <span className="font-semibold text-[#201C1C]">{customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A99B91]">Items:</span>
                <span className="font-semibold text-[#201C1C]">{items.length} garments</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A99B91]">Demo Total Paid:</span>
                <span className="font-bold text-[#75192F]">₹{total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A99B91]">Delivery Address:</span>
                <span className="font-medium text-[#201C1C] text-right truncate max-w-[220px]">
                  {shippingAddress}, {city}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3 rounded-full bg-[#75192F] hover:bg-[#5a1122] text-[#F8F3EB] font-semibold text-xs transition shadow-md cursor-pointer"
            >
              Back to Thrift Catalog
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="p-6 space-y-5">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                {errorMsg}
              </div>
            )}

            {/* Customer Information */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#A99B91]">
                Delivery Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#201C1C] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Aryan Sharma"
                    className="w-full text-xs p-2.5 rounded-lg border border-[#A99B91]/40 bg-white text-[#201C1C] focus:border-[#75192F] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#201C1C] mb-1">Email for Receipt</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full text-xs p-2.5 rounded-lg border border-[#A99B91]/40 bg-white text-[#201C1C] focus:border-[#75192F] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#201C1C] mb-1">Shipping Street Address</label>
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Apartment, house no., building, street"
                  className="w-full text-xs p-2.5 rounded-lg border border-[#A99B91]/40 bg-white text-[#201C1C] focus:border-[#75192F] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#201C1C] mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Mumbai, Delhi, Bengaluru"
                    className="w-full text-xs p-2.5 rounded-lg border border-[#A99B91]/40 bg-white text-[#201C1C] focus:border-[#75192F] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#201C1C] mb-1">PIN Code</label>
                  <input
                    type="text"
                    required
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="e.g. 110001"
                    className="w-full text-xs p-2.5 rounded-lg border border-[#A99B91]/40 bg-white text-[#201C1C] focus:border-[#75192F] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="pt-3 border-t border-[#A99B91]/20">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#A99B91] mb-2.5">
                Select Demo Payment Method
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'upi', label: 'UPI (GPay/PhonePe)', icon: Smartphone },
                  { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                  { id: 'netbanking', label: 'Net Banking', icon: Building2 },
                  { id: 'cod', label: 'Cash on Delivery', icon: Banknote },
                ].map((m) => {
                  const Icon = m.icon;
                  const isSel = paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition cursor-pointer ${
                        isSel
                          ? 'bg-[#75192F]/10 border-[#75192F] text-[#75192F]'
                          : 'bg-[#F8F3EB] border-[#A99B91]/30 text-[#201C1C] hover:border-[#75192F]'
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-2" />
                      <span className="text-[11px] font-semibold">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Summary */}
            <div className="pt-3 border-t border-[#A99B91]/20 bg-[#EDE5D8]/40 p-3 rounded-xl text-xs space-y-1.5">
              <div className="flex justify-between text-[#201C1C]/75">
                <span>Subtotal ({items.length} items):</span>
                <span>₹{subtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Promo Discount:</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-[#201C1C]/75">
                <span>Standard Delivery:</span>
                <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#75192F] pt-1 border-t border-[#A99B91]/20">
                <span>Total Amount:</span>
                <span>₹{total}</span>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-full bg-[#75192F] hover:bg-[#5a1122] disabled:opacity-50 text-[#F8F3EB] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
              >
                <span>{isSubmitting ? 'Processing Demo Order...' : `Place Demo Order (₹${total})`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
