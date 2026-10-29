import React from 'react';
import { Product } from '../types';
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles, Box, ShieldCheck } from 'lucide-react';

interface WishlistPageProps {
  wishlistProducts: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product, size: string, quantity: number) => void;
  onSelectProduct: (product: Product) => void;
  onNavigateToShop: () => void;
  onOpen3DForProduct?: (product: Product) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  wishlistProducts,
  onRemoveFromWishlist,
  onAddToCart,
  onSelectProduct,
  onNavigateToShop,
  onOpen3DForProduct,
}) => {
  const totalValue = wishlistProducts.reduce((sum, p) => sum + p.price, 0);

  const handleAddAllToCart = () => {
    wishlistProducts.forEach((product) => {
      onAddToCart(product, product.sizes[0] || 'M', 1);
    });
  };

  return (
    <div className="bg-[#F8F3EB] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-[#201C1C] text-[#F8F3EB] p-8 md:p-12 shadow-xl border border-[#A99B91]/30">
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2.5 mb-3">
              <img
                src="/thrift_style_logo.jpg"
                alt="Thrift & Style Logo"
                className="w-7 h-7 rounded-full object-cover border border-[#D4A72C]/50"
              />
              <span className="text-xs uppercase tracking-[0.2em] text-[#D4A72C] font-semibold flex items-center gap-1.5">
                <Heart className="w-4 h-4 fill-current text-[#D4A72C]" />
                <span>Personal Vintage Wishlist • Est. 2025</span>
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight mb-2">
              Saved Pieces
            </h1>
            <p className="text-[#A99B91] text-sm sm:text-base leading-relaxed">
              Curated garments you&apos;ve shortlisted. Thrift finds are mostly unique 1-of-1 pieces, so reserve your favorites before another shopper claims them.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-white/10 text-xs">
              <div>
                <span className="text-[#A99B91]">Total Saved:</span>{' '}
                <strong className="text-[#F8F3EB]">{wishlistProducts.length} pieces</strong>
              </div>
              <span className="text-white/20">•</span>
              <div>
                <span className="text-[#A99B91]">Estimated Value:</span>{' '}
                <strong className="font-mono text-[#D4A72C]">₹{totalValue}</strong>
              </div>

              {wishlistProducts.length > 0 && (
                <button
                  onClick={handleAddAllToCart}
                  className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#75192F] text-[#F8F3EB] font-semibold hover:bg-[#5a1122] transition cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Move All to Bag</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        {wishlistProducts.length === 0 ? (
          <div className="bg-[#FDFBF7] rounded-3xl border border-[#A99B91]/30 p-12 sm:p-16 text-center space-y-5 shadow-sm max-w-2xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-[#75192F]/10 text-[#75192F] flex items-center justify-center mx-auto">
              <Heart className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#201C1C]">
                Your wishlist is empty
              </h2>
              <p className="text-xs sm:text-sm text-[#201C1C]/75 max-w-md mx-auto">
                Explore our curated drops of pre-loved trucker jackets, cozy knit sweaters, flannel overshirts, and raw denim. Tap the heart to bookmark pieces.
              </p>
            </div>

            <button
              onClick={onNavigateToShop}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#75192F] hover:bg-[#5a1122] text-[#F8F3EB] font-semibold text-xs sm:text-sm transition shadow-md cursor-pointer"
            >
              <span>Explore Thrift Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-[#FDFBF7] rounded-2xl overflow-hidden border border-[#A99B91]/30 hover:border-[#75192F] transition duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between"
              >
                {/* Image & Badges */}
                <div className="relative aspect-[4/5] overflow-hidden bg-[#EDE5D8]">
                  <img
                    src={product.image}
                    alt={product.title}
                    onClick={() => onSelectProduct(product)}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500 cursor-pointer"
                  />

                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className="bg-[#201C1C]/90 text-[#F8F3EB] text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                      {product.conditionBadge}
                    </span>
                    {product.discountPercent && (
                      <span className="bg-[#75192F] text-[#F8F3EB] text-[10px] font-bold px-2 py-0.5 rounded-full w-max">
                        {product.discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onRemoveFromWishlist(product)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-[#75192F] text-[#F8F3EB] hover:bg-[#5a1122] transition shadow-md cursor-pointer"
                    aria-label={`Remove ${product.title} from wishlist`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {product.has3DModel && onOpen3DForProduct && (
                    <button
                      onClick={() => onOpen3DForProduct(product)}
                      className="absolute bottom-3 right-3 flex items-center gap-1 bg-[#201C1C]/90 text-[#D4A72C] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md hover:bg-[#75192F] hover:text-[#F8F3EB] transition cursor-pointer"
                    >
                      <Box className="w-3 h-3" />
                      <span>3D View</span>
                    </button>
                  )}
                </div>

                {/* Info & Actions */}
                <div className="p-4 flex flex-col flex-grow justify-between space-y-3">
                  <div>
                    <div className="flex justify-between items-center text-[11px] text-[#A99B91]">
                      <span>{product.category}</span>
                      <span>Sizes: {product.sizes.join(', ')}</span>
                    </div>

                    <h3
                      onClick={() => onSelectProduct(product)}
                      className="font-serif font-bold text-base text-[#201C1C] hover:text-[#75192F] transition cursor-pointer mt-1 line-clamp-1"
                    >
                      {product.title}
                    </h3>

                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-lg font-bold text-[#75192F]">₹{product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-[#A99B91] line-through">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#A99B91]/20 flex gap-2">
                    <button
                      onClick={() => onAddToCart(product, product.sizes[0] || 'M', 1)}
                      className="flex-grow py-2 px-3 rounded-xl bg-[#75192F] hover:bg-[#5a1122] text-[#F8F3EB] text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Cart</span>
                    </button>

                    <button
                      onClick={() => onSelectProduct(product)}
                      className="py-2 px-3 rounded-xl bg-[#EDE5D8] text-[#201C1C] hover:bg-[#201C1C] hover:text-[#F8F3EB] text-xs font-semibold transition cursor-pointer"
                    >
                      Inspect
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
