import React from 'react';
import { ArrowRight, Recycle, SearchCheck, Sparkles, Truck, CheckCircle2 } from 'lucide-react';

interface OurStoryProps {
  onShopClick: () => void;
}

export const OurStory: React.FC<OurStoryProps> = ({ onShopClick }) => {
  const steps = [
    {
      num: '01',
      title: 'Wholesale Sourcing',
      desc: 'We scour trusted wholesale vintage apparel markets and export lots, hand-selecting pieces with timeless character, durable construction, and great silhouettes.',
      icon: SearchCheck,
    },
    {
      num: '02',
      title: 'Inspection & Eco Sanitization',
      desc: 'Every garment undergoes a detailed seam-by-seam inspection for flaws or missing hardware, followed by gentle, fabric-safe professional washing and steam sterilization.',
      icon: Sparkles,
    },
    {
      num: '03',
      title: 'Honest Photography & Sizing',
      desc: 'We photograph each unique piece with accurate natural lighting and disclose measurements, condition grade, and any visible imperfections with total transparency.',
      icon: Recycle,
    },
    {
      num: '04',
      title: 'Plastic-Free Courier Delivery',
      desc: 'Carefully packaged using recycled kraft paper and biodegradable protective sleeves, delivered quickly across India via dependable courier partners.',
      icon: Truck,
    },
  ];

  return (
    <div className="bg-[#F8F3EB] py-16 sm:py-20 border-t border-[#A99B91]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Editorial Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#75192F]/10 border border-[#75192F]/20 text-[#75192F] text-xs font-semibold uppercase tracking-wider">
              <img
                src="/thrift_style_logo.jpg"
                alt="Thrift & Style Seal"
                className="w-4 h-4 rounded-full object-cover border border-[#75192F]/40"
              />
              <span>Our Mission &amp; Purpose • Est. 2025</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#201C1C] leading-tight">
              Fashion with a <br />
              <span className="italic font-normal text-[#75192F]">little more thought.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#201C1C]/80 leading-relaxed">
              At <strong className="text-[#201C1C]">Thrift &amp; Style</strong>, we believe great fashion shouldn&apos;t be expensive or wasteful. We are a student-led initiative passionate about circular styling—curating distinctive pre-loved vintage and streetwear clothing at honest prices so anyone can look good, feel confident, and make mindful wardrobe decisions.
            </p>

            <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-[#A99B91]/30 space-y-3">
              <h2 className="font-serif text-lg font-bold text-[#201C1C]">
                Our Core Mission
              </h2>
              <p className="text-sm text-[#201C1C]/75 leading-relaxed">
                To make fashion stylish, affordable, and more sustainable by helping wearable clothes find a new owner, keeping timeless garments in circulation and out of landfills.
              </p>
              <div className="pt-2 text-xs font-bold uppercase tracking-widest text-[#75192F]">
                Pre-Loved. Re-Styled. Re-Worn.
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onShopClick}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#75192F] hover:bg-[#5a1122] text-[#F8F3EB] font-semibold text-xs sm:text-sm shadow-md transition cursor-pointer"
              >
                <span>Explore the Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Editorial Campaign Imagery */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-[#A99B91]/30 bg-[#201C1C] relative">
              <img
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=80"
                alt="Thrift & Style Editorial Mission"
                className="w-full h-[460px] object-cover object-center"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-[#F8F3EB]">
                <div className="bg-[#F8F3EB]/95 text-[#201C1C] p-5 rounded-2xl shadow-xl border border-white/20">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#75192F]">
                    Student Startup Ethos
                  </span>
                  <h2 className="font-serif font-bold text-xl mt-1">Good Clothes. Better Future.</h2>
                  <p className="text-xs text-[#201C1C]/80 mt-1">
                    Every piece has a history. You give it its second chapter.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The 4-Step Sourcing & Delivery Process */}
        <div className="pt-10 border-t border-[#A99B91]/25">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-[#75192F]">
              Step-by-Step Transparency
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#201C1C] mt-2">
              How Thrift &amp; Style Works
            </h2>
            <p className="text-sm text-[#201C1C]/75 mt-2">
              From wholesale market discovery to your doorstep, we manage every step with quality care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.num}
                  className="bg-[#FDFBF7] p-6 rounded-2xl border border-[#A99B91]/30 hover:border-[#75192F] transition duration-300 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-2xl font-bold text-[#75192F]/40">
                        {st.num}
                      </span>
                      <div className="p-2.5 rounded-xl bg-[#75192F]/10 text-[#75192F]">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-[#201C1C] mb-2">
                      {st.title}
                    </h3>

                    <p className="text-xs text-[#201C1C]/75 leading-relaxed">
                      {st.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#A99B91]/15 flex items-center gap-1.5 text-[11px] font-semibold text-[#75192F]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified Quality</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
