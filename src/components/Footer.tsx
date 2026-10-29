import React, { useState } from 'react';
import { subscribeNewsletter } from '../firebase';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, HelpCircle, RotateCcw, Ruler, Package } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenOrders?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenOrders }) => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubscribing(true);
    setErrorMsg('');

    try {
      await subscribeNewsletter(email.trim());
      setSubscribed(true);
      setEmail('');
    } catch {
      // Graceful fallback for demo
      setSubscribed(true);
      setEmail('');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-[#201C1C] text-[#F8F3EB] pt-16 pb-12 border-t border-[#A99B91]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Col 1: Brand Wordmark & Tagline */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#D4A72C]/40 shadow-md">
                <img
                  src="/thrift_style_logo.jpg"
                  alt="Thrift & Style Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#F8F3EB] block leading-none">
                  THRIFT &amp; STYLE
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4A72C] font-semibold mt-1 block">
                  Est. 2025 • Student Collective
                </span>
              </div>
            </div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#D4A72C] font-semibold">
              Pre-Loved. Re-Styled. Re-Worn.
            </p>
            <p className="text-xs text-[#A99B91] leading-relaxed max-w-sm">
              A student-led initiative curating genuine vintage, workwear, and streetwear fashion. Sourced with passion, authenticated with honesty, and priced for everyone.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4A72C]">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-[#A99B91]">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#F8F3EB] transition cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop')}
                  className="hover:text-[#F8F3EB] transition cursor-pointer"
                >
                  Shop Collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('story')}
                  className="hover:text-[#F8F3EB] transition cursor-pointer"
                >
                  Our Mission
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('team')}
                  className="hover:text-[#F8F3EB] transition cursor-pointer"
                >
                  Our Team
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('business')}
                  className="hover:text-[#F8F3EB] transition cursor-pointer"
                >
                  Business Plan &amp; Capital
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#F8F3EB] transition cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care Policy Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4A72C]">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-[#A99B91]">
              <li>
                <button
                  onClick={() => setActiveModal('shipping')}
                  className="hover:text-[#F8F3EB] transition cursor-pointer text-left"
                >
                  Shipping &amp; Courier Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('returns')}
                  className="hover:text-[#F8F3EB] transition cursor-pointer text-left"
                >
                  Returns &amp; Refund Guidelines
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('faqs')}
                  className="hover:text-[#F8F3EB] transition cursor-pointer text-left"
                >
                  Thrift FAQs &amp; Sanitization
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('size')}
                  className="hover:text-[#F8F3EB] transition cursor-pointer text-left"
                >
                  Vintage Size Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (onOpenOrders) onOpenOrders();
                    else setActiveModal('track');
                  }}
                  className="hover:text-[#F8F3EB] transition cursor-pointer text-left"
                >
                  Track Demo Order
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter Signup */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4A72C]">
              Join Our Community
            </h4>
            <p className="text-xs text-[#A99B91] leading-relaxed">
              Get notified first when new curated vintage drops land. No spam, ever.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-[#75192F]/30 border border-[#75192F] flex items-center gap-2 text-xs text-green-300">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>You&apos;re subscribed to Thrift &amp; Style drop alerts!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-white/10 text-[#F8F3EB] placeholder-[#A99B91] text-xs px-3.5 py-2.5 rounded-xl border border-white/10 outline-none focus:border-[#D4A72C] transition pr-10"
                  />
                  <button
                    type="submit"
                    disabled={isSubscribing}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-[#75192F] hover:bg-[#5a1122] text-[#F8F3EB] rounded-lg transition cursor-pointer"
                    aria-label="Submit newsletter subscription"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {errorMsg && <p className="text-[11px] text-red-400">{errorMsg}</p>}
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#A99B91] gap-4">
          <p>© {new Date().getFullYear()} Thrift &amp; Style. Student Startup Pitch Concept. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Sustainable Fashion</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span>Made with</span>
              <Sparkles className="w-3 h-3 text-[#D4A72C]" />
              <span>for circular closets</span>
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Customer Care Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FDFBF7] text-[#201C1C] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#A99B91]/30 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#A99B91]/20">
              <h3 className="font-serif text-lg font-bold">
                {activeModal === 'shipping' && 'Shipping & Courier Policy'}
                {activeModal === 'returns' && 'Returns & Refund Guidelines'}
                {activeModal === 'faqs' && 'Thrift & Sanitization FAQs'}
                {activeModal === 'size' && 'Vintage Size & Fit Guide'}
                {activeModal === 'track' && 'Track Demo Order'}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full hover:bg-[#EDE5D8] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-[#201C1C]/80 leading-relaxed space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {activeModal === 'shipping' && (
                <>
                  <p>• <strong>Free Courier Delivery:</strong> All orders above ₹999 automatically qualify for free expedited shipping across India.</p>
                  <p>• <strong>Flat Courier Rate:</strong> A flat ₹99 fee applies to orders under ₹999.</p>
                  <p>• <strong>Delivery Timelines:</strong> Metro cities typically receive delivery within 3–4 business days. Regional destinations within 5–7 days.</p>
                  <p>• <strong>Plastic-Free Packaging:</strong> Wrapped in recyclable kraft envelopes and biodegradable protective paper.</p>
                </>
              )}
              {activeModal === 'returns' && (
                <>
                  <p>• <strong>Pre-Loved Nature:</strong> Because every thrifted item is a unique 1-of-1 piece with measurements and flaw notes provided up front, we encourage double-checking fit before ordering.</p>
                  <p>• <strong>7-Day Store Credit:</strong> If an item arrives with an undisclosed major defect not specified on the product card, contact us within 7 days for a full store credit or replacement find.</p>
                </>
              )}
              {activeModal === 'faqs' && (
                <>
                  <p><strong>Are all clothes sanitized?</strong> Yes! Every vintage piece is inspected for fabric integrity, washed with eco-friendly hypoallergenic detergent, and high-temperature steam sanitized before listing.</p>
                  <p><strong>Are the brands authentic?</strong> Yes, our team hand-checks labels, hardware, and stitching on vintage denim, sports, and workwear brands.</p>
                </>
              )}
              {activeModal === 'size' && (
                <>
                  <p>Vintage sizes from the 80s and 90s often differ from modern fast fashion sizing. We measure every piece flat in inches:</p>
                  <p>• <strong>Pit-to-Pit (Chest):</strong> From underarm seam across to the other underarm seam.</p>
                  <p>• <strong>Length:</strong> From highest shoulder point to bottom hem.</p>
                  <p>We recommend measuring your favorite jacket or tee flat and comparing!</p>
                </>
              )}
              {activeModal === 'track' && (
                <div className="space-y-3">
                  <p>Enter your 6-digit Demo Order Reference to check simulated package status:</p>
                  <input
                    type="text"
                    placeholder="e.g. DEMO-ORD-123456"
                    className="w-full text-xs p-2.5 rounded-lg border border-[#A99B91]/40 bg-white"
                  />
                  <div className="p-3 rounded-lg bg-[#EDE5D8]/60 text-[11px] text-[#201C1C]">
                    Status: <strong>Order Packed &amp; Scheduled for Courier Pickup</strong>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 rounded-full bg-[#75192F] text-[#F8F3EB] text-xs font-semibold"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
