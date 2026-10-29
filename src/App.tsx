import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  auth,
  testConnection,
  signInWithGoogle,
  logOut,
  addToWishlistInFirestore,
  removeFromWishlistInFirestore,
  fetchUserWishlistIds,
} from './firebase';
import { PRODUCTS } from './data/products';
import { Product, CartItem } from './types';
import { calculateCartTotals } from './utils/calculations';

// Modular Components
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeaturedCollection } from './components/FeaturedCollection';
import { ShopCollection } from './components/ShopCollection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { DemoCheckoutModal } from './components/DemoCheckoutModal';
import { OurStory } from './components/OurStory';
import { OurTeam } from './components/OurTeam';
import { BusinessPlan } from './components/BusinessPlan';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { UserOrdersModal } from './components/UserOrdersModal';
import { ThreeGarmentShowcase } from './components/ThreeGarmentShowcase';

// Dedicated Full-Page Sections
import { WishlistPage } from './pages/WishlistPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { PaymentCheckoutPage } from './pages/PaymentCheckoutPage';

import { Sparkles, Check, Heart, X, Search } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Cart & Wishlist state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('thrift_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('thrift_wishlist');
      return saved ? JSON.parse(saved) : ['vintage-denim-jacket', 'oversized-hoodie'];
    } catch {
      return ['vintage-denim-jacket', 'oversized-hoodie'];
    }
  });

  const [localOrders, setLocalOrders] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('thrift_orders');
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'ORD-THRIFT-91823',
          customerName: 'Aarav Mehta',
          shippingAddress: '42 Heritage Lane, Bandra West, Mumbai - 400050',
          paymentMethod: 'UPI',
          total: 1298,
          status: 'processing',
          createdAt: new Date().toISOString(),
          items: [
            {
              productId: 'vintage-denim-jacket',
              productName: 'Vintage Denim Jacket',
              image:
                'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
              size: 'M',
              price: 699,
              quantity: 1,
            },
            {
              productId: 'retro-sweater',
              productName: 'Retro Sweater',
              image:
                'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
              size: 'L',
              price: 599,
              quantity: 1,
            },
          ],
        },
      ];
    } catch {
      return [];
    }
  });

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [is3DStudioOpen, setIs3DStudioOpen] = useState(false);
  const [active3DTitle, setActive3DTitle] = useState('Vintage Denim Jacket');
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);
  const [quickSearchInput, setQuickSearchInput] = useState('');

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Run test connection on boot
  useEffect(() => {
    testConnection();
  }, []);

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        showToast(`Welcome back, ${user.displayName || user.email}!`);
        // Sync wishlist from Firestore
        try {
          const remoteWishlist = await fetchUserWishlistIds(user.uid);
          if (remoteWishlist && remoteWishlist.length > 0) {
            setWishlistIds((prev) => Array.from(new Set([...prev, ...remoteWishlist])));
          }
        } catch (err) {
          console.warn('Wishlist sync notice:', err);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('thrift_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn(e);
    }
  }, [cartItems]);

  // Save wishlist to local storage
  useEffect(() => {
    try {
      localStorage.setItem('thrift_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      console.warn(e);
    }
  }, [wishlistIds]);

  // Save orders to local storage
  useEffect(() => {
    try {
      localStorage.setItem('thrift_orders', JSON.stringify(localOrders));
    } catch (e) {
      console.warn(e);
    }
  }, [localOrders]);

  // Cart actions
  const handleAddToCart = (product: Product, size: string, quantity: number = 1) => {
    const itemKey = `${product.id}-${size}`;
    setCartItems((prev) => {
      const existing = prev.find((it) => it.id === itemKey);
      if (existing) {
        return prev.map((it) =>
          it.id === itemKey ? { ...it, quantity: it.quantity + quantity } : it
        );
      }
      return [
        ...prev,
        {
          id: itemKey,
          productId: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          size,
          quantity,
        },
      ];
    });
    showToast(`Added "${product.title}" (${size}) to your bag`);
    if (selectedProduct) setSelectedProduct(null);
  };

  const handleBuyNow = (product: Product, size: string, quantity: number = 1) => {
    handleAddToCart(product, size, quantity);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((it) => (it.id === id ? { ...it, quantity: it.quantity + delta } : it))
        .filter((it) => it.quantity > 0)
    );
  };

  const handleRemoveItem = (id: string) => {
    const item = cartItems.find((it) => it.id === id);
    setCartItems((prev) => prev.filter((it) => it.id !== id));
    if (item) showToast(`Removed "${item.title}" from bag`);
  };

  // Wishlist actions
  const handleToggleWishlist = async (product: Product) => {
    const isSaved = wishlistIds.includes(product.id);
    if (isSaved) {
      setWishlistIds((prev) => prev.filter((id) => id !== product.id));
      showToast(`Removed "${product.title}" from wishlist`);
      if (currentUser) {
        try {
          await removeFromWishlistInFirestore(currentUser.uid, product.id);
        } catch (e) {
          console.warn(e);
        }
      }
    } else {
      setWishlistIds((prev) => [...prev, product.id]);
      showToast(`Saved "${product.title}" to wishlist ❤️`);
      if (currentUser) {
        try {
          await addToWishlistInFirestore(currentUser.uid, {
            id: product.id,
            title: product.title,
            price: product.price,
          });
        } catch (e) {
          console.warn(e);
        }
      }
    }
  };

  // Auth actions
  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      showToast(err.message || 'Could not sign in with Google');
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      showToast('Signed out of Thrift & Style');
    } catch (err: any) {
      console.warn(err);
    }
  };

  // 3D Studio triggers
  const handleOpen3DStudio = (product?: Product) => {
    if (product) {
      setActive3DTitle(product.title);
    } else {
      setActive3DTitle('Vintage Denim Jacket');
    }
    setIs3DStudioOpen(true);
  };

  // Cart calculations
  const cartTotals = calculateCartTotals(cartItems);

  // Wishlist products
  const wishlistProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F3EB] text-[#201C1C]">
      {/* Toast Notification (Slide 11: Notification Toast) */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#201C1C] text-[#F8F3EB] px-4 py-3 rounded-2xl shadow-2xl border border-[#A99B91]/30 flex items-center gap-3 text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-bottom duration-300">
          <div className="p-1 rounded-full bg-[#75192F] text-[#F8F3EB]">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-[#A99B91] hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <Header
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={cartTotals.itemCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => {
          setCurrentView('wishlist');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSearch={() => setQuickSearchOpen(true)}
        currentUser={currentUser}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onOpenOrders={() => {
          setCurrentView('orders');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpen3DStudio={() => handleOpen3DStudio()}
      />

      {/* Main Dynamic View Content */}
      <main className="flex-grow">
        {currentView === 'home' && (
          <>
            {/* Hero Section */}
            <Hero
              onShopClick={() => {
                setCurrentView('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onMissionClick={() => {
                setCurrentView('story');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onLaunch3D={() => handleOpen3DStudio()}
            />

            {/* Optional 3D Showcase Block on Home */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="bg-[#EDE5D8]/40 p-4 sm:p-6 rounded-3xl border border-[#A99B91]/25 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#75192F] font-bold">
                      Interactive Inspection
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-[#201C1C]">
                      3D Thrift Inspection Studio
                    </h2>
                    <p className="text-xs text-[#201C1C]/70">
                      Rotate 360°, inspect procedural denim twill weave, switch wash patinas, and test camera angles.
                    </p>
                  </div>
                </div>

                <ThreeGarmentShowcase initialGarmentTitle={active3DTitle} />
              </div>
            </section>

            {/* Featured Collection (4 pieces) */}
            <FeaturedCollection
              products={PRODUCTS}
              onViewAll={() => {
                setCurrentView('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onToggleWishlist={handleToggleWishlist}
              wishlistIds={wishlistIds}
              onOpen3DForProduct={(p) => handleOpen3DStudio(p)}
            />

            {/* Brief Mission teaser */}
            <OurStory
              onShopClick={() => {
                setCurrentView('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Team teaser */}
            <OurTeam />

            {/* Financials & Pitch Section */}
            <BusinessPlan />
          </>
        )}

        {currentView === 'shop' && (
          <ShopCollection
            products={PRODUCTS}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
            onOpen3DForProduct={(p) => handleOpen3DStudio(p)}
          />
        )}

        {currentView === 'wishlist' && (
          <WishlistPage
            wishlistProducts={wishlistProducts}
            onRemoveFromWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onNavigateToShop={() => {
              setCurrentView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpen3DForProduct={(p) => handleOpen3DStudio(p)}
          />
        )}

        {currentView === 'orders' && (
          <OrdersPage
            orders={localOrders}
            currentUser={currentUser}
            onTrackOrder={(orderId) => {
              setCurrentView('tracking');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onNavigateToShop={() => {
              setCurrentView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'tracking' && (
          <OrderTrackingPage
            orders={localOrders}
            currentUser={currentUser}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onNavigateToShop={() => {
              setCurrentView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'checkout' && (
          <PaymentCheckoutPage
            items={cartItems}
            currentUser={currentUser}
            onOrderSuccess={(orderId) => {
              const newOrder = {
                id: orderId,
                customerName: currentUser?.displayName || 'Thrift Shopper',
                shippingAddress: 'Verified Courier Delivery Address',
                paymentMethod: 'UPI / Card Online',
                total: cartTotals.total,
                status: 'Processing',
                createdAt: new Date().toISOString(),
                items: cartItems.map((c) => ({
                  productId: c.productId,
                  productName: c.title,
                  image: c.image,
                  size: c.size,
                  price: c.price,
                  quantity: c.quantity,
                })),
              };
              setLocalOrders((prev) => [newOrder, ...prev]);
              setCartItems([]);
              showToast(`Order #${orderId} placed successfully!`);
            }}
            onNavigateToShop={() => {
              setCurrentView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onTrackOrder={(orderId) => {
              setCurrentView('tracking');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'story' && (
          <OurStory
            onShopClick={() => {
              setCurrentView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'team' && <OurTeam />}

        {currentView === 'business' && <BusinessPlan />}

        {currentView === 'contact' && <ContactSection />}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenOrders={() => {
          setCurrentView('orders');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        onOpen3D={(p) => {
          setSelectedProduct(null);
          handleOpen3DStudio(p);
        }}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setCurrentView('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onContinueShopping={() => {
          setIsCartOpen(false);
          setCurrentView('shop');
        }}
      />

      {/* Demo Checkout Modal */}
      <DemoCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        subtotal={cartTotals.subtotal}
        shippingFee={cartTotals.shippingFee}
        discountAmount={cartTotals.discountAmount}
        total={cartTotals.total}
        currentUser={currentUser}
        onOrderSuccess={(orderId) => {
          // Save order into local orders list
          const newOrder = {
            id: orderId,
            customerName: currentUser?.displayName || 'Thrift Shopper',
            shippingAddress: 'Standard Delivery Address',
            paymentMethod: 'UPI',
            total: cartTotals.total,
            createdAt: new Date().toISOString(),
            items: cartItems.map((c) => ({
              productId: c.productId,
              productName: c.title,
              image: c.image,
              size: c.size,
              price: c.price,
              quantity: c.quantity,
            })),
          };
          setLocalOrders((prev) => [newOrder, ...prev]);
          // Clear cart
          setCartItems([]);
          showToast(`Order ${orderId} placed successfully!`);
        }}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* User Orders Modal */}
      <UserOrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        currentUser={currentUser}
        localOrders={localOrders}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Dedicated 3D Studio Modal if launched from Nav */}
      {is3DStudioOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
          <div className="relative w-full max-w-5xl bg-[#FDFBF7] rounded-3xl overflow-hidden shadow-2xl border border-[#A99B91]/30">
            <ThreeGarmentShowcase
              initialGarmentTitle={active3DTitle}
              onClose={() => setIs3DStudioOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Quick Search Modal */}
      {quickSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="bg-[#FDFBF7] w-full max-w-xl rounded-2xl p-6 shadow-2xl border border-[#A99B91]/30 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase font-bold tracking-wider text-[#75192F]">
                Quick Catalog Search
              </span>
              <button
                onClick={() => setQuickSearchOpen(false)}
                className="p-1 rounded-full hover:bg-[#EDE5D8] cursor-pointer"
              >
                <X className="w-5 h-5 text-[#201C1C]" />
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                autoFocus
                value={quickSearchInput}
                onChange={(e) => setQuickSearchInput(e.target.value)}
                placeholder="Type to search jackets, sweaters, flannel, jeans..."
                className="w-full text-sm pl-11 pr-4 py-3 rounded-xl border border-[#A99B91]/40 bg-white outline-none focus:border-[#75192F]"
              />
              <Search className="w-5 h-5 text-[#A99B91] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {quickSearchInput && (
              <div className="max-h-60 overflow-y-auto divide-y divide-[#A99B91]/20">
                {PRODUCTS.filter(
                  (p) =>
                    p.title.toLowerCase().includes(quickSearchInput.toLowerCase()) ||
                    p.category.toLowerCase().includes(quickSearchInput.toLowerCase())
                ).slice(0, 5).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedProduct(p);
                      setQuickSearchOpen(false);
                    }}
                    className="py-2.5 flex items-center justify-between hover:bg-[#EDE5D8]/50 px-2 rounded-lg cursor-pointer transition"
                  >
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.title} className="w-10 h-10 object-cover rounded-md" />
                      <div>
                        <p className="font-serif font-bold text-xs text-[#201C1C]">{p.title}</p>
                        <p className="text-[10px] text-[#A99B91]">{p.category} • {p.conditionBadge}</p>
                      </div>
                    </div>
                    <span className="font-bold text-xs text-[#75192F]">₹{p.price}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 flex justify-between items-center text-xs text-[#A99B91]">
              <span>Press ESC to close</span>
              <button
                onClick={() => {
                  setQuickSearchOpen(false);
                  setCurrentView('shop');
                }}
                className="text-[#75192F] font-semibold hover:underline cursor-pointer"
              >
                Go to full Shop Collection →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
