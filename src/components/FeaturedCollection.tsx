import React from 'react';
import { Product } from '../types';
import { ArrowRight, Heart, Sparkles, Box } from 'lucide-react';

interface FeaturedCollectionProps {
  products: Product[];
  onViewAll: () => void;
  onSelectProduct: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: string[];
  onOpen3DForProduct?: (product: Product) => void;
}

export const FeaturedCollection: React.FC<FeaturedCollectionProps> = ({
  products,
  onViewAll,
  onSelectProduct,
  onToggleWishlist,
  wishlistIds,
  onOpen3DForProduct,
}) => {
  // 4 items for featured collection matching PDF
  const featured = products.slice(0, 4);

  return (
    <section className="py-16 bg-[#F8F3EB] border-t border-[#A99B91]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#75192F] font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D4A72C]" />
              <span>Handpicked Vintage</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#201C1C]">
              Featured Collection
            </h2>
          </div>

          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#75192F] hover:text-[#5a1122] transition mt-4 sm:mt-0 group cursor-pointer"
          >
            <span>View All Thrift Pieces</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </div>

        {/* 4 Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {featured.map((product) => {
            const isWishlisted = wishlistIds.includes(product.id);

            return (
              <div
                key={product.id}
                className="group relative bg-[#FDFBF7] rounded-2xl overflow-hidden border border-[#A99B91]/30 hover:border-[#75192F] transition duration-300 shadow-sm hover:shadow-xl flex flex-col"
              >
                {/* Image Container with Badges */}
                <div className="relative aspect-[4/5] overflow-hidden bg-[#EDE5D8]">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500 cursor-pointer"
                    onClick={() => onSelectProduct(product)}
                  />

                  {/* Condition Badge */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className="bg-[#201C1C]/90 text-[#F8F3EB] text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm shadow-sm">
                      {product.conditionBadge}
                    </span>
                    {product.discountPercent && (
                      <span className="bg-[#75192F] text-[#F8F3EB] text-[10px] font-bold px-2 py-0.5 rounded-full w-max shadow-sm">
                        {product.discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full transition shadow-md cursor-pointer ${
                      isWishlisted
                        ? 'bg-[#75192F] text-[#F8F3EB]'
                        : 'bg-[#FDFBF7]/90 text-[#201C1C] hover:bg-[#75192F] hover:text-[#F8F3EB]'
                    }`}
                    aria-label={`Save ${product.title} to wishlist`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>

                  {/* 3D Model Badge if available */}
                  {product.has3DModel && onOpen3DForProduct && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpen3DForProduct(product);
                      }}
                      className="absolute bottom-3 right-3 flex items-center gap-1 bg-[#201C1C]/90 text-[#D4A72C] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md hover:bg-[#75192F] hover:text-[#F8F3EB] transition cursor-pointer"
                    >
                      <Box className="w-3 h-3" />
                      <span>3D View</span>
                    </button>
                  )}
                </div>

                {/* Card Information */}
                <div className="p-4 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#A99B91] mb-1">
                      <span>{product.category}</span>
                      <span>Sizes: {product.sizes.slice(0, 3).join(', ')}</span>
                    </div>

                    <h3
                      onClick={() => onSelectProduct(product)}
                      className="font-serif font-bold text-lg text-[#201C1C] hover:text-[#75192F] transition cursor-pointer line-clamp-1"
                    >
                      {product.title}
                    </h3>
                  </div>

                  <div className="pt-3 mt-2 border-t border-[#A99B91]/20 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-[#75192F]">₹{product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-[#A99B91] line-through">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => onSelectProduct(product)}
                      className="text-xs font-semibold text-[#201C1C] hover:text-[#75192F] bg-[#EDE5D8] hover:bg-[#75192F]/15 px-3 py-1.5 rounded-full transition cursor-pointer"
                    >
                      Quick View
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
