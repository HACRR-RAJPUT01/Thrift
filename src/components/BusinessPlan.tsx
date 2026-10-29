import React, { useState } from 'react';
import { FINANCIAL_PLAN } from '../data/team';
import { calculatePitchFinancials } from '../utils/calculations';
import { BarChart3, TrendingUp, ShieldAlert, Sparkles, Sliders, Calculator, PieChart } from 'lucide-react';

export const BusinessPlan: React.FC = () => {
  const [interactiveUnits, setInteractiveUnits] = useState(40);
  const [interactiveAvgPrice, setInteractiveAvgPrice] = useState(650);

  const interactiveCalc = calculatePitchFinancials(interactiveUnits, interactiveAvgPrice);

  return (
    <section className="bg-[#F8F3EB] py-16 sm:py-20 border-t border-[#A99B91]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#75192F]/10 text-[#75192F] text-xs font-semibold uppercase tracking-wider mb-3">
            <BarChart3 className="w-3.5 h-3.5 text-[#D4A72C]" />
            <span>Student Startup Pitch Financials</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#201C1C]">
            Business Plan &amp; Capital Model
          </h2>

          <p className="text-sm text-[#201C1C]/75 mt-3 leading-relaxed">
            Transparent breakdown of our proposed initial capital allocation, unit economics, and projected first-cycle operating profit.
          </p>
        </div>

        {/* Capital Allocation & Initial Figures */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: ₹20,000 Capital Allocation Breakdown */}
          <div className="lg:col-span-7 bg-[#FDFBF7] p-6 sm:p-8 rounded-3xl border border-[#A99B91]/30 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#A99B91]/20">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#A99B91]">
                  Seed Budget
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#201C1C]">
                  Proposed Initial Capital: ₹20,000
                </h3>
              </div>
              <div className="p-3 rounded-2xl bg-[#75192F]/10 text-[#75192F]">
                <PieChart className="w-6 h-6" />
              </div>
            </div>

            {/* List of 5 Capital Allocation Items */}
            <div className="space-y-4">
              {FINANCIAL_PLAN.items.map((item) => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs sm:text-sm font-semibold text-[#201C1C]">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#75192F]" />
                      <span>{item.label}</span>
                    </span>
                    <span className="font-mono text-[#75192F] font-bold">
                      ₹{item.amount.toLocaleString()} ({item.percent}%)
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-[#EDE5D8] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#75192F] h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-[#201C1C]/70">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Emergency Reserve Notice */}
            <div className="p-3.5 rounded-xl bg-[#EDE5D8]/50 border border-[#A99B91]/25 flex items-start gap-2.5 text-xs text-[#201C1C]/80">
              <Sparkles className="w-4 h-4 text-[#D4A72C] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#201C1C]">Emergency Reserve:</strong> ₹3,000 (15%) is prudently preserved in reserve to cushion against returns, shipping variances, or market fluctuations.
              </div>
            </div>
          </div>

          {/* Right: Core Pitch Projections & First Cycle Economics */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#201C1C] text-[#F8F3EB] p-6 sm:p-8 rounded-3xl border border-[#A99B91]/30 shadow-xl space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#D4A72C]">
                  Target Milestone
                </span>
                <h3 className="font-serif text-2xl font-bold mt-1">
                  First Cycle Target (40 Items)
                </h3>
              </div>

              <div className="space-y-3 divide-y divide-white/10 text-xs sm:text-sm">
                <div className="flex justify-between py-2">
                  <span className="text-[#A99B91]">Target Sales Volume:</span>
                  <span className="font-semibold">40 Curated Items</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#A99B91]">Average Selling Price (ASP):</span>
                  <span className="font-semibold">₹650 per piece</span>
                </div>
                <div className="flex justify-between py-2 text-base font-bold text-[#F8F3EB]">
                  <span>Target Gross Sales:</span>
                  <span className="font-mono text-[#D4A72C]">₹26,000</span>
                </div>
                <div className="flex justify-between py-2 text-red-300">
                  <span>(-) Stock Acquisition Cost:</span>
                  <span className="font-mono">-₹12,000</span>
                </div>
                <div className="flex justify-between py-2 text-red-300">
                  <span>(-) Operating Expenses:</span>
                  <span className="font-mono">-₹5,000</span>
                </div>
                <div className="flex justify-between py-3 text-lg font-bold text-green-400 bg-white/5 px-3 rounded-xl">
                  <span>Projected Operating Profit:</span>
                  <span className="font-mono">~₹9,000</span>
                </div>
              </div>

              {/* Profit Formula Callout */}
              <p className="text-[11px] text-[#A99B91] leading-relaxed">
                *Calculated as ₹26,000 sales − ₹12,000 stock cost − ₹5,000 operating costs (packaging, shipping &amp; tools).
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Pitch Calculator: Adjust units & price */}
        <div className="bg-[#FDFBF7] p-6 sm:p-8 rounded-3xl border border-[#A99B91]/30 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#A99B91]/20">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#75192F]">
                <Calculator className="w-4 h-4" />
                <span>Interactive Projection Model</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#201C1C] mt-1">
                Simulate Sales &amp; Margin Scenarios
              </h3>
            </div>
            <p className="text-xs text-[#201C1C]/70 max-w-sm">
              Adjust unit volume and average selling price to test financial viability across different inventory scales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Controls */}
            <div className="space-y-5">
              {/* Sliders */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-[#201C1C]">Garments Sold in Cycle:</span>
                  <span className="font-bold text-[#75192F]">{interactiveUnits} pieces</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={interactiveUnits}
                  onChange={(e) => setInteractiveUnits(Number(e.target.value))}
                  className="w-full accent-[#75192F] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#A99B91] mt-1">
                  <span>20 pcs (conservative)</span>
                  <span>40 pcs (pitch base)</span>
                  <span>100 pcs (scale)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-[#201C1C]">Average Selling Price (ASP):</span>
                  <span className="font-bold text-[#75192F]">₹{interactiveAvgPrice}</span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="1200"
                  step="25"
                  value={interactiveAvgPrice}
                  onChange={(e) => setInteractiveAvgPrice(Number(e.target.value))}
                  className="w-full accent-[#75192F] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#A99B91] mt-1">
                  <span>₹400 (budget tees/shirts)</span>
                  <span>₹650 (pitch blend)</span>
                  <span>₹1,200 (premium denim/leather)</span>
                </div>
              </div>
            </div>

            {/* Calculated Output Matrix */}
            <div className="bg-[#EDE5D8]/50 p-5 rounded-2xl border border-[#A99B91]/30 grid grid-cols-2 gap-4">
              <div className="bg-[#FDFBF7] p-3.5 rounded-xl border border-[#A99B91]/20">
                <span className="text-[10px] uppercase font-bold text-[#A99B91]">Simulated Revenue</span>
                <p className="font-serif text-2xl font-bold text-[#201C1C] mt-0.5">
                  ₹{interactiveCalc.revenue.toLocaleString()}
                </p>
              </div>

              <div className="bg-[#FDFBF7] p-3.5 rounded-xl border border-[#A99B91]/20">
                <span className="text-[10px] uppercase font-bold text-[#A99B91]">Simulated Profit</span>
                <p
                  className={`font-serif text-2xl font-bold mt-0.5 ${
                    interactiveCalc.projectedOperatingProfit >= 0 ? 'text-green-700' : 'text-red-600'
                  }`}
                >
                  ₹{interactiveCalc.projectedOperatingProfit.toLocaleString()}
                </p>
              </div>

              <div className="bg-[#FDFBF7] p-3.5 rounded-xl border border-[#A99B91]/20">
                <span className="text-[10px] uppercase font-bold text-[#A99B91]">Est. Margin</span>
                <p className="font-serif text-xl font-bold text-[#75192F] mt-0.5">
                  {Math.round((interactiveCalc.projectedOperatingProfit / interactiveCalc.revenue) * 100)}%
                </p>
              </div>

              <div className="bg-[#FDFBF7] p-3.5 rounded-xl border border-[#A99B91]/20">
                <span className="text-[10px] uppercase font-bold text-[#A99B91]">Per-Piece Profit</span>
                <p className="font-serif text-xl font-bold text-[#75192F] mt-0.5">
                  ₹{Math.round(interactiveCalc.projectedOperatingProfit / interactiveCalc.units)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mandatory Transparency Disclaimer (PDF Page 3) */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
          <ShieldAlert className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold">Official Pitch Disclosure &amp; Risk Notes:</h4>
            <p className="leading-relaxed">
              State clearly that this is an initial financial projection before other applicable expenses, taxes, and assumes target items sell at the estimated average price. The ₹3,000 emergency reserve is part of initial capital allocation and is not treated as an operating expense in this calculation. Projections are estimates and not guaranteed results.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
