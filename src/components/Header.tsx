import React, { useState } from 'react';
import { ShoppingBag, Heart, Search, User as UserIcon, Menu, X, LogOut, Package, Sparkles } from 'lucide-react';
import { User } from 'firebase/auth';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  currentUser: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onOpenOrders: () => void;
  onOpen3DStudio: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  currentUser,
  onSignIn,
  onSignOut,
  onOpenOrders,
  onOpen3DStudio,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'wishlist', label: 'Wishlist' },
    { id: 'orders', label: 'My Orders' },
    { id: 'tracking', label: 'Track Order' },
    { id: 'story', label: 'About' },
    { id: 'team', label: 'Team' },
    { id: 'business', label: 'Business Plan' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F8F3EB]/95 backdrop-blur-md border-b border-[#A99B91]/30 transition-all">
      {/* Top Banner */}
      <div className="bg-[#75192F] text-[#F8F3EB] text-center text-xs py-1.5 px-4 font-medium tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#D4A72C]" />
        <span>Pre-Loved. Re-Styled. Re-Worn. — Free courier shipping on orders over ₹999</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Wordmark & Emblem Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={() => handleLinkClick('home')}
              className="flex items-center gap-3 text-left group cursor-pointer"
            >
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-[#75192F]/20 group-hover:border-[#75192F] shadow-sm transition">
                <img
                  src="/thrift_style_logo.jpg"
                  alt="Thrift & Style Logo"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#201C1C] group-hover:text-[#75192F] transition leading-none block">
                  THRIFT &amp; STYLE
                </span>
                <span className="block text-[10px] uppercase tracking-[0.25em] text-[#75192F] font-semibold mt-0.5">
                  Pre-Loved • Re-Styled • Re-Worn
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`text-sm font-medium transition cursor-pointer relative py-1 ${
                  currentView === link.id
                    ? 'text-[#75192F] font-semibold'
                    : 'text-[#201C1C]/80 hover:text-[#75192F]'
                }`}
              >
                {link.label}
                {currentView === link.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#75192F] rounded-full" />
                )}
              </button>
            ))}

            {/* 3D Studio Nav Pill */}
            <button
              onClick={onOpen3DStudio}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#75192F]/10 text-[#75192F] border border-[#75192F]/30 hover:bg-[#75192F] hover:text-[#F8F3EB] transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4A72C]" />
              <span>3D Studio</span>
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Search Button */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-[#201C1C] hover:text-[#75192F] rounded-full hover:bg-[#A99B91]/15 transition cursor-pointer"
              aria-label="Search Thrift Collection"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => onNavigate('wishlist')}
              className={`p-2 rounded-full hover:bg-[#A99B91]/15 transition relative cursor-pointer ${
                currentView === 'wishlist' ? 'text-[#75192F] bg-[#75192F]/10' : 'text-[#201C1C] hover:text-[#75192F]'
              }`}
              aria-label="Wishlist Page"
              title="View Wishlist Page"
            >
              <Heart className={`w-5 h-5 ${currentView === 'wishlist' ? 'fill-current' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#75192F] text-[#F8F3EB] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Track Orders Button */}
            <button
              onClick={() => onNavigate('tracking')}
              className={`p-2 rounded-full hover:bg-[#A99B91]/15 transition relative cursor-pointer ${
                currentView === 'tracking' ? 'text-[#75192F] bg-[#75192F]/10' : 'text-[#201C1C] hover:text-[#75192F]'
              }`}
              aria-label="Track Orders"
              title="Track Orders Page"
            >
              <Package className="w-5 h-5" />
            </button>

            {/* Cart Bag Button */}
            <button
              onClick={onOpenCart}
              className={`p-2 rounded-full hover:bg-[#A99B91]/15 transition relative cursor-pointer ${
                currentView === 'checkout' ? 'text-[#75192F] bg-[#75192F]/10' : 'text-[#201C1C] hover:text-[#75192F]'
              }`}
              aria-label="Shopping Cart Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#75192F] text-[#F8F3EB] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account / Auth Dropdown */}
            <div className="relative">
              {currentUser ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-full border border-[#A99B91]/40 hover:border-[#75192F] transition cursor-pointer"
                    aria-label="User Account Menu"
                  >
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt={currentUser.displayName || 'User Profile'}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#75192F] text-[#F8F3EB] text-xs flex items-center justify-center font-bold">
                        {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                      </div>
                    )}
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-[#FDFBF7] rounded-xl shadow-xl border border-[#A99B91]/30 py-2 z-50">
                      <div className="px-4 py-2 border-b border-[#A99B91]/20">
                        <p className="text-xs text-[#A99B91]">Signed in as</p>
                        <p className="text-sm font-semibold text-[#201C1C] truncate">
                          {currentUser.displayName || currentUser.email}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          onNavigate('orders');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-[#201C1C] hover:bg-[#A99B91]/15 flex items-center gap-2 cursor-pointer"
                      >
                        <Package className="w-4 h-4 text-[#75192F]" />
                        <span>My Orders Page</span>
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('tracking');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-[#201C1C] hover:bg-[#A99B91]/15 flex items-center gap-2 cursor-pointer"
                      >
                        <Truck className="w-4 h-4 text-[#75192F]" />
                        <span>Live Tracking Page</span>
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('wishlist');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-[#201C1C] hover:bg-[#A99B91]/15 flex items-center gap-2 cursor-pointer"
                      >
                        <Heart className="w-4 h-4 text-[#75192F]" />
                        <span>Saved Wishlist ({wishlistCount})</span>
                      </button>
                      <button
                        onClick={() => {
                          onSignOut();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center gap-2 border-t border-[#A99B91]/20 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onSignIn}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#201C1C] text-[#F8F3EB] hover:bg-[#75192F] transition cursor-pointer shadow-sm"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#201C1C] hover:text-[#75192F] cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FDFBF7] border-b border-[#A99B91]/30 px-4 pt-3 pb-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#A99B91]/20">
            <img
              src="/thrift_style_logo.jpg"
              alt="Thrift & Style Logo"
              className="w-8 h-8 rounded-full object-cover border border-[#75192F]/30"
            />
            <div>
              <span className="font-serif font-bold text-sm text-[#201C1C] block leading-tight">
                THRIFT &amp; STYLE
              </span>
              <span className="text-[9px] uppercase tracking-wider text-[#75192F] font-semibold">
                Student Curated Vintage
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                  currentView === link.id
                    ? 'bg-[#75192F] text-[#F8F3EB]'
                    : 'text-[#201C1C] hover:bg-[#A99B91]/20'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-[#A99B91]/20 flex items-center justify-between">
            <button
              onClick={() => {
                onOpen3DStudio();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-[#75192F] bg-[#75192F]/10 rounded-lg w-full justify-center"
            >
              <Sparkles className="w-4 h-4 text-[#D4A72C]" />
              <span>Launch 3D Studio Inspection</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
