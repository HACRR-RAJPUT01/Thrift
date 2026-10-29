import React from 'react';
import { Product } from '../types';
import { X, Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product, size: string, quantity: number) => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveFromWishlist,
  onAddToCart,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="relative w-full max-w-md bg-[#FDFBF7] h-full shadow-2xl flex flex-col justify-between border-l border-[#A99B91]/30 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#A99B91]/25 flex items-center justify-between bg-[#F8F3EB]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#75192F] fill-current" />
            <h2 className="font-serif text-2xl font-bold text-[#201C1C]">
              Saved Wishlist ({wishlistProducts.length})
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#A99B91]/20 text-[#201C1C] transition cursor-pointer"
            aria-label="Close wishlist drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-5 sm:p-6 divide-y divide-[#A99B91]/20">
          {wishlistProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
              <div className="w-16 h-16 rounded-full bg-[#75192F]/10 text-[#75192F] flex items-center justify-center">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#201C1C]">
                No saved thrift finds yet
              </h3>
              <p className="text-xs text-[#201C1C]/70 max-w-xs">
                Tap the heart on any vintage denim, hoodie, or flannel to save it here for later.
              </p>
            </div>
          ) : (
            wishlistProducts.map((product) => (
              <div key={product.id} className="py-4 first:pt-0 last:pb-0 flex gap-4 items-center">
                <img
                  src={product.image}
                  alt={product.title}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="w-20 h-24 object-cover rounded-xl bg-[#EDE5D8] border border-[#A99B91]/30 flex-shrink-0 cursor-pointer"
                />

                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start">
                    <h4
                      onClick={() => {
                        onSelectProduct(product);
                        onClose();
                      }}
                      className="font-serif font-bold text-sm text-[#201C1C] truncate hover:text-[#75192F] cursor-pointer"
                    >
                      {product.title}
                    </h4>
                    <button
                      onClick={() => onRemoveFromWishlist(product)}
                      className="text-[#A99B91] hover:text-[#75192F] p-1 cursor-pointer transition"
                      aria-label="Remove item from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-[#A99B91] mt-0.5">{product.category}</p>

                  <div className="flex items-center justify-between mt-3">
                    <span className="font-bold text-sm text-[#75192F]">₹{product.price}</span>

                    <button
                      onClick={() => {
                        onAddToCart(product, product.sizes[0] || 'M', 1);
                        onRemoveFromWishlist(product);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#75192F] hover:bg-[#5a1122] text-[#F8F3EB] text-[11px] font-semibold transition cursor-pointer"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Move to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-5 bg-[#F8F3EB] border-t border-[#A99B91]/25">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-full bg-[#EDE5D8] text-[#201C1C] font-semibold text-xs hover:bg-[#201C1C] hover:text-[#F8F3EB] transition cursor-pointer"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
};
