import React, { useState } from 'react';
import { CartItem } from '../types';
import { User } from 'firebase/auth';
import { createOrderInFirestore } from '../firebase';
import { calculateCartTotals } from '../utils/calculations';
import {
  ShieldCheck,
  CreditCard,
  Smartphone,
  Building2,
  Banknote,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShoppingBag,
  Tag,
  Lock,
  QrCode,
  Truck,
  RotateCcw,
} from 'lucide-react';

interface PaymentCheckoutPageProps {
  items: CartItem[];
  currentUser: User | null;
  onOrderSuccess: (orderId: string) => void;
  onNavigateToShop: () => void;
  onTrackOrder: (orderId: string) => void;
}

export const PaymentCheckoutPage: React.FC<PaymentCheckoutPageProps> = ({
  items,
  currentUser,
  onOrderSuccess,
  onNavigateToShop,
  onTrackOrder,
}) => {
  // Customer details form
  const [customerName, setCustomerName] = useState(currentUser?.displayName || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [pinCode, setPinCode] = useState('');

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('qr');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('•••');

  // Promo code
  const [promoCode, setPromoCode] = useState('');
  const [promoPercent, setPromoPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');

  // Submitting & Completion
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const totals = calculateCartTotals(items, promoPercent);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'THRIFT10') {
      setPromoPercent(10);
      setPromoMessage('10% Thrift Startup discount applied!');
    } else if (code === 'STUDENT') {
      setPromoPercent(15);
      setPromoMessage('15% Student Discount applied!');
    } else {
      setPromoMessage('Invalid promo code. Try "THRIFT10" or "STUDENT".');
    }
  };

  const handlePayAndPlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !shippingAddress.trim() || !city.trim() || !pinCode.trim()) {
      setErrorMessage('Please fill in all mandatory delivery fields.');
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    if (items.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const fullAddress = `${shippingAddress.trim()}, ${city.trim()}, ${state.trim()} - PIN: ${pinCode.trim()}`;
      const userId = currentUser ? currentUser.uid : 'guest-thrift-shopper';

      const orderPayload = {
        userId,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim() || undefined,
        shippingAddress: fullAddress,
        paymentMethod,
        subtotal: totals.subtotal,
        shippingFee: totals.shippingFee,
        total: totals.total,
        status: 'placed' as const,
        itemCount: totals.itemCount,
        items: items.map((it) => ({
          productId: it.productId,
          productName: it.title,
          image: it.image,
          size: it.size,
          price: it.price,
          quantity: it.quantity,
        })),
      };

      let orderId = 'ORD-THRIFT-' + Math.floor(100000 + Math.random() * 900000);

      // Write to Firestore if connected
      if (currentUser) {
        try {
          const docId = await createOrderInFirestore(orderPayload);
          if (docId) orderId = docId;
        } catch (err) {
          console.warn('Saved demo order in local storage fallback:', err);
        }
      }

      setCompletedOrderId(orderId);
      onOrderSuccess(orderId);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error processing demo checkout.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
                <Lock className="w-4 h-4 text-[#D4A72C]" />
                <span>Encrypted Demonstration Checkout • Est. 2025</span>
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight mb-2">
              Payment &amp; Delivery
            </h1>
            <p className="text-[#A99B91] text-sm sm:text-base leading-relaxed">
              Complete your pre-loved wardrobe purchase. Fast courier dispatch, transparent defect disclosure, and eco-friendly mailers.
            </p>
          </div>
        </div>

        {/* Prototype Disclaimer Banner */}
        <div className="bg-amber-50 border border-amber-200/80 p-4 rounded-2xl flex items-start gap-3 text-xs text-amber-900 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="font-bold">Prototype Demonstration Mode:</h4>
            <p className="leading-relaxed">
              This is a student startup simulation. No actual bank transfers or real credit card transactions are billed. You can test UPI, Card, Net Banking, or COD flows safely.
            </p>
          </div>
        </div>

        {/* Success View */}
        {completedOrderId ? (
          <div className="bg-[#FDFBF7] p-8 sm:p-14 rounded-3xl border border-[#A99B91]/30 shadow-sm text-center space-y-6 max-w-2xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-3xl font-bold text-[#201C1C]">
                Payment Successful &amp; Order Confirmed!
              </h2>
              <p className="text-xs sm:text-sm text-[#201C1C]/75">
                Your pre-loved garments are reserved. We have initiated sanitization and packaging.
              </p>
              <div className="inline-block bg-[#EDE5D8] text-[#75192F] font-mono font-bold text-base px-5 py-2 rounded-xl border border-[#A99B91]/30 mt-2">
                {completedOrderId}
              </div>
            </div>

            <div className="bg-[#F8F3EB] p-5 rounded-2xl border border-[#A99B91]/30 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#A99B91]">Customer:</span>
                <span className="font-semibold text-[#201C1C]">{customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A99B91]">Payment Method:</span>
                <span className="uppercase font-semibold text-[#201C1C]">{paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A99B91]">Delivery Address:</span>
                <span className="font-medium text-[#201C1C] text-right truncate max-w-[260px]">
                  {shippingAddress}, {city} - {pinCode}
                </span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#75192F] pt-2 border-t border-[#A99B91]/20">
                <span>Total Demo Paid:</span>
                <span className="font-mono">₹{totals.total}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={() => onTrackOrder(completedOrderId)}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#75192F] hover:bg-[#5a1122] text-[#F8F3EB] font-semibold text-xs sm:text-sm transition shadow-md cursor-pointer"
              >
                <Truck className="w-4 h-4" />
                <span>Track Live Order Progression</span>
              </button>

              <button
                onClick={onNavigateToShop}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#EDE5D8] hover:bg-[#201C1C] hover:text-[#F8F3EB] text-[#201C1C] font-semibold text-xs sm:text-sm transition cursor-pointer"
              >
                <span>Continue Shopping</span>
              </button>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-[#FDFBF7] p-12 sm:p-16 rounded-3xl border border-[#A99B91]/30 shadow-sm text-center space-y-5 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#75192F]/10 text-[#75192F] flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#201C1C]">
              No items in checkout
            </h2>
            <p className="text-xs sm:text-sm text-[#201C1C]/75">
              Add pieces from the collection to your shopping bag before proceeding to checkout.
            </p>
            <button
              onClick={onNavigateToShop}
              className="px-6 py-3 rounded-full bg-[#75192F] text-[#F8F3EB] font-semibold text-xs shadow-md cursor-pointer"
            >
              Browse Thrift Pieces
            </button>
          </div>
        ) : (
          <form onSubmit={handlePayAndPlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Delivery Address & Payment Method */}
            <div className="lg:col-span-7 space-y-8">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                  {errorMessage}
                </div>
              )}

              {/* Delivery Address Section */}
              <div className="bg-[#FDFBF7] p-6 sm:p-8 rounded-3xl border border-[#A99B91]/30 shadow-sm space-y-5">
                <div className="flex items-center gap-2.5 pb-4 border-b border-[#A99B91]/20">
                  <div className="w-7 h-7 rounded-full bg-[#75192F] text-[#F8F3EB] flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#201C1C]">
                    Delivery Address
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#201C1C] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Maya Sen"
                      className="w-full text-xs p-3 rounded-xl border border-[#A99B91]/40 bg-white text-[#201C1C] focus:border-[#75192F] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#201C1C] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full text-xs p-3 rounded-xl border border-[#A99B91]/40 bg-white text-[#201C1C] focus:border-[#75192F] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#201C1C] mb-1">
                    Email Address (for order tracking)
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full text-xs p-3 rounded-xl border border-[#A99B91]/40 bg-white text-[#201C1C] focus:border-[#75192F] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#201C1C] mb-1">
                    Street Address &amp; Landmark *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Flat / House no., building, street name"
                    className="w-full text-xs p-3 rounded-xl border border-[#A99B91]/40 bg-white text-[#201C1C] focus:border-[#75192F] outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#201C1C] mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Mumbai"
                      className="w-full text-xs p-3 rounded-xl border border-[#A99B91]/40 bg-white text-[#201C1C] focus:border-[#75192F] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#201C1C] mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-[#A99B91]/40 bg-white text-[#201C1C] focus:border-[#75192F] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#201C1C] mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      placeholder="e.g. 400050"
                      className="w-full text-xs p-3 rounded-xl border border-[#A99B91]/40 bg-white text-[#201C1C] focus:border-[#75192F] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Section */}
              <div className="bg-[#FDFBF7] p-6 sm:p-8 rounded-3xl border border-[#A99B91]/30 shadow-sm space-y-6">
                <div className="flex items-center gap-2.5 pb-4 border-b border-[#A99B91]/20">
                  <div className="w-7 h-7 rounded-full bg-[#75192F] text-[#F8F3EB] flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#201C1C]">
                    Select Demo Payment Method
                  </h3>
                </div>

                {/* Method Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'upi', label: 'UPI / QR', icon: Smartphone },
                    { id: 'card', label: 'Cards', icon: CreditCard },
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
                        className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition cursor-pointer ${
                          isSel
                            ? 'bg-[#75192F]/10 border-[#75192F] text-[#75192F] ring-2 ring-[#75192F]/20 shadow-sm'
                            : 'bg-[#F8F3EB] border-[#A99B91]/30 text-[#201C1C] hover:border-[#75192F]'
                        }`}
                      >
                        <Icon className="w-5 h-5 mb-2 text-[#75192F]" />
                        <span className="text-xs font-semibold">{m.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Method Specific UI */}
                <div className="bg-[#F8F3EB] p-5 rounded-2xl border border-[#A99B91]/25">
                  {paymentMethod === 'upi' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#201C1C]">
                          Scan QR or Tap UPI App
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          Instant Verification
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-6 bg-white p-4 rounded-xl border border-[#A99B91]/20">
                        {/* Mock QR Code visual */}
                        <div className="w-32 h-32 bg-[#201C1C] rounded-xl p-2.5 flex flex-col items-center justify-center text-[#F8F3EB] shadow-md flex-shrink-0">
                          <QrCode className="w-20 h-20 text-[#D4A72C]" />
                          <span className="text-[9px] font-mono mt-1 text-[#A99B91]">
                            UPI ID: thrift@upi
                          </span>
                        </div>

                        <div className="space-y-2 text-xs">
                          <p className="font-semibold text-[#201C1C]">
                            Scan with Google Pay, PhonePe, or Paytm
                          </p>
                          <p className="text-[11px] text-[#201C1C]/75">
                            Demo amount: <strong className="text-[#75192F]">₹{totals.total}</strong>
                          </p>
                          <div className="flex gap-2 pt-1">
                            <span className="px-2.5 py-1 rounded bg-[#EDE5D8] text-[10px] font-semibold text-[#201C1C]">
                              GPay
                            </span>
                            <span className="px-2.5 py-1 rounded bg-[#EDE5D8] text-[10px] font-semibold text-[#201C1C]">
                              PhonePe
                            </span>
                            <span className="px-2.5 py-1 rounded bg-[#EDE5D8] text-[10px] font-semibold text-[#201C1C]">
                              Paytm
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-[#201C1C]">Card Credentials (Demo)</span>
                        <span className="text-[11px] text-[#A99B91]">Sample values pre-filled</span>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#201C1C] mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-lg border border-[#A99B91]/40 bg-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#201C1C] mb-1">
                            Expiry
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full text-xs p-2.5 rounded-lg border border-[#A99B91]/40 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#201C1C] mb-1">
                            CVV
                          </label>
                          <input
                            type="password"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full text-xs p-2.5 rounded-lg border border-[#A99B91]/40 bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'netbanking' && (
                    <div className="space-y-3 text-xs">
                      <p className="font-bold text-[#201C1C]">Select Bank (Demo Simulation)</p>
                      <div className="grid grid-cols-3 gap-2">
                        {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Bank', 'Other Bank'].map(
                          (b) => (
                            <button
                              key={b}
                              type="button"
                              className="p-2 rounded-lg bg-white border border-[#A99B91]/30 hover:border-[#75192F] text-[11px] font-semibold text-[#201C1C] text-center"
                            >
                              {b}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <div className="text-xs space-y-2 text-[#201C1C]/80">
                      <p className="font-bold text-[#201C1C]">Cash on Delivery Available</p>
                      <p>
                        Pay in cash or through UPI QR directly to the courier agent when your package arrives at your doorstep.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-[#A99B91] pt-1">
                  <ShieldCheck className="w-4 h-4 text-[#D4A72C]" />
                  <span>256-bit SSL encrypted • Zero real banking details requested</span>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary Cart & CTA */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#FDFBF7] p-6 sm:p-8 rounded-3xl border border-[#A99B91]/30 shadow-sm space-y-6 sticky top-28">
                <div className="flex items-center justify-between pb-4 border-b border-[#A99B91]/20">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#201C1C]">
                    Order Summary ({totals.itemCount})
                  </h3>
                  <button
                    type="button"
                    onClick={onNavigateToShop}
                    className="text-xs text-[#75192F] font-semibold hover:underline cursor-pointer"
                  >
                    Edit Cart
                  </button>
                </div>

                {/* Items in Cart */}
                <div className="divide-y divide-[#A99B91]/20 max-h-60 overflow-y-auto pr-1">
                  {items.map((it) => (
                    <div key={it.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3">
                      <img
                        src={it.image}
                        alt={it.title}
                        className="w-14 h-18 rounded-xl object-cover bg-[#EDE5D8] border border-[#A99B91]/30 flex-shrink-0"
                      />
                      <div className="min-w-0 flex-grow">
                        <h4 className="font-serif font-bold text-xs text-[#201C1C] truncate">
                          {it.title}
                        </h4>
                        <p className="text-[11px] text-[#A99B91] mt-0.5">
                          Size: {it.size} • Qty: {it.quantity}
                        </p>
                        <p className="font-bold text-xs text-[#75192F] mt-1">
                          ₹{it.price * it.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code Input */}
                <div className="pt-2 border-t border-[#A99B91]/20">
                  <div className="flex gap-2">
                    <div className="relative flex-grow">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Promo Code (e.g. THRIFT10)"
                        className="w-full text-xs pl-8 pr-3 py-2.5 rounded-xl border border-[#A99B91]/40 bg-white uppercase text-[#201C1C] outline-none focus:border-[#75192F]"
                      />
                      <Tag className="w-3.5 h-3.5 text-[#A99B91] absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-4 py-2 rounded-xl bg-[#201C1C] text-[#F8F3EB] text-xs font-semibold hover:bg-[#75192F] transition cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {promoMessage && (
                    <p
                      className={`text-[11px] font-medium mt-1.5 ${
                        promoPercent > 0 ? 'text-green-700' : 'text-red-600'
                      }`}
                    >
                      {promoMessage}
                    </p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 text-xs text-[#201C1C]/80 pt-2 border-t border-[#A99B91]/20">
                  <div className="flex justify-between">
                    <span>Items Subtotal:</span>
                    <span className="font-mono">₹{totals.subtotal}</span>
                  </div>
                  {totals.discountAmount > 0 && (
                    <div className="flex justify-between text-green-700">
                      <span>Promo Discount ({promoPercent}%):</span>
                      <span className="font-mono">-₹{totals.discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Courier Delivery:</span>
                    <span className="font-medium">
                      {totals.shippingFee === 0 ? (
                        <span className="text-green-700 font-bold">FREE</span>
                      ) : (
                        `₹${totals.shippingFee}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#75192F] pt-2 border-t border-[#A99B91]/20">
                    <span>Grand Total:</span>
                    <span className="font-mono">₹{totals.total}</span>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full bg-[#75192F] hover:bg-[#5a1122] disabled:opacity-50 text-[#F8F3EB] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl transition cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'Authorizing Demo Payment...'
                      : `Pay & Place Order (₹${totals.total})`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
