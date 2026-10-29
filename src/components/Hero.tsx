import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Leaf, Globe2, Box } from 'lucide-react';

interface HeroProps {
  onShopClick: () => void;
  onMissionClick: () => void;
  onLaunch3D: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick, onMissionClick, onLaunch3D }) => {
  return (
    <section className="relative overflow-hidden bg-[#F8F3EB] pt-6 pb-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Editorial Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Editorial Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#75192F]/10 border border-[#75192F]/20 text-[#75192F] text-xs font-semibold uppercase tracking-wider shadow-sm">
              <img
                src="/thrift_style_logo.jpg"
                alt="Thrift & Style Seal"
                className="w-4 h-4 rounded-full object-cover border border-[#75192F]/40"
              />
              <Sparkles className="w-3.5 h-3.5 text-[#D4A72C]" />
              <span>Official Student Collective • Est. 2025</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#201C1C] leading-[1.12]">
              Good style. <br />
              <span className="italic font-normal text-[#75192F]">Second story.</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#201C1C]/80 max-w-xl font-normal leading-relaxed">
              Discover pre-loved and vintage clothing selected for people who want personal style without the premium price tag.
            </p>

            <div className="pt-1">
              <span className="text-sm font-semibold tracking-widest text-[#75192F] uppercase">
                Pre-Loved. Re-Styled. Re-Worn.
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onShopClick}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#75192F] text-[#F8F3EB] font-semibold text-sm hover:bg-[#5a1122] transition shadow-md hover:shadow-lg cursor-pointer"
              >
                <span>Shop the Thrift</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onMissionClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#F8F3EB] text-[#201C1C] border border-[#201C1C] font-semibold text-sm hover:bg-[#201C1C] hover:text-[#F8F3EB] transition cursor-pointer"
              >
                <span>Our Mission</span>
              </button>

              <button
                onClick={onLaunch3D}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-[#EDE5D8] text-[#75192F] border border-[#A99B91]/50 font-semibold text-sm hover:bg-[#D4A72C]/20 transition cursor-pointer"
              >
                <Box className="w-4 h-4 text-[#D4A72C]" />
                <span>3D Garment Studio</span>
              </button>
            </div>
          </div>

          {/* Right Hero Editorial Visual Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative frame */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#75192F]/20 to-[#D4A72C]/20 rounded-3xl transform -rotate-1" />

              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#A99B91]/40 bg-[#201C1C]">
                <img
                  src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80"
                  alt="Editorial Thrift Fashion Models"
                  className="w-full h-[420px] sm:h-[480px] object-cover object-top opacity-95 hover:scale-105 transition duration-700"
                />

                {/* Overlaid Editorial Glass Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#201C1C]/90 text-[#F8F3EB] p-4 rounded-xl border border-white/10 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-widest text-[#D4A72C] font-semibold">
                        Curated Drop #01
                      </p>
                      <h2 className="font-serif text-lg font-bold">Vintage Workwear &amp; Knits</h2>
                    </div>
                    <span className="text-xs bg-[#75192F] text-[#F8F3EB] px-2.5 py-1 rounded-full font-bold">
                      From ₹399
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Strip */}
        <div className="mt-14 pt-8 border-t border-[#A99B91]/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-[#FDFBF7] border border-[#A99B91]/20">
              <div className="p-2.5 rounded-lg bg-[#75192F]/10 text-[#75192F]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-[#201C1C]">Affordable Fashion</h3>
                <p className="text-sm text-[#201C1C]/75 mt-0.5">Look good, spend less. Curated pieces starting at ₹399 without retail markups.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-[#FDFBF7] border border-[#A99B91]/20">
              <div className="p-2.5 rounded-lg bg-[#75192F]/10 text-[#75192F]">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-[#201C1C]">Sustainable Choice</h3>
                <p className="text-sm text-[#201C1C]/75 mt-0.5">Better for the planet. Extend the life cycle of quality wearable clothes.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-[#FDFBF7] border border-[#A99B91]/20">
              <div className="p-2.5 rounded-lg bg-[#75192F]/10 text-[#75192F]">
                <Globe2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-[#201C1C]">Global Styles</h3>
                <p className="text-sm text-[#201C1C]/75 mt-0.5">From around the world. Hand-picked authentic 90s, streetwear, and vintage finds.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
