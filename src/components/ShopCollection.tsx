import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { filterProducts } from '../utils/calculations';
import { Search, SlidersHorizontal, X, Heart, Sparkles, Box, Check, RotateCcw } from 'lucide-react';

interface ShopCollectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: string[];
  onOpen3DForProduct?: (product: Product) => void;
}

export const ShopCollection: React.FC<ShopCollectionProps> = ({
  products,
  onSelectProduct,
  onToggleWishlist,
  wishlistIds,
  onOpen3DForProduct,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'discount'>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(8);

  const categories = ['All', 'Jackets', 'Shirts', 'Jeans', 'Hoodies', 'Accessories'];
  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36'];

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
  };

  const handleSizeToggle = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const handleClearAll = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedSizes([]);
    setMaxPrice(2000);
    setSortBy('featured');
  };

  const filteredProducts = useMemo(() => {
    return filterProducts(products, {
      category: selectedCategory,
      sizes: selectedSizes,
      maxPrice,
      searchQuery,
      sortBy,
    });
  }, [products, selectedCategory, selectedSizes, maxPrice, searchQuery, sortBy]);

  const visibleProducts = filteredProducts.slice(0, displayCount);

  return (
    <div className="bg-[#F8F3EB] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Shop Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-[#201C1C] text-[#F8F3EB] p-8 md:p-12 mb-10 shadow-xl border border-[#A99B91]/30">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs uppercase tracking-[0.2em] text-[#D4A72C] font-semibold flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Vintage &amp; Second Story Finds</span>
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight mb-2">
              Shop Collection
            </h1>
            <p className="text-[#A99B91] text-base sm:text-lg mb-6">
              Curated thrift. Timeless style. Authenticated and priced transparently.
            </p>

            {/* Banner Search Field */}
            <div className="relative max-w-lg">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for jackets, shirts, jeans..."
                className="w-full bg-[#F8F3EB] text-[#201C1C] placeholder-[#A99B91] text-sm pl-11 pr-10 py-3.5 rounded-full outline-none focus:ring-2 focus:ring-[#75192F] shadow-md transition"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A99B91]" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A99B91] hover:text-[#201C1C]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Tiles */}
        <div className="mb-10 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-3 min-w-max">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition cursor-pointer flex items-center gap-2 border ${
                    isActive
                      ? 'bg-[#75192F] text-[#F8F3EB] border-[#75192F] shadow-md'
                      : 'bg-[#FDFBF7] text-[#201C1C] border-[#A99B91]/30 hover:border-[#75192F] hover:bg-[#EDE5D8]'
                  }`}
                >
                  <span>{cat}</span>
                  {isActive && <Check className="w-3.5 h-3.5 text-[#D4A72C]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Layout: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Mobile Filter Button */}
          <div className="lg:hidden flex items-center justify-between pb-4 border-b border-[#A99B91]/30">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#201C1C] text-[#F8F3EB] rounded-full text-sm font-medium shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#D4A72C]" />
              <span>Filters &amp; Refinements</span>
              {(selectedCategory !== 'All' || selectedSizes.length > 0 || maxPrice < 2000) && (
                <span className="w-2 h-2 rounded-full bg-[#D4A72C]" />
              )}
            </button>

            <span className="text-xs text-[#A99B91]">
              Showing {filteredProducts.length} pieces
            </span>
          </div>

          {/* Left Filter Rail (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3 bg-[#FDFBF7] p-6 rounded-2xl border border-[#A99B91]/30 shadow-sm sticky top-28 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#A99B91]/20">
              <h2 className="font-serif text-lg font-bold text-[#201C1C] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#75192F]" />
                <span>Filters</span>
              </h2>

              <button
                onClick={handleClearAll}
                className="text-xs text-[#75192F] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear All</span>
              </button>
            </div>

            {/* Category Checkboxes */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#A99B91] mb-3">
                Category
              </h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-3 text-sm text-[#201C1C] cursor-pointer hover:text-[#75192F] select-none"
                  >
                    <input
                      type="radio"
                      name="desktopCategory"
                      checked={selectedCategory === cat}
                      onChange={() => setSelectedCategory(cat)}
                      className="accent-[#75192F] w-4 h-4 rounded"
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Size Chips */}
            <div className="pt-4 border-t border-[#A99B91]/20">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#A99B91] mb-3">
                Size
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {allSizes.map((size) => {
                  const isSelected = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => handleSizeToggle(size)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#75192F] text-[#F8F3EB] border-[#75192F]'
                          : 'bg-[#F8F3EB] text-[#201C1C] border-[#A99B91]/40 hover:border-[#75192F]'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="pt-4 border-t border-[#A99B91]/20">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#A99B91]">
                  Price Range
                </h3>
                <span className="text-xs font-bold text-[#75192F]">₹0 - ₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="300"
                max="2000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#75192F] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#A99B91] mt-1">
                <span>₹300</span>
                <span>₹2,000</span>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-9">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#A99B91]/20 gap-4">
              <p className="text-sm text-[#201C1C]/80">
                Found <span className="font-bold text-[#75192F]">{filteredProducts.length}</span>{' '}
                unique thrifted garments
              </p>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#A99B91] font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#FDFBF7] text-[#201C1C] text-xs font-medium px-3 py-2 rounded-lg border border-[#A99B91]/30 outline-none focus:border-[#75192F] cursor-pointer"
                >
                  <option value="featured">Featured Curations</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="discount">Highest Discount</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-[#FDFBF7] rounded-2xl border border-[#A99B91]/30 p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#75192F]/10 text-[#75192F] flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#201C1C]">
                  No matching vintage pieces found
                </h3>
                <p className="text-sm text-[#201C1C]/70 max-w-md mx-auto">
                  Try broadening your search term, resetting size chips, or extending the price slider to see more vintage finds.
                </p>
                <button
                  onClick={handleClearAll}
                  className="px-6 py-2.5 rounded-full bg-[#75192F] text-[#F8F3EB] font-semibold text-xs hover:bg-[#5a1122] transition shadow-md cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visibleProducts.map((product) => {
                    const isWishlisted = wishlistIds.includes(product.id);

                    return (
                      <div
                        key={product.id}
                        className="group bg-[#FDFBF7] rounded-2xl overflow-hidden border border-[#A99B91]/30 hover:border-[#75192F] transition duration-300 shadow-sm hover:shadow-xl flex flex-col"
                      >
                        {/* Image Container */}
                        <div className="relative aspect-[4/5] overflow-hidden bg-[#EDE5D8]">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500 cursor-pointer"
                            onClick={() => onSelectProduct(product)}
                          />

                          {/* Badges */}
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

                          {/* 3D Model Badge */}
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

                        {/* Details */}
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

                            <p className="text-xs text-[#201C1C]/70 line-clamp-2 mt-1">
                              {product.description}
                            </p>
                          </div>

                          <div className="pt-3 mt-3 border-t border-[#A99B91]/20 flex items-center justify-between">
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
                              className="text-xs font-semibold text-[#201C1C] hover:text-[#75192F] bg-[#EDE5D8] hover:bg-[#75192F]/15 px-3.5 py-1.5 rounded-full transition cursor-pointer"
                            >
                              View Item
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Load More Button */}
                {displayCount < filteredProducts.length && (
                  <div className="mt-12 text-center">
                    <button
                      onClick={() => setDisplayCount((prev) => prev + 6)}
                      className="px-8 py-3 rounded-full bg-[#EDE5D8] text-[#201C1C] border border-[#A99B91]/40 font-semibold text-xs hover:bg-[#201C1C] hover:text-[#F8F3EB] transition shadow-sm cursor-pointer"
                    >
                      Load More Pieces ({filteredProducts.length - displayCount} remaining)
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm lg:hidden">
          <div className="w-full max-w-xs bg-[#FDFBF7] h-full p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#A99B91]/20">
                <h3 className="font-serif text-lg font-bold text-[#201C1C]">Filters</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1.5 text-[#201C1C] hover:text-[#75192F]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Category */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#A99B91] mb-2">
                  Category
                </h4>
                <div className="space-y-1.5">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-2.5 text-sm text-[#201C1C]">
                      <input
                        type="radio"
                        name="mobileCategory"
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)}
                        className="accent-[#75192F]"
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Mobile Sizes */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#A99B91] mb-2">
                  Size
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {allSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeToggle(size)}
                      className={`px-3 py-1 text-xs rounded border ${
                        selectedSizes.includes(size)
                          ? 'bg-[#75192F] text-[#F8F3EB] border-[#75192F]'
                          : 'bg-[#F8F3EB] text-[#201C1C] border-[#A99B91]/40'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Price */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-[#A99B91]">Price Limit</span>
                  <span className="font-bold text-[#75192F]">Up to ₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="2000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#75192F]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#A99B91]/20 space-y-2">
              <button
                onClick={() => {
                  handleClearAll();
                  setIsMobileFilterOpen(false);
                }}
                className="w-full py-2.5 rounded-lg border border-[#A99B91]/40 text-xs font-semibold text-[#201C1C]"
              >
                Clear All
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-2.5 rounded-lg bg-[#75192F] text-[#F8F3EB] text-xs font-semibold"
              >
                Apply Filters ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
