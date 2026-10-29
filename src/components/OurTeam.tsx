import React, { useState } from 'react';
import { TEAM_MEMBERS } from '../data/team';
import { TeamMember } from '../types';
import { 
  Users, 
  Award, 
  GraduationCap, 
  Sparkles, 
  Heart, 
  ShieldCheck, 
  ChevronRight, 
  X, 
  Compass, 
  Coins, 
  Share2, 
  Tag, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export const OurTeam: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [activeMemberModal, setActiveMemberModal] = useState<TeamMember | null>(null);

  const departments = [
    { id: 'all', label: 'All 5 Founders' },
    { id: 'Leadership', label: 'Leadership' },
    { id: 'Operations', label: 'Supply & Ops' },
    { id: 'Marketing', label: 'Creative & Brand' },
    { id: 'Finance', label: 'Finance & CFO' },
    { id: 'Experience', label: 'Quality & Experience' },
  ];

  const filteredMembers = selectedDept === 'all'
    ? TEAM_MEMBERS
    : TEAM_MEMBERS.filter(m => m.department === selectedDept);

  return (
    <section id="our-team" className="bg-[#F8F3EB] py-16 sm:py-24 border-t border-[#A99B91]/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header with Brand Logo Seal & Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#75192F]/10 border border-[#75192F]/20 text-[#75192F] text-xs font-semibold uppercase tracking-wider">
            <img 
              src="/thrift_style_logo.jpg" 
              alt="Thrift & Style Seal" 
              className="w-4 h-4 rounded-full object-cover border border-[#75192F]/30"
            />
            <span>The Student Collective • Est. 2025</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#201C1C] tracking-tight">
            Meet Our Founders
          </h2>

          <p className="font-serif italic text-xl sm:text-2xl text-[#75192F]">
            Different skills. One sustainable vision.
          </p>

          <p className="text-sm sm:text-base text-[#201C1C]/80 leading-relaxed max-w-2xl mx-auto">
            We are five university students from Delhi united by a shared obsession: proving that authentic vintage and curated streetwear shouldn’t carry retail markups or environmental guilt.
          </p>
        </div>

        {/* Collective Key Highlights / Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#FDFBF7] border border-[#A99B91]/30 shadow-sm">
          <div className="p-3 text-center border-r last:border-r-0 border-[#A99B91]/20">
            <span className="block font-serif text-2xl sm:text-3xl font-bold text-[#75192F]">5</span>
            <span className="text-[11px] sm:text-xs text-[#201C1C]/75 font-medium uppercase tracking-wider">
              Student Co-Founders
            </span>
          </div>
          <div className="p-3 text-center border-r last:border-r-0 border-[#A99B91]/20">
            <span className="block font-serif text-2xl sm:text-3xl font-bold text-[#201C1C]">100%</span>
            <span className="text-[11px] sm:text-xs text-[#201C1C]/75 font-medium uppercase tracking-wider">
              Student-Curated Drops
            </span>
          </div>
          <div className="p-3 text-center border-r last:border-r-0 border-[#A99B91]/20">
            <span className="block font-serif text-2xl sm:text-3xl font-bold text-[#D4A72C]">₹20K</span>
            <span className="text-[11px] sm:text-xs text-[#201C1C]/75 font-medium uppercase tracking-wider">
              Bootstrapped Capital
            </span>
          </div>
          <div className="p-3 text-center">
            <span className="block font-serif text-2xl sm:text-3xl font-bold text-[#75192F]">0%</span>
            <span className="text-[11px] sm:text-xs text-[#201C1C]/75 font-medium uppercase tracking-wider">
              Undisclosed Flaws
            </span>
          </div>
        </div>

        {/* Department Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 pb-2">
          {departments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => setSelectedDept(dept.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer ${
                selectedDept === dept.id
                  ? 'bg-[#75192F] text-[#F8F3EB] shadow-md shadow-[#75192F]/20'
                  : 'bg-[#FDFBF7] text-[#201C1C]/80 hover:bg-[#A99B91]/20 border border-[#A99B91]/30'
              }`}
            >
              {dept.label}
            </button>
          ))}
        </div>

        {/* 5 Profile Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {filteredMembers.map((member) => {
            const isPratibha = member.id === 'pratibha';

            return (
              <div
                key={member.id}
                className={`group bg-[#FDFBF7] rounded-2xl overflow-hidden border transition duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between ${
                  isPratibha 
                    ? 'border-[#D4A72C]/70 ring-1 ring-[#D4A72C]/40 hover:border-[#75192F]' 
                    : 'border-[#A99B91]/30 hover:border-[#75192F]'
                }`}
              >
                {/* Member Portrait with Badges */}
                <div className="relative aspect-[4/5] overflow-hidden bg-[#EDE5D8]">
                  <img
                    src={member.image}
                    alt={`${member.name} - ${member.role}`}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />

                  {/* Gradient shadow for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/60 text-[#F8F3EB] backdrop-blur-sm border border-white/10 truncate max-w-[130px]">
                      {member.college.includes('SRCC') ? 'SRCC DU' : member.college.split('—')[0].replace('College, DU', 'DU').replace('University', 'Univ.').trim()}
                    </span>

                    {isPratibha ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4A72C] text-[#201C1C] shadow-sm flex-shrink-0">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>CFO &amp; Co-Founder</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/20 text-[#F8F3EB] backdrop-blur-sm flex-shrink-0">
                        Co-Founder
                      </span>
                    )}
                  </div>

                  {/* Bottom Portrait Info */}
                  <div className="absolute bottom-3 left-3 right-3 text-[#F8F3EB]">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#D4A72C] block truncate">
                      {member.subtitle}
                    </span>
                    <h3 className="font-serif font-bold text-xl leading-snug">
                      {member.name}
                    </h3>
                  </div>
                </div>

                {/* Member Details */}
                <div className="p-4 flex flex-col flex-grow justify-between space-y-4">
                  <div className="space-y-3">
                    {/* Role Pill & Grad Year */}
                    <div className="space-y-1">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#75192F] text-[#F8F3EB] leading-tight">
                        {member.role}
                      </span>
                      <div className="text-[10px] text-[#A99B91] font-semibold tracking-wide">
                        {member.gradYear} • Student Founder
                      </div>
                    </div>

                    {/* College & Education */}
                    <div className="flex items-start gap-1.5 text-[11px] text-[#201C1C]/75">
                      <GraduationCap className="w-3.5 h-3.5 text-[#75192F] flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2 leading-tight">{member.college}</span>
                    </div>

                    {/* Responsibility Bio */}
                    <p className="text-xs text-[#201C1C]/80 leading-relaxed line-clamp-3">
                      {member.responsibility}
                    </p>

                    {/* Personal Thrift Pick */}
                    <div className="p-2 rounded-lg bg-[#F8F3EB] border border-[#A99B91]/20">
                      <span className="block text-[9px] uppercase font-bold tracking-wider text-[#75192F]">
                        Personal Thrift Grail:
                      </span>
                      <span className="text-[11px] text-[#201C1C] font-medium leading-snug line-clamp-1">
                        {member.favoriteThrift}
                      </span>
                    </div>

                    {/* Skills Tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {member.skills.slice(0, 2).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded-md bg-[#EDE5D8]/80 text-[#201C1C] text-[10px] font-medium border border-[#A99B91]/20"
                        >
                          {skill}
                        </span>
                      ))}
                      {member.skills.length > 2 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-[#EDE5D8]/50 text-[#201C1C]/60 text-[10px]">
                          +{member.skills.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Action Button */}
                  <div className="pt-3 border-t border-[#A99B91]/20">
                    <button
                      onClick={() => setActiveMemberModal(member)}
                      className="w-full py-2 px-3 rounded-xl bg-[#201C1C] hover:bg-[#75192F] text-[#F8F3EB] text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <span>Read Founder Story</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Collective Philosophy & Backstage Snapshot Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-[#A99B91]/30 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#75192F]/10 text-[#75192F] flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#201C1C]">1. Direct Wholesale Scouring</h3>
            <p className="text-xs text-[#201C1C]/75 leading-relaxed">
              Every Friday through Sunday, Luv &amp; Prateek personally explore Delhi’s wholesale vintage hubs and export stockyards, examining hundreds of garments to select only the top 5% that meet strict durability and vintage appeal standards.
            </p>
          </div>

          <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-[#A99B91]/30 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#75192F]/10 text-[#75192F] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#201C1C]">2. Multi-Point Inspection &amp; Steam</h3>
            <p className="text-xs text-[#201C1C]/75 leading-relaxed">
              Shivansh and the team run every piece through seam, zipper, and pocket integrity tests, followed by eco-friendly hypoallergenic laundry and high-temperature steam sterilization before any garment is measured or photographed.
            </p>
          </div>

          <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-[#A99B91]/30 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#75192F]/10 text-[#75192F] flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#201C1C]">3. Honest Unit Economics</h3>
            <p className="text-xs text-[#201C1C]/75 leading-relaxed">
              Pratibha’s financial framework limits gross markups to student-accessible rates (average selling price ₹650 vs typical ₹1,500+ commercial thrifting), reserving ₹3,000 as buffer capital and delivering transparent sustainability.
            </p>
          </div>
        </div>

        {/* Slide 08 Quote Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#75192F] to-[#541021] text-[#F8F3EB] p-8 sm:p-12 text-center shadow-xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="text-xs uppercase font-bold tracking-widest text-[#D4A72C]">
              Our Collective Motto
            </span>
            <p className="font-serif italic text-2xl sm:text-3xl leading-snug">
              &ldquo;Better style. Brighter future. We wear our values on our sleeves.&rdquo;
            </p>
            <p className="text-xs text-[#F8F3EB]/80 max-w-lg mx-auto">
              Curated in Delhi, worn across India. Made with love by Prateek, Luv, Nav, Pratibha &amp; Shivansh.
            </p>
          </div>
        </div>

      </div>

      {/* Founder Story Detail Modal */}
      {activeMemberModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setActiveMemberModal(null)}
        >
          <div 
            className="bg-[#FDFBF7] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#A99B91]/40 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveMemberModal(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#201C1C]/80 hover:bg-[#75192F] text-[#F8F3EB] transition cursor-pointer"
              aria-label="Close founder profile"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-12">
              {/* Modal Left Image */}
              <div className="sm:col-span-5 relative bg-[#EDE5D8] min-h-[260px] sm:min-h-full">
                <img
                  src={activeMemberModal.image}
                  alt={activeMemberModal.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent flex flex-col justify-end p-6 text-[#F8F3EB]">
                  <span className="text-[11px] font-bold text-[#D4A72C] uppercase tracking-wider block mb-1">
                    {activeMemberModal.role}
                  </span>
                  <h3 className="font-serif text-2xl font-bold leading-tight">
                    {activeMemberModal.name}
                  </h3>
                  <span className="text-xs text-[#F8F3EB]/85 mt-1 block">
                    {activeMemberModal.college}
                  </span>
                </div>
              </div>

              {/* Modal Right Content */}
              <div className="sm:col-span-7 p-6 sm:p-8 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#75192F]/10 text-[#75192F] mb-2">
                    <Award className="w-3.5 h-3.5 text-[#D4A72C]" />
                    <span>{activeMemberModal.subtitle}</span>
                  </div>
                  <h4 className="font-serif text-xl font-bold text-[#201C1C]">
                    Founder Statement
                  </h4>
                </div>

                {/* Bio Quote */}
                <div className="p-4 rounded-2xl bg-[#F8F3EB] border-l-4 border-[#75192F] text-xs text-[#201C1C]/90 italic leading-relaxed">
                  &ldquo;{activeMemberModal.bioQuote}&rdquo;
                </div>

                {/* Full Responsibilities */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#75192F]">
                    Core Startup Mission
                  </span>
                  <p className="text-xs text-[#201C1C]/80 leading-relaxed">
                    {activeMemberModal.responsibility}
                  </p>
                </div>

                {/* Key Startup Achievement */}
                {activeMemberModal.keyAchievement && (
                  <div className="p-3 rounded-xl bg-[#201C1C] text-[#F8F3EB] space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#D4A72C] uppercase tracking-wider">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Key Milestone</span>
                    </div>
                    <p className="text-xs text-[#F8F3EB]/90 leading-snug">
                      {activeMemberModal.keyAchievement}
                    </p>
                  </div>
                )}

                {/* Skills */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#201C1C]">
                    Expertise &amp; Superpowers
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeMemberModal.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#EDE5D8] text-[#201C1C] border border-[#A99B91]/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Favorite Item */}
                <div className="pt-2 text-xs text-[#201C1C]/75 border-t border-[#A99B91]/20">
                  <strong className="text-[#201C1C]">Curated Wishlist Grail:</strong> {activeMemberModal.favoriteThrift}
                </div>

                {/* Dismiss */}
                <div className="pt-2">
                  <button
                    onClick={() => setActiveMemberModal(null)}
                    className="w-full py-2.5 rounded-xl bg-[#75192F] text-[#F8F3EB] font-semibold text-xs hover:bg-[#5a1122] transition cursor-pointer"
                  >
                    Close Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
