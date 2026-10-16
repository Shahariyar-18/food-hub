import React from 'react';
import { UserProfile } from '../types';
import { 
  UtensilsCrossed, 
  MapPin, 
  ShoppingBag, 
  User, 
  Radio, 
  ChevronDown, 
  Flame
} from 'lucide-react';

interface NavbarProps {
  currentLayer: 'menu' | 'cart' | 'tracker';
  onSelectLayer: (layer: 'menu' | 'cart' | 'tracker') => void;
  cartItemCount: number;
  cartTotal: number;
  currentUser: UserProfile | null;
  onOpenLogin: () => void;
  activeOrderExists: boolean;
  selectedCity: string;
  onCityChange: (city: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLayer,
  onSelectLayer,
  cartItemCount,
  cartTotal,
  currentUser,
  onOpenLogin,
  activeOrderExists,
  selectedCity,
  onCityChange,
}) => {
  const cities = ['Bengaluru', 'Hyderabad', 'New Delhi', 'Mumbai', 'Chennai'];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Brand Logo & Location */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              id="brand-logo-btn"
              onClick={() => onSelectLayer('menu')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <Flame className="w-6 h-6 fill-white" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-['Outfit',sans-serif] text-xl sm:text-2xl font-black tracking-tight text-stone-900">
                    FOOD<span className="text-orange-600">HUB</span>
                  </span>
                  <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded">
                    India
                  </span>
                </div>
                <p className="hidden md:block text-[11px] text-stone-600 font-medium -mt-1">
                  Authentic Taste • Delivered Hot
                </p>
              </div>
            </button>

            {/* City / Location Picker */}
            <div className="relative group hidden sm:flex items-center gap-1.5 text-xs text-stone-700 bg-stone-100/80 hover:bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200/60 cursor-pointer">
              <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <select
                id="city-selector"
                value={selectedCity}
                onChange={(e) => onCityChange(e.target.value)}
                className="bg-transparent font-medium focus:outline-none cursor-pointer pr-4 text-stone-800"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-stone-400 absolute right-2 pointer-events-none" />
            </div>
          </div>

          {/* Center 3-Layer Navigation Switcher */}
          <nav className="flex items-center bg-stone-100/90 p-1 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold">
            <button
              id="layer-tab-menu"
              onClick={() => onSelectLayer('menu')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg transition-all ${
                currentLayer === 'menu'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5 text-orange-600" />
              <span>Menu</span>
            </button>

            <button
              id="layer-tab-cart"
              onClick={() => onSelectLayer('cart')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg transition-all ${
                currentLayer === 'cart'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-orange-600" />
              <span>Cart</span>
              {cartItemCount > 0 && (
                <span className="bg-orange-600 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            <button
              id="layer-tab-tracker"
              onClick={() => onSelectLayer('tracker')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg transition-all relative ${
                currentLayer === 'tracker'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span className="relative flex h-2.5 w-2.5">
                {activeOrderExists && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    activeOrderExists ? 'bg-emerald-500' : 'bg-stone-400'
                  }`}
                ></span>
              </span>
              <Radio className="w-3.5 h-3.5 text-emerald-600" />
              <span>Live Tracker</span>
            </button>
          </nav>

          {/* Right Actions: User Profile / Login & Quick Cart Total */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Cart Pill */}
            {cartItemCount > 0 && currentLayer !== 'cart' && (
              <button
                id="quick-cart-header-btn"
                onClick={() => onSelectLayer('cart')}
                className="hidden md:flex items-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-900 px-3 py-1.5 rounded-xl border border-orange-200 text-xs font-bold transition-colors"
              >
                <span>₹{cartTotal}</span>
                <span className="w-1 h-1 rounded-full bg-orange-400"></span>
                <span>View Cart ({cartItemCount})</span>
              </button>
            )}

            {/* Login / Profile Trigger */}
            <button
              id="user-profile-header-btn"
              onClick={onOpenLogin}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-200 hover:border-stone-300 hover:bg-stone-50 transition-colors text-xs font-medium text-stone-800"
            >
              {currentUser ? (
                <>
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-xs overflow-hidden">
                    {currentUser.avatarUrl ? (
                      <img 
                        src={currentUser.avatarUrl} 
                        alt={currentUser.displayName} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      currentUser.displayName.charAt(0)
                    )}
                  </div>
                  <span className="hidden sm:inline font-semibold max-w-[100px] truncate">
                    {currentUser.displayName}
                  </span>
                </>
              ) : (
                <>
                  <User className="w-4 h-4 text-stone-600" />
                  <span className="font-semibold">Sign In</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
