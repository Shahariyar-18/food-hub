import React, { useState, useEffect, useMemo } from 'react';
import { 
  MenuItem, 
  CartItem, 
  UserProfile, 
  Order, 
  OrderStage 
} from './types';
import { SAMPLE_MENU, DEMO_USERS } from './data/menuData';
import { Navbar } from './components/Navbar';
import { MenuFilterBar, FilterState } from './components/MenuFilterBar';
import { MenuItemCard } from './components/MenuItemCard';
import { CustomizerModal } from './components/CustomizerModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderTracker } from './components/OrderTracker';
import { LoginModal } from './components/LoginModal';
import { 
  ShoppingBag, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Flame, 
  ArrowRight, 
  ChevronRight,
  UtensilsCrossed,
  Heart
} from 'lucide-react';

export default function App() {
  // Layer Navigation: 'menu' (Layer 1) | 'cart' (Layer 2) | 'tracker' (Layer 3)
  const [currentLayer, setCurrentLayer] = useState<'menu' | 'cart' | 'tracker'>('menu');

  // Authentication: Passwordless ID-only user
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('foodhub_user');
      return saved ? JSON.parse(saved) : DEMO_USERS[0];
    } catch {
      return DEMO_USERS[0];
    }
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('foodhub_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Active Order for Layer 3 Real-Time Tracker
  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    try {
      const saved = localStorage.getItem('foodhub_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Selected City
  const [selectedCity, setSelectedCity] = useState<string>('Bengaluru');

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('foodhub_favs');
      return saved ? JSON.parse(saved) : ['dish-1', 'dish-3'];
    } catch {
      return ['dish-1', 'dish-3'];
    }
  });

  // Customizer Modal state
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);

  // Filter state for Layer 1
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedCuisine: 'All',
    diet: 'all',
    spiceLevel: 'all',
    minRating: 0,
    priceRange: 'all',
    sortBy: 'recommended',
    offersOnly: false,
  });

  // Persist user
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('foodhub_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('foodhub_user');
      }
    } catch {}
  }, [currentUser]);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('foodhub_cart', JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  // Persist order
  useEffect(() => {
    try {
      if (activeOrder) {
        localStorage.setItem('foodhub_order', JSON.stringify(activeOrder));
      } else {
        localStorage.removeItem('foodhub_order');
      }
    } catch {}
  }, [activeOrder]);

  // Persist favorites
  useEffect(() => {
    try {
      localStorage.setItem('foodhub_favs', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  const toggleFavorite = (itemId: string) => {
    setFavorites((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  // Cart helper functions
  const handleAddToCartDirect = (item: MenuItem) => {
    const cartItemId = `${item.id}-base`;
    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.cartItemId === cartItemId);
      if (existing) {
        return prev.map((ci) =>
          ci.cartItemId === cartItemId ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          menuItem: item,
          quantity: 1,
          selectedAddons: [],
          itemTotalPrice: item.price,
        },
      ];
    });
  };

  const handleSaveCustomizedToCart = (newItem: CartItem) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((ci) => ci.cartItemId === newItem.cartItemId);
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += newItem.quantity;
        return copy;
      }
      return [...prev, newItem];
    });
  };

  const handleUpdateItemQuantity = (item: MenuItem, delta: number) => {
    setCartItems((prev) => {
      // Find first matching item for this menu item
      const index = prev.findIndex((ci) => ci.menuItem.id === item.id);
      if (index === -1) return prev;
      const target = prev[index];
      const newQty = target.quantity + delta;

      if (newQty <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      const copy = [...prev];
      copy[index] = { ...target, quantity: newQty };
      return copy;
    });
  };

  const handleUpdateCartQuantityById = (cartItemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((ci) => {
          if (ci.cartItemId === cartItemId) {
            const nextQty = ci.quantity + delta;
            return nextQty > 0 ? { ...ci, quantity: nextQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((ci) => ci.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Placing order switches to Layer 3: Real-Time Tracker!
  const handlePlaceOrder = (order: Order) => {
    setActiveOrder(order);
    setCartItems([]); // clear cart
    setCurrentLayer('tracker'); // advance to Layer 3
  };

  // Compute total cart count & price
  const cartItemCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);
  const cartTotal = cartItems.reduce((acc, it) => acc + it.itemTotalPrice * it.quantity, 0);

  // Filtered & Sorted Menu Items
  const filteredMenuItems = useMemo(() => {
    return SAMPLE_MENU.filter((dish) => {
      // Search query
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = dish.name.toLowerCase().includes(q);
        const matchesDesc = dish.description.toLowerCase().includes(q);
        const matchesIng = dish.ingredients?.some((ing) => ing.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesIng) return false;
      }

      // Cuisine category
      if (filters.selectedCuisine !== 'All' && dish.category !== filters.selectedCuisine) {
        return false;
      }

      // Diet
      if (filters.diet !== 'all' && dish.diet !== filters.diet) {
        return false;
      }

      // Spice level
      if (filters.spiceLevel !== 'all' && dish.spiceLevel !== filters.spiceLevel) {
        return false;
      }

      // Rating
      if (filters.minRating > 0 && dish.rating < filters.minRating) {
        return false;
      }

      // Price range
      if (filters.priceRange === 'under-200' && dish.price >= 200) return false;
      if (filters.priceRange === '200-350' && (dish.price < 200 || dish.price > 350)) return false;
      if (filters.priceRange === 'above-350' && dish.price <= 350) return false;

      // Offers
      if (filters.offersOnly && !dish.originalPrice) return false;

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'delivery-time') {
        const timeA = parseInt(a.prepTime) || 20;
        const timeB = parseInt(b.prepTime) || 20;
        return timeA - timeB;
      }
      // 'recommended'
      return (b.isBestseller ? 2 : 0) - (a.isBestseller ? 2 : 0);
    });
  }, [filters]);

  return (
    <div className="min-h-screen bg-[#fafaf9] text-stone-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Universal Navigation Header */}
      <Navbar
        currentLayer={currentLayer}
        onSelectLayer={(layer) => setCurrentLayer(layer)}
        cartItemCount={cartItemCount}
        cartTotal={cartTotal}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        activeOrderExists={!!activeOrder}
        selectedCity={selectedCity}
        onCityChange={(c) => setSelectedCity(c)}
      />

      {/* Main Content Area: 3 Interactive Layers */}
      <main className="flex-1">
        {/* ============================================================ */}
        {/* INTERACTIVE LAYER 1: Discovery, Menus & Custom Filters        */}
        {/* ============================================================ */}
        {currentLayer === 'menu' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* Promotional & Feature Highlight Banner */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-stone-900 via-orange-950 to-stone-900 text-white p-6 sm:p-8 shadow-md border border-stone-800">
              <div className="relative z-10 max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                  <span>50% OFF up to ₹120 with code: FOODHUB50</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-['Outfit',sans-serif] tracking-tight leading-tight">
                  Taste the Royal Spices of India.
                </h1>
                <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-xl">
                  Handcrafted dum biryanis, slow-simmered rich curries, buttery tandoori breads, and crisp street chaats delivered steaming hot in under 30 minutes.
                </p>

                {/* Quick Trust badges */}
                <div className="flex flex-wrap items-center gap-4 pt-2 text-[11px] text-stone-300 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-orange-400" />
                    <span>Average 25 mins delivery</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>FSSAI Certified Kitchens</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>Clay Tandoor Cooked</span>
                  </div>
                </div>
              </div>

              {/* Decorative culinary glow pattern */}
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-orange-600/20 to-transparent pointer-events-none" />
            </div>

            {/* Custom Filter Bar (Diet, Cuisines, Spice, Rating, Price, Sort, Search) */}
            <MenuFilterBar
              filters={filters}
              onChange={setFilters}
              totalResults={filteredMenuItems.length}
            />

            {/* Dishes Grid */}
            {filteredMenuItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
                {filteredMenuItems.map((item) => {
                  const inCartCount = cartItems
                    .filter((ci) => ci.menuItem.id === item.id)
                    .reduce((acc, curr) => acc + curr.quantity, 0);

                  return (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      onAddToCart={handleAddToCartDirect}
                      onOpenCustomizer={(dish) => setCustomizingItem(dish)}
                      cartQuantity={inCartCount}
                      onUpdateQuantity={handleUpdateItemQuantity}
                      isFavorite={favorites.includes(item.id)}
                      onToggleFavorite={toggleFavorite}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center space-y-3 bg-white rounded-2xl border border-stone-200">
                <UtensilsCrossed className="w-10 h-10 text-stone-400 mx-auto" />
                <h3 className="text-lg font-bold font-['Outfit',sans-serif] text-stone-900">
                  No dishes matched your filters
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Try adjusting the spice level, resetting the diet selector, or clearing your search term.
                </p>
                <button
                  onClick={() =>
                    setFilters({
                      searchQuery: '',
                      selectedCuisine: 'All',
                      diet: 'all',
                      spiceLevel: 'all',
                      minRating: 0,
                      priceRange: 'all',
                      sortBy: 'recommended',
                      offersOnly: false,
                    })
                  }
                  className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* INTERACTIVE LAYER 2: User-Friendly Cart & Checkout Screen    */}
        {/* ============================================================ */}
        {currentLayer === 'cart' && (
          <CartDrawer
            items={cartItems}
            currentUser={currentUser}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onUpdateQuantity={handleUpdateCartQuantityById}
            onRemoveItem={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onPlaceOrder={handlePlaceOrder}
            onBrowseMenu={() => setCurrentLayer('menu')}
          />
        )}

        {/* ============================================================ */}
        {/* INTERACTIVE LAYER 3: Real-Time Order Delivery Tracker        */}
        {/* ============================================================ */}
        {currentLayer === 'tracker' && (
          <OrderTracker
            order={activeOrder}
            onBackToMenu={() => setCurrentLayer('menu')}
          />
        )}
      </main>

      {/* Floating Sticky Bottom Cart Strip (Visible on mobile/desktop when items exist & on Layer 1) */}
      {cartItemCount > 0 && currentLayer === 'menu' && (
        <aside 
          aria-label="Current order summary"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-8 z-30 sm:w-96 animate-in slide-in-from-bottom-4"
        >
          <div className="bg-stone-900 text-white p-3.5 rounded-2xl shadow-xl border border-stone-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center font-bold text-sm shadow-xs">
                {cartItemCount}
              </div>
              <div>
                <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-semibold">
                  {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} in Cart
                </span>
                <span className="text-base font-black font-['Outfit',sans-serif]">
                  ₹{cartTotal}
                </span>
              </div>
            </div>

            <button
              id="sticky-checkout-btn"
              onClick={() => setCurrentLayer('cart')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md transition-all group"
            >
              <span>View Cart</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </aside>
      )}

      {/* Modal: Item Customization (Portions, Add-ons, Spice, Notes) */}
      <CustomizerModal
        item={customizingItem}
        isOpen={!!customizingItem}
        onClose={() => setCustomizingItem(null)}
        onSaveToCart={handleSaveCustomizedToCart}
      />

      {/* Modal: Passwordless ID-Only Login */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={currentUser}
        onLogin={(user) => setCurrentUser(user)}
        onLogout={() => setCurrentUser(null)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 mt-16 py-8 px-4 sm:px-6 lg:px-8 text-stone-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-orange-600 flex items-center justify-center text-white text-xs font-black">
              F
            </div>
            <span className="font-bold font-['Outfit',sans-serif] text-stone-800 text-sm">
              FOOD HUB
            </span>
            <span className="text-stone-300">•</span>
            <span>Handcrafted with authentic Indian culinary passion</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>All prices in INR (₹)</span>
            <span>•</span>
            <span>100% Contactless Delivery</span>
            <span>•</span>
            <span>FSSAI Lic. No: 11220334001920</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
