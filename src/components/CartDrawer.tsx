import React, { useState } from 'react';
import { CartItem, UserProfile, Order } from '../types';
import { AVAILABLE_COUPONS } from '../data/menuData';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Tag, 
  Check, 
  ArrowRight, 
  Bike, 
  ShieldCheck, 
  MapPin, 
  CreditCard, 
  Smartphone, 
  Banknote,
  Sparkles,
  Info
} from 'lucide-react';

interface CartDrawerProps {
  items: CartItem[];
  currentUser: UserProfile | null;
  onOpenLogin: () => void;
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onPlaceOrder: (order: Order) => void;
  onBrowseMenu: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  items,
  currentUser,
  onOpenLogin,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onPlaceOrder,
  onBrowseMenu,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<typeof AVAILABLE_COUPONS[0] | null>(null);
  const [couponError, setCouponError] = useState('');
  const [selectedTip, setSelectedTip] = useState<number>(30); // in ₹
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Cash on Delivery' | 'Card / Net Banking'>('UPI');
  const [isPlacing, setIsPlacing] = useState(false);

  // Calculations
  const itemTotal = items.reduce((acc, it) => acc + it.itemTotalPrice * it.quantity, 0);

  // Delivery fee logic
  const baseDeliveryFee = itemTotal > 299 ? 0 : 35;
  const isFreeDelApplied = appliedCoupon?.code === 'FREEDEL';
  const deliveryFee = isFreeDelApplied ? 0 : baseDeliveryFee;

  const packagingFee = items.length > 0 ? 25 : 0;
  const gstTax = Math.round(itemTotal * 0.05); // 5% GST

  // Calculate coupon discount
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discountAmount = Math.min(
        Math.round((itemTotal * appliedCoupon.discountPercent) / 100),
        appliedCoupon.maxDiscount || 9999
      );
    } else if (appliedCoupon.discountFixed) {
      discountAmount = Math.min(itemTotal, appliedCoupon.discountFixed);
    } else if (appliedCoupon.freeDelivery) {
      discountAmount = baseDeliveryFee;
    }
  }

  const grandTotal = Math.max(0, itemTotal + deliveryFee + packagingFee + gstTax + selectedTip - discountAmount);

  const handleApplyCoupon = (couponCode: string) => {
    setCouponError('');
    const found = AVAILABLE_COUPONS.find((c) => c.code.toLowerCase() === couponCode.trim().toLowerCase());
    if (!found) {
      setCouponError('Invalid coupon code. Try FOODHUB50 or FEAST100');
      return;
    }
    if (itemTotal < found.minOrder) {
      setCouponError(`Minimum order of ₹${found.minOrder} required for ${found.code}`);
      return;
    }
    setAppliedCoupon(found);
    setCouponInput(found.code);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
  };

  const handleCheckout = () => {
    if (!currentUser) {
      onOpenLogin();
      return;
    }

    if (items.length === 0) return;

    setIsPlacing(true);

    setTimeout(() => {
      // Create confirmed order
      const newOrder: Order = {
        id: `FH-${Math.floor(100000 + Math.random() * 900000)}`,
        items: [...items],
        itemTotal,
        deliveryFee,
        packagingFee,
        gstTax,
        tipAmount: selectedTip,
        discountAmount,
        couponCode: appliedCoupon?.code,
        grandTotal,
        placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        estimatedDeliveryTime: '24-28 mins',
        status: 'confirmed',
        deliveryAddress: currentUser.defaultAddress,
        deliveryPartner: {
          name: 'Ramesh Kumar',
          phone: '+91 98451 92834',
          rating: 4.9,
          totalDeliveries: 1480,
          vehicle: 'Hero Electric (KA 05 EV 4821)',
          photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          temperature: '98.4°F',
          currentLatPercent: 8,
        },
        deliveryPin: String(Math.floor(1000 + Math.random() * 9000)),
        paymentMethod,
      };

      onPlaceOrder(newOrder);
      setIsPlacing(false);
    }, 900);
  };

  if (items.length === 0) {
    return (
      <div 
        id="empty-cart-view"
        className="max-w-xl mx-auto py-16 px-4 text-center space-y-4"
      >
        <div className="w-24 h-24 mx-auto rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-500 shadow-inner">
          <ShoppingBag className="w-12 h-12 stroke-1" />
        </div>
        <h2 className="text-2xl font-bold font-['Outfit',sans-serif] text-stone-900">
          Your Cart is Empty
        </h2>
        <p className="text-stone-500 text-sm max-w-sm mx-auto">
          Explore our handcrafted Indian menu, choose your preferred spice level and add-ons, and indulge in hot meals delivered fast.
        </p>
        <button
          id="empty-cart-browse-btn"
          onClick={onBrowseMenu}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md transition-colors"
        >
          <span>Explore Delicious Menu</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div id="cart-screen-container" className="max-w-5xl mx-auto py-6 px-4 sm:px-6">
      <div className="flex items-center justify-between pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit',sans-serif] text-stone-900 tracking-tight">
            Order Review & Cart
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {items.reduce((sum, i) => sum + i.quantity, 0)} items from Food Hub Kitchen
          </p>
        </div>
        <button
          onClick={onClearCart}
          className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 p-2 rounded-lg hover:bg-rose-50 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Left Column: Cart Items & Add-ons (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs divide-y divide-stone-100 overflow-hidden">
            {items.map((cartItem) => (
              <div 
                key={cartItem.cartItemId} 
                id={`cart-row-${cartItem.cartItemId}`}
                className="p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-stone-50/50 transition-colors"
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  {/* Veg / Non-veg indicator */}
                  <div className="mt-1 shrink-0 bg-white p-1 rounded border border-stone-200">
                    {cartItem.menuItem.diet === 'veg' ? (
                      <div className="w-3.5 h-3.5 border-2 border-emerald-600 flex items-center justify-center p-[2px]">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div>
                      </div>
                    ) : (
                      <div className="w-3.5 h-3.5 border-2 border-rose-600 flex items-center justify-center p-[2px]">
                        <div className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[6px] border-b-rose-600"></div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold font-['Outfit',sans-serif] text-stone-900 truncate">
                      {cartItem.menuItem.name}
                    </h3>

                    {/* Portion detail */}
                    {cartItem.selectedPortion && (
                      <p className="text-xs text-stone-600 mt-0.5 font-medium">
                        Portion: {cartItem.selectedPortion.name}
                      </p>
                    )}

                    {/* Selected add-ons */}
                    {cartItem.selectedAddons.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {cartItem.selectedAddons.map((addon) => (
                          <span
                            key={addon.id}
                            className="inline-block text-[10px] font-medium bg-amber-50 text-amber-900 border border-amber-200/70 px-2 py-0.5 rounded-md"
                          >
                            +{addon.name} (₹{addon.price})
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Chef notes if any */}
                    {cartItem.cookingInstructions && (
                      <p className="text-[11px] text-stone-500 italic mt-1.5 bg-stone-50 p-1.5 rounded-md border border-stone-100">
                        Note: "{cartItem.cookingInstructions}"
                      </p>
                    )}

                    <div className="text-xs font-bold text-stone-900 mt-2">
                      ₹{cartItem.itemTotalPrice} each
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Line Total */}
                <div className="flex flex-col items-end justify-between self-stretch shrink-0">
                  <div className="flex items-center bg-stone-100 border border-stone-200 rounded-xl p-0.5 shadow-2xs">
                    <button
                      onClick={() => onUpdateQuantity(cartItem.cartItemId, -1)}
                      className="p-1.5 text-stone-600 hover:text-stone-900 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2.5 text-xs font-bold font-mono text-stone-900">
                      {cartItem.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(cartItem.cartItemId, 1)}
                      className="p-1.5 text-stone-600 hover:text-stone-900 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-sm font-extrabold font-['Outfit',sans-serif] text-stone-900">
                    ₹{cartItem.itemTotalPrice * cartItem.quantity}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Partner Tip Section */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bike className="w-4 h-4 text-orange-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  Delivery Partner Tip
                </h4>
              </div>
              <span className="text-[11px] text-stone-500">
                100% directly credited to rider
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[0, 20, 30, 50].map((tip) => (
                <button
                  key={tip}
                  onClick={() => setSelectedTip(tip)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    selectedTip === tip
                      ? 'bg-orange-600 text-white border-orange-600 shadow-2xs'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  {tip === 0 ? 'No Tip' : `₹${tip}`}
                </button>
              ))}
            </div>
          </div>

          {/* Delivery Address Review */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  Deliver To
                </h4>
              </div>
              {currentUser ? (
                <button
                  onClick={onOpenLogin}
                  className="text-xs text-orange-600 hover:text-orange-700 font-semibold"
                >
                  Change
                </button>
              ) : (
                <button
                  onClick={onOpenLogin}
                  className="text-xs text-orange-600 hover:text-orange-700 font-bold underline"
                >
                  Login to Set Address
                </button>
              )}
            </div>

            {currentUser ? (
              <div>
                <span className="inline-block text-[11px] font-bold uppercase bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                  {currentUser.defaultAddress.tag}
                </span>
                <p className="text-xs text-stone-800 font-medium mt-1">
                  {currentUser.defaultAddress.flat}, {currentUser.defaultAddress.street}
                </p>
                <p className="text-xs text-stone-500">
                  {currentUser.defaultAddress.city} - {currentUser.defaultAddress.pincode}
                </p>
              </div>
            ) : (
              <p className="text-xs text-stone-500">
                Please sign in with your User ID to auto-populate your delivery address and receive live updates.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Coupon & Bill Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Coupon Code Card */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-stone-900">
              <Tag className="w-4 h-4 text-orange-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Coupons & Offers
              </h4>
            </div>

            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="text-xs font-bold text-emerald-900 block font-mono">
                      '{appliedCoupon.code}' APPLIED
                    </span>
                    <span className="text-[11px] text-emerald-700">
                      You saved ₹{discountAmount} on this order!
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-xs text-rose-600 hover:text-rose-700 font-bold px-2 py-1"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code (e.g. FOODHUB50)"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value.toUpperCase());
                      setCouponError('');
                    }}
                    className="flex-1 px-3 py-2 text-xs uppercase font-mono border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    onClick={() => handleApplyCoupon(couponInput)}
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="text-xs text-rose-600 font-medium">{couponError}</p>
                )}

                {/* Suggested Coupons */}
                <div className="pt-2">
                  <span className="text-[11px] text-stone-500 block mb-1.5 font-medium">
                    Available Coupons for you:
                  </span>
                  <div className="space-y-1.5">
                    {AVAILABLE_COUPONS.map((cp) => (
                      <button
                        key={cp.code}
                        onClick={() => handleApplyCoupon(cp.code)}
                        className="w-full flex items-center justify-between p-2 rounded-lg border border-dashed border-stone-200 hover:border-orange-400 hover:bg-orange-50/40 text-left transition-colors group"
                      >
                        <div>
                          <span className="font-mono text-xs font-bold text-stone-800 group-hover:text-orange-600">
                            {cp.code}
                          </span>
                          <span className="text-[10px] text-stone-500 block">
                            {cp.description}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-orange-600 group-hover:underline">
                          Tap to Apply
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Payment Method
            </h4>
            <div className="space-y-2">
              {[
                { id: 'UPI', label: 'UPI (GPay / PhonePe / Paytm)', icon: Smartphone },
                { id: 'Cash on Delivery', label: 'Cash on Delivery (COD)', icon: Banknote },
                { id: 'Card / Net Banking', label: 'Credit / Debit Card / Net Banking', icon: CreditCard },
              ].map((pm) => {
                const Icon = pm.icon;
                const isSelected = paymentMethod === pm.id;
                return (
                  <label
                    key={pm.id}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-orange-600 bg-orange-50/50 shadow-2xs'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={isSelected}
                        onChange={() => setPaymentMethod(pm.id as any)}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-orange-600' : 'text-stone-500'}`} />
                      <span className={`text-xs font-semibold ${isSelected ? 'text-stone-900' : 'text-stone-700'}`}>
                        {pm.label}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Transparent Bill Summary in INR */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Bill Details
            </h4>

            <div className="space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Item Total</span>
                <span className="font-semibold text-stone-900">₹{itemTotal}</span>
              </div>

              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  Delivery Partner Fee
                  {itemTotal > 299 && (
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1 rounded">
                      Free over ₹299
                    </span>
                  )}
                </span>
                <span className="font-semibold text-stone-900">
                  {deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${deliveryFee}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Restaurant Packaging</span>
                <span className="font-semibold text-stone-900">₹{packagingFee}</span>
              </div>

              <div className="flex justify-between">
                <span>Govt Taxes & GST (5%)</span>
                <span className="font-semibold text-stone-900">₹{gstTax}</span>
              </div>

              {selectedTip > 0 && (
                <div className="flex justify-between">
                  <span>Rider Tip</span>
                  <span className="font-semibold text-stone-900">₹{selectedTip}</span>
                </div>
              )}

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-stone-200 flex items-baseline justify-between text-stone-900">
              <div>
                <span className="text-sm font-bold uppercase tracking-wide">To Pay</span>
                <span className="block text-[10px] text-stone-400">Inclusive of all taxes</span>
              </div>
              <span className="font-['Outfit',sans-serif] text-2xl font-black text-stone-900">
                ₹{grandTotal}
              </span>
            </div>

            {/* Safety & Cancellation Promise */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-[11px] text-stone-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Safe & hygienic contact-free delivery guaranteed</span>
            </div>

            {/* Place Order CTA Button */}
            <button
              id="place-order-btn"
              onClick={handleCheckout}
              disabled={isPlacing}
              className="w-full flex items-center justify-between px-6 py-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-orange-600/20 transition-all group disabled:opacity-75 cursor-pointer"
            >
              <span>{isPlacing ? 'Confirming Order...' : (currentUser ? 'Place Order & Track' : 'Sign in & Place Order')}</span>
              <div className="flex items-center gap-2">
                <span className="font-['Outfit',sans-serif] text-lg font-black">
                  ₹{grandTotal}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
