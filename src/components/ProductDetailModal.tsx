import React, { useState } from 'react';
import { Product } from '../types';
import {
  X,
  Heart,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  Box,
  Share2,
  Check,
  Star,
  Ruler,
  AlertCircle,
  Clock,
  Layers,
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, quantity: number) => void;
  onBuyNow: (product: Product, size: string, quantity: number) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onOpen3D: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  isWishlisted,
  onOpen3D,
}) => {
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState(product.image);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'measurements' | 'condition' | 'care'>('measurements');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-4xl bg-[#FDFBF7] rounded-3xl shadow-2xl border border-[#A99B91]/30 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#EDE5D8]/80 hover:bg-[#75192F] hover:text-[#F8F3EB] text-[#201C1C] transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto">
          {/* Left Column: Gallery & 3D button */}
          <div className="md:col-span-6 p-6 sm:p-8 bg-[#F8F3EB] border-b md:border-b-0 md:border-r border-[#A99B91]/25 flex flex-col justify-between">
            <div>
              {/* Main Photo with 3D Trigger */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#EDE5D8] border border-[#A99B91]/30 shadow-inner group">
                <img
                  src={selectedImage}
                  alt={product.title}
                  className="w-full h-full object-cover object-center"
                />

                {/* 3D Launch Banner Overlay */}
                {product.has3DModel && (
                  <button
                    onClick={() => onOpen3D(product)}
                    className="absolute bottom-4 left-4 right-4 bg-[#201C1C]/90 hover:bg-[#75192F] text-[#F8F3EB] py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
                  >
                    <Box className="w-4 h-4 text-[#D4A72C]" />
                    <span>Inspect Fabric &amp; Seams in 3D Studio</span>
                  </button>
                )}
              </div>

              {/* Thumbnail Rail */}
              {product.galleryImages.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
                  {product.galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition cursor-pointer ${
                        selectedImage === img
                          ? 'border-[#75192F] ring-2 ring-[#75192F]/20'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.title} thumb ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Social Share & Link */}
            <div className="mt-6 pt-4 border-t border-[#A99B91]/20 flex items-center justify-between text-xs text-[#A99B91]">
              <span className="flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#D4A72C]" />
                <span>1-of-1 Curated Thrift Piece</span>
              </span>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 text-[#201C1C] hover:text-[#75192F] font-semibold cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-700" />
                    <span className="text-green-700">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Piece</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Details, Measurements, Flaw Disclosure & Actions */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Condition Badge */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs uppercase tracking-widest text-[#A99B91] font-bold">
                  {product.category}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#75192F]/10 text-[#75192F] border border-[#75192F]/20">
                    {product.conditionBadge}
                  </span>

                  <button
                    onClick={() => onToggleWishlist(product)}
                    className={`p-1.5 rounded-full border transition cursor-pointer ${
                      isWishlisted
                        ? 'bg-[#75192F] text-[#F8F3EB] border-[#75192F]'
                        : 'border-[#A99B91]/40 text-[#201C1C] hover:text-[#75192F]'
                    }`}
                    aria-label="Wishlist toggle"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Product Title */}
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#201C1C] tracking-tight leading-snug">
                {product.title}
              </h2>

              {/* Pricing & Rating */}
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-3xl font-bold text-[#75192F]">₹{product.price}</span>
                {product.originalPrice > product.price && (
                  <span className="text-base text-[#A99B91] line-through font-normal">
                    ₹{product.originalPrice}
                  </span>
                )}
                {product.discountPercent && (
                  <span className="text-xs font-bold bg-[#D4A72C]/20 text-[#855e00] px-2.5 py-0.5 rounded-full">
                    {product.discountPercent}% OFF Original Retail
                  </span>
                )}
              </div>

              {/* Sample Review Tag */}
              <div className="flex items-center gap-2 mt-2 text-xs text-[#201C1C]/75">
                <div className="flex items-center text-[#D4A72C]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span>4.8</span>
                <span className="text-[#A99B91]">(Sample Reviews: {product.sampleReviewCount || 134})</span>
              </div>

              {/* Description */}
              <p className="text-sm text-[#201C1C]/80 mt-4 leading-relaxed">
                {product.description}
              </p>

              {/* Trust Notes (Slide 05 requirement) */}
              <div className="mt-5 p-3.5 rounded-xl bg-[#EDE5D8]/50 border border-[#A99B91]/20 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-[#201C1C]">
                  <ShieldCheck className="w-4 h-4 text-[#75192F] flex-shrink-0" />
                  <span className="font-semibold">Pre-loved &amp; authentic:</span>
                  <span className="text-[#201C1C]/70">Hand-verified genuine vintage piece.</span>
                </div>
                <div className="flex items-center gap-2 text-[#201C1C]">
                  <Sparkles className="w-4 h-4 text-[#75192F] flex-shrink-0" />
                  <span className="font-semibold">Cleaned &amp; quality checked:</span>
                  <span className="text-[#201C1C]/70">Eco-washed, steamed, and ready to wear.</span>
                </div>
                <div className="flex items-center gap-2 text-[#201C1C]">
                  <Clock className="w-4 h-4 text-[#75192F] flex-shrink-0" />
                  <span className="font-semibold">Sustainable fashion choice:</span>
                  <span className="text-[#201C1C]/70">Prevents quality garments from landfill waste.</span>
                </div>
              </div>

              {/* Tabs: Measurements, Condition & Visible Flaws, Care */}
              <div className="mt-5 border-t border-[#A99B91]/20 pt-4">
                <div className="flex border-b border-[#A99B91]/20 text-xs font-semibold">
                  <button
                    onClick={() => setActiveTab('measurements')}
                    className={`pb-2 px-3 border-b-2 transition cursor-pointer ${
                      activeTab === 'measurements'
                        ? 'border-[#75192F] text-[#75192F]'
                        : 'border-transparent text-[#A99B91] hover:text-[#201C1C]'
                    }`}
                  >
                    Measurements
                  </button>
                  <button
                    onClick={() => setActiveTab('condition')}
                    className={`pb-2 px-3 border-b-2 transition cursor-pointer ${
                      activeTab === 'condition'
                        ? 'border-[#75192F] text-[#75192F]'
                        : 'border-transparent text-[#A99B91] hover:text-[#201C1C]'
                    }`}
                  >
                    Condition &amp; Flaws
                  </button>
                  <button
                    onClick={() => setActiveTab('care')}
                    className={`pb-2 px-3 border-b-2 transition cursor-pointer ${
                      activeTab === 'care'
                        ? 'border-[#75192F] text-[#75192F]'
                        : 'border-transparent text-[#A99B91] hover:text-[#201C1C]'
                    }`}
                  >
                    Fabric &amp; Care
                  </button>
                </div>

                <div className="pt-3 text-xs text-[#201C1C]/80 leading-relaxed min-h-[60px]">
                  {activeTab === 'measurements' && (
                    <div className="grid grid-cols-2 gap-2">
                      {product.measurements.chest && (
                        <div>
                          <span className="font-bold text-[#201C1C]">Chest/Pit-to-pit:</span>{' '}
                          {product.measurements.chest}
                        </div>
                      )}
                      {product.measurements.length && (
                        <div>
                          <span className="font-bold text-[#201C1C]">Total Length:</span>{' '}
                          {product.measurements.length}
                        </div>
                      )}
                      {product.measurements.shoulder && (
                        <div>
                          <span className="font-bold text-[#201C1C]">Shoulder Width:</span>{' '}
                          {product.measurements.shoulder}
                        </div>
                      )}
                      {product.measurements.sleeve && (
                        <div>
                          <span className="font-bold text-[#201C1C]">Sleeve Length:</span>{' '}
                          {product.measurements.sleeve}
                        </div>
                      )}
                      {product.measurements.waist && (
                        <div>
                          <span className="font-bold text-[#201C1C]">Waist:</span>{' '}
                          {product.measurements.waist}
                        </div>
                      )}
                      {product.measurements.inseam && (
                        <div>
                          <span className="font-bold text-[#201C1C]">Inseam:</span>{' '}
                          {product.measurements.inseam}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'condition' && (
                    <div className="space-y-1.5">
                      <p>
                        <strong className="text-[#201C1C]">Grading:</strong> {product.conditionGrade}
                      </p>
                      <div className="flex items-start gap-1.5 text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Transparent Flaw Disclosure: </span>
                          <span>{product.visibleFlaws}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'care' && (
                    <div className="space-y-1.5">
                      <p>
                        <strong className="text-[#201C1C]">Fabric:</strong> {product.fabricDetails}
                      </p>
                      <p>
                        <strong className="text-[#201C1C]">Care Instructions:</strong>{' '}
                        {product.careNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Size Selector */}
              <div className="mt-5">
                <div className="flex justify-between items-center text-xs font-semibold mb-2">
                  <span className="text-[#201C1C]">Select Available Size</span>
                  <span className="text-[#75192F] flex items-center gap-1 cursor-pointer">
                    <Ruler className="w-3.5 h-3.5" />
                    <span>True-to-Fit Vintage</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                        selectedSize === s
                          ? 'bg-[#75192F] text-[#F8F3EB] border-[#75192F] shadow-sm'
                          : 'bg-[#F8F3EB] text-[#201C1C] border-[#A99B91]/40 hover:border-[#75192F]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="mt-4 flex items-center gap-4">
                <span className="text-xs font-semibold text-[#201C1C]">Quantity:</span>
                <div className="flex items-center border border-[#A99B91]/40 rounded-lg overflow-hidden bg-[#F8F3EB]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-sm font-bold text-[#201C1C] hover:bg-[#EDE5D8] cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-[#201C1C]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-sm font-bold text-[#201C1C] hover:bg-[#EDE5D8] cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* CTAs: Add to Cart & Buy Now */}
            <div className="pt-4 border-t border-[#A99B91]/25 grid grid-cols-2 gap-3">
              <button
                onClick={() => onAddToCart(product, selectedSize, quantity)}
                className="py-3 px-4 rounded-xl bg-[#201C1C] hover:bg-[#75192F] text-[#F8F3EB] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={() => onBuyNow(product, selectedSize, quantity)}
                className="py-3 px-4 rounded-xl bg-[#75192F] hover:bg-[#5a1122] text-[#F8F3EB] font-semibold text-xs sm:text-sm shadow-md transition cursor-pointer"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
