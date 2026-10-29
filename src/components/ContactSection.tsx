import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSent(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <section className="bg-[#F8F3EB] py-16 sm:py-20 border-t border-[#A99B91]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#75192F]/10 text-[#75192F] text-xs font-semibold uppercase tracking-wider">
              <MessageSquare className="w-3.5 h-3.5 text-[#D4A72C]" />
              <span>Get in Touch</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#201C1C]">
              Connect with <br />
              <span className="italic font-normal text-[#75192F]">Thrift &amp; Style.</span>
            </h2>

            <p className="text-sm text-[#201C1C]/75 leading-relaxed">
              Have questions about sizing, thrift sourcing, consigning pre-loved pieces, or our student startup pitch? We&apos;d love to hear from you.
            </p>

            <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-[#A99B91]/30 space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#75192F]/10 text-[#75192F]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#201C1C]">Email Us</h4>
                  <p className="text-[#201C1C]/70">hello@thriftandstyle.student</p>
                  <p className="text-[11px] text-[#A99B91]">Typical response within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#75192F]/10 text-[#75192F]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#201C1C]">Campus Hub</h4>
                  <p className="text-[#201C1C]/70">Student Innovation &amp; Entrepreneurship Cell</p>
                  <p className="text-[11px] text-[#A99B91]">India</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#EDE5D8]/50 border border-[#A99B91]/25 flex items-center gap-2 text-xs text-[#201C1C]/80">
              <Sparkles className="w-4 h-4 text-[#D4A72C] flex-shrink-0" />
              <span>We accept student vintage consignments and curated pop-up collaborations.</span>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 bg-[#FDFBF7] p-6 sm:p-8 rounded-3xl border border-[#A99B91]/30 shadow-sm">
            {sent ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#201C1C]">
                  Message Received!
                </h3>
                <p className="text-xs text-[#201C1C]/70 max-w-sm mx-auto">
                  Thank you for reaching out to the Thrift &amp; Style student founding team. We will review your message shortly.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="px-6 py-2 rounded-full bg-[#75192F] text-[#F8F3EB] text-xs font-semibold cursor-pointer"
                >
                  Send Another Note
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-[#201C1C]">
                  Send a Message
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#201C1C] mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Maya Sen"
                      className="w-full text-xs p-3 rounded-xl border border-[#A99B91]/40 bg-white text-[#201C1C] focus:border-[#75192F] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#201C1C] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="maya@example.com"
                      className="w-full text-xs p-3 rounded-xl border border-[#A99B91]/40 bg-white text-[#201C1C] focus:border-[#75192F] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#201C1C] mb-1">
                    Subject / Topic
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-[#A99B91]/40 bg-white text-[#201C1C] focus:border-[#75192F] outline-none cursor-pointer"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Consign Vintage Clothes">Sell / Consign Vintage Clothes</option>
                    <option value="Wholesale Partnership">Wholesale Supplier Partnership</option>
                    <option value="Investor / Pitch Feedback">Investor / Pitch Feedback</option>
                    <option value="Order Assistance">Order Assistance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#201C1C] mb-1">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what's on your mind..."
                    className="w-full text-xs p-3 rounded-xl border border-[#A99B91]/40 bg-white text-[#201C1C] focus:border-[#75192F] outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#75192F] hover:bg-[#5a1122] text-[#F8F3EB] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to Team</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
