import React, { useState } from 'react';
import { CartItem } from '../types';
import { calculateCartTotals } from '../utils/calculations';
import { X, Trash2, ArrowRight, ShoppingBag, Tag, Sparkles } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onContinueShopping,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscountPercent, setPromoDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');

  if (!isOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'THRIFT10') {
      setPromoDiscountPercent(10);
      setPromoMessage('10% Thrift Startup discount applied!');
    } else if (code === 'STUDENT') {
      setPromoDiscountPercent(15);
      setPromoMessage('15% Student Discount applied!');
    } else {
      setPromoMessage('Invalid promo code. Try "THRIFT10" or "STUDENT".');
    }
  };

  const totals = calculateCartTotals(items, promoDiscountPercent);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="relative w-full max-w-md bg-[#FDFBF7] h-full shadow-2xl flex flex-col justify-between border-l border-[#A99B91]/30 animate-in slide-in-from-right duration-300">
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-[#A99B91]/25 flex items-center justify-between bg-[#F8F3EB]">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#201C1C]">
              Your Cart ({totals.itemCount})
            </h2>
            <p className="text-xs text-[#A99B91] mt-0.5">
              {totals.subtotal >= 999
                ? 'Unlocked Free Express Delivery!'
                : `Add ₹${999 - totals.subtotal} more for free courier shipping`}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#A99B91]/20 text-[#201C1C] transition cursor-pointer"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free shipping progress bar */}
        {totals.subtotal > 0 && totals.subtotal < 999 && (
          <div className="bg-[#EDE5D8] px-6 py-2">
            <div className="w-full bg-[#A99B91]/30 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#75192F] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (totals.subtotal / 999) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Item List or Empty State */}
        <div className="flex-grow overflow-y-auto p-5 sm:p-6 divide-y divide-[#A99B91]/20">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
              <div className="w-20 h-20 rounded-full bg-[#75192F]/10 text-[#75192F] flex items-center justify-center">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#201C1C]">
                Your bag is empty
              </h3>
              <p className="text-sm text-[#201C1C]/70 max-w-xs">
                Explore our curated drops of pre-loved jackets, shirts, hoodies, and jeans.
              </p>
              <button
                onClick={() => {
                  onContinueShopping();
                  onClose();
                }}
                className="px-6 py-3 rounded-full bg-[#75192F] hover:bg-[#5a1122] text-[#F8F3EB] font-semibold text-xs shadow-md transition cursor-pointer"
              >
                Shop Collection Now
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4 items-center">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-24 object-cover rounded-xl bg-[#EDE5D8] border border-[#A99B91]/30 flex-shrink-0"
                />

                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-serif font-bold text-sm text-[#201C1C] truncate pr-2">
                      {item.title}
                    </h4>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-[#A99B91] hover:text-[#75192F] p-1 cursor-pointer transition"
                      aria-label={`Remove ${item.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-[#A99B91] mt-0.5">Size: {item.size}</p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-[#A99B91]/40 rounded-lg overflow-hidden bg-[#F8F3EB]">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="px-2.5 py-1 text-xs font-bold text-[#201C1C] hover:bg-[#EDE5D8] cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2 py-1 text-xs font-bold text-[#201C1C]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="px-2.5 py-1 text-xs font-bold text-[#201C1C] hover:bg-[#EDE5D8] cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-bold text-sm text-[#75192F]">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Order Summary & Checkout CTA */}
        {items.length > 0 && (
          <div className="p-5 sm:p-6 bg-[#F8F3EB] border-t border-[#A99B91]/25 space-y-4">
            {/* Promo code form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Discount code (e.g. THRIFT10)"
                  className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-[#A99B91]/40 bg-white uppercase text-[#201C1C] outline-none focus:border-[#75192F]"
                />
                <Tag className="w-3.5 h-3.5 text-[#A99B91] absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#201C1C] text-[#F8F3EB] text-xs font-semibold hover:bg-[#75192F] transition cursor-pointer"
              >
                Apply
              </button>
            </form>

            {promoMessage && (
              <p
                className={`text-[11px] font-medium ${
                  promoDiscountPercent > 0 ? 'text-green-700' : 'text-red-600'
                }`}
              >
                {promoMessage}
              </p>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-[#201C1C]/80">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{totals.subtotal}</span>
              </div>
              {totals.discountAmount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Promo Discount:</span>
                  <span>-₹{totals.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>{totals.shippingFee === 0 ? 'FREE' : `₹${totals.shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#75192F] pt-2 border-t border-[#A99B91]/20">
                <span>Total:</span>
                <span>₹{totals.total}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 rounded-full bg-[#75192F] hover:bg-[#5a1122] text-[#F8F3EB] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  onContinueShopping();
                  onClose();
                }}
                className="w-full py-2 text-xs font-medium text-[#201C1C]/75 hover:text-[#75192F] transition text-center cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
