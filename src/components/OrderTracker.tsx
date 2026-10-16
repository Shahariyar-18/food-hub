import React, { useState, useEffect } from 'react';
import { Order, OrderStage } from '../types';
import { RiderChatModal } from './RiderChatModal';
import { RiderCallModal } from './RiderCallModal';
import { 
  Bike, 
  MapPin, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  ChefHat, 
  Play, 
  Pause, 
  FastForward, 
  Receipt, 
  ArrowLeft,
  Navigation,
  Utensils
} from 'lucide-react';

interface OrderTrackerProps {
  order: Order | null;
  onBackToMenu: () => void;
  onUpdateOrderStage?: (stage: OrderStage) => void;
}

const STAGES: { key: OrderStage; label: string; desc: string; icon: any }[] = [
  { key: 'confirmed', label: 'Order Confirmed', desc: 'Kitchen acknowledged order', icon: CheckCircle2 },
  { key: 'preparing', label: 'Cooking in Kitchen', desc: 'Fresh ingredients being simmered & packed', icon: ChefHat },
  { key: 'picked_up', label: 'Order Picked Up', desc: 'Rider is en route to destination', icon: Bike },
  { key: 'on_the_way', label: 'Arriving Soon', desc: 'Rider near your society gate (< 3 mins)', icon: Navigation },
  { key: 'delivered', label: 'Delivered', desc: 'Enjoy your hot & authentic meal!', icon: Utensils },
];

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  order,
  onBackToMenu,
}) => {
  // Current active stage state
  const [currentStage, setCurrentStage] = useState<OrderStage>(order?.status || 'confirmed');
  // Simulated progress along the route (0 to 100%)
  const [routeProgress, setRouteProgress] = useState<number>(15);
  // Auto-play simulation state
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  // Modals
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Sync if order changes
  useEffect(() => {
    if (order) {
      setCurrentStage(order.status);
    }
  }, [order]);

  // Stage index helper
  const stageIndex = STAGES.findIndex((s) => s.key === currentStage);

  // Simulated live ticking loop
  useEffect(() => {
    if (!isSimulating || currentStage === 'delivered') return;

    const interval = setInterval(() => {
      setRouteProgress((prev) => {
        const next = prev + 1.2;
        if (next >= 100) {
          setCurrentStage('delivered');
          return 100;
        } else if (next >= 80 && currentStage !== 'on_the_way') {
          setCurrentStage('on_the_way');
        } else if (next >= 45 && currentStage !== 'picked_up' && currentStage !== 'on_the_way') {
          setCurrentStage('picked_up');
        } else if (next >= 20 && currentStage === 'confirmed') {
          setCurrentStage('preparing');
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSimulating, currentStage]);

  // Fast forward handler
  const handleFastForward = () => {
    const nextIdx = Math.min(STAGES.length - 1, stageIndex + 1);
    const nextStage = STAGES[nextIdx].key;
    setCurrentStage(nextStage);
    if (nextStage === 'confirmed') setRouteProgress(10);
    if (nextStage === 'preparing') setRouteProgress(30);
    if (nextStage === 'picked_up') setRouteProgress(55);
    if (nextStage === 'on_the_way') setRouteProgress(85);
    if (nextStage === 'delivered') setRouteProgress(100);
  };

  // If no order exists yet, show sample/demo tracker
  const dummyOrder: Order = order || {
    id: 'FH-839201',
    items: [],
    itemTotal: 638,
    deliveryFee: 0,
    packagingFee: 25,
    gstTax: 32,
    tipAmount: 30,
    discountAmount: 120,
    couponCode: 'FOODHUB50',
    grandTotal: 575,
    placedAt: '12:45 PM',
    estimatedDeliveryTime: '22 mins',
    status: currentStage,
    deliveryAddress: {
      tag: 'Home',
      flat: 'Flat 402, Lotus Residency',
      street: '12th Main Road, 4th Block Koramangala',
      city: 'Bengaluru',
      pincode: '560034',
    },
    deliveryPartner: {
      name: 'Ramesh Kumar',
      phone: '+91 98451 92834',
      rating: 4.9,
      totalDeliveries: 1480,
      vehicle: 'Hero Electric (KA 05 EV 4821)',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      temperature: '98.4°F',
      currentLatPercent: routeProgress,
    },
    deliveryPin: '7294',
    paymentMethod: 'UPI',
  };

  // Computed ETA calculation based on progress
  const remainingMins = Math.max(1, Math.round((1 - routeProgress / 100) * 26));
  const remainingDistanceKm = ((1 - routeProgress / 100) * 3.4).toFixed(1);

  // Approximate coordinate mapping along SVG path
  // Polyline points: (70, 70) -> (180, 70) -> (180, 180) -> (320, 180) -> (320, 310) -> (450, 310)
  const calculateRiderCoordinates = (percent: number) => {
    const t = Math.min(100, Math.max(0, percent)) / 100;
    // 5 segments of lengths roughly:
    // Seg 1: (70, 70) to (180, 70) -> dx=110
    // Seg 2: (180, 70) to (180, 180) -> dy=110
    // Seg 3: (180, 180) to (320, 180) -> dx=140
    // Seg 4: (320, 180) to (320, 310) -> dy=130
    // Seg 5: (320, 310) to (450, 310) -> dx=130
    // Total len = 620
    const d = t * 620;
    if (d <= 110) {
      return { x: 70 + d, y: 70, angle: 0 };
    } else if (d <= 220) {
      return { x: 180, y: 70 + (d - 110), angle: 90 };
    } else if (d <= 360) {
      return { x: 180 + (d - 220), y: 180, angle: 0 };
    } else if (d <= 490) {
      return { x: 320, y: 180 + (d - 360), angle: 90 };
    } else {
      return { x: 320 + (d - 490), y: 310, angle: 0 };
    }
  };

  const riderPos = calculateRiderCoordinates(routeProgress);

  return (
    <div id="order-tracker-screen" className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Top Banner Navigation & Simulation Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <button
            onClick={onBackToMenu}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-orange-600 mb-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Menu</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit',sans-serif] text-stone-900 tracking-tight">
              Live Order Tracker
            </h1>
            <span className="font-mono text-xs font-bold bg-orange-100 text-orange-800 px-2.5 py-1 rounded-full">
              {dummyOrder.id}
            </span>
          </div>
        </div>

        {/* Real-time simulation toolbar */}
        <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-stone-600 px-2 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            Simulate Route:
          </span>
          <button
            id="simulation-toggle-btn"
            onClick={() => setIsSimulating(!isSimulating)}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors ${
              isSimulating
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'bg-stone-200 text-stone-600'
            }`}
            title={isSimulating ? 'Pause auto-progress' : 'Resume auto-progress'}
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isSimulating ? 'Pause' : 'Play'}</span>
          </button>

          <button
            id="simulation-fast-forward-btn"
            onClick={handleFastForward}
            className="p-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors"
            title="Jump to next stage"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>Next Stage</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Vector Map & Live GPS Route (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col">
            {/* Map Header Status Overlay */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-900 to-stone-800 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-orange-400 block">
                  {currentStage === 'delivered' ? 'Order Fulfilled' : 'Estimated Arrival'}
                </span>
                <div className="text-xl sm:text-2xl font-black font-['Outfit',sans-serif] flex items-center gap-2">
                  {currentStage === 'delivered' ? (
                    <span className="text-emerald-400">Delivered Safely!</span>
                  ) : (
                    <>
                      <span>{remainingMins} mins</span>
                      <span className="text-stone-400 text-xs font-normal">
                        ({remainingDistanceKm} km away)
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Delivery PIN pill */}
              <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 text-right">
                <span className="text-[10px] uppercase font-semibold text-stone-300 block">
                  Delivery PIN
                </span>
                <span className="text-lg font-black font-mono tracking-widest text-amber-300">
                  {dummyOrder.deliveryPin}
                </span>
              </div>
            </div>

            {/* Interactive Vector Canvas Map */}
            <div className="relative w-full h-[360px] sm:h-[400px] bg-[#f2f4f8] overflow-hidden select-none">
              <svg 
                className="w-full h-full"
                viewBox="0 0 520 380" 
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  {/* Grid pattern for realistic urban city streets */}
                  <pattern id="urban-blocks" width="60" height="60" patternUnits="userSpaceOnUse">
                    <rect width="60" height="60" fill="#f4f6f9" />
                    <rect x="6" y="6" width="48" height="48" rx="6" fill="#e9ecf2" />
                  </pattern>

                  {/* Park green zone */}
                  <pattern id="park-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
                    <rect width="80" height="80" fill="#e6f4ea" />
                    <circle cx="20" cy="20" r="10" fill="#ceead6" />
                    <circle cx="50" cy="50" r="12" fill="#ceead6" />
                  </pattern>
                </defs>

                {/* Base Background City Blocks */}
                <rect width="520" height="380" fill="url(#urban-blocks)" />

                {/* Green Park Region */}
                <rect x="220" y="30" width="130" height="110" rx="16" fill="url(#park-pattern)" stroke="#ceead6" strokeWidth="2" />
                <text x="245" y="85" fill="#137333" fontSize="10" fontWeight="bold" opacity="0.7">
                  Cubbon Park
                </text>

                {/* Main Arterial Avenues (Gray Roads) */}
                <path d="M 0 70 L 520 70" stroke="#ffffff" strokeWidth="24" strokeLinecap="round" />
                <path d="M 0 70 L 520 70" stroke="#d5dae2" strokeWidth="18" strokeLinecap="round" />
                
                <path d="M 180 0 L 180 380" stroke="#ffffff" strokeWidth="24" strokeLinecap="round" />
                <path d="M 180 0 L 180 380" stroke="#d5dae2" strokeWidth="18" strokeLinecap="round" />

                <path d="M 0 180 L 520 180" stroke="#ffffff" strokeWidth="24" strokeLinecap="round" />
                <path d="M 0 180 L 520 180" stroke="#d5dae2" strokeWidth="18" strokeLinecap="round" />

                <path d="M 320 0 L 320 380" stroke="#ffffff" strokeWidth="24" strokeLinecap="round" />
                <path d="M 320 0 L 320 380" stroke="#d5dae2" strokeWidth="18" strokeLinecap="round" />

                <path d="M 0 310 L 520 310" stroke="#ffffff" strokeWidth="24" strokeLinecap="round" />
                <path d="M 0 310 L 520 310" stroke="#d5dae2" strokeWidth="18" strokeLinecap="round" />

                {/* Road Labels */}
                <text x="25" y="65" fill="#707b8b" fontSize="9" fontWeight="600">
                  Ring Road Expressway
                </text>
                <text x="200" y="200" fill="#707b8b" fontSize="9" fontWeight="600">
                  100 Feet Road
                </text>
                <text x="340" y="305" fill="#707b8b" fontSize="9" fontWeight="600">
                  12th Main Indiranagar
                </text>

                {/* Live Delivery Polyline Route */}
                {/* 1. Inactive background path */}
                <path
                  d="M 70 70 L 180 70 L 180 180 L 320 180 L 320 310 L 450 310"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="6 6"
                  opacity="0.6"
                />

                {/* 2. Active highlighted route covered */}
                <path
                  d="M 70 70 L 180 70 L 180 180 L 320 180 L 320 310 L 450 310"
                  fill="none"
                  stroke="#ea580c"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Restaurant Beacon Origin (70, 70) */}
                <g transform="translate(70, 70)">
                  <circle r="18" fill="#ea580c" opacity="0.2" />
                  <circle r="12" fill="#ea580c" />
                  <circle r="5" fill="#ffffff" />
                  <rect x="-42" y="-30" width="84" height="20" rx="6" fill="#1c1917" />
                  <text x="0" y="-16" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                    FOOD HUB Kitchen
                  </text>
                </g>

                {/* Customer Home Destination Beacon (450, 310) */}
                <g transform="translate(450, 310)">
                  <circle r="24" fill="#10b981" opacity="0.2" className="animate-ping" />
                  <circle r="14" fill="#10b981" />
                  <circle r="6" fill="#ffffff" />
                  <rect x="-35" y="-32" width="70" height="20" rx="6" fill="#1c1917" />
                  <text x="0" y="-18" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                    Your Home
                  </text>
                </g>

                {/* Moving Courier Scooter Marker */}
                <g 
                  transform={`translate(${riderPos.x}, ${riderPos.y}) rotate(${riderPos.angle})`}
                  style={{ transition: 'transform 0.4s ease-out' }}
                >
                  {/* Pulsing ring around rider */}
                  <circle r="22" fill="#ea580c" opacity="0.25" className="animate-pulse" />
                  <circle r="16" fill="#ffffff" stroke="#ea580c" strokeWidth="3" />
                  {/* Directional Scooter Dot / Arrow */}
                  <circle r="8" fill="#ea580c" />
                  <polygon points="12,0 7,-4 7,4" fill="#ffffff" />
                </g>
              </svg>

              {/* Bottom Floating Live Status Ticker */}
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-stone-200/90 shadow-md flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                    <Bike className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <span className="font-bold text-stone-900 block truncate">
                      {currentStage === 'delivered'
                        ? 'Rider has reached your doorstep!'
                        : currentStage === 'on_the_way'
                        ? `${dummyOrder.deliveryPartner.name} is turning into 12th Main Road`
                        : `${dummyOrder.deliveryPartner.name} is on the way (${remainingDistanceKm} km)`}
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Vehicle: {dummyOrder.deliveryPartner.vehicle}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    id="map-call-btn"
                    onClick={() => setIsCallOpen(true)}
                    className="p-2 rounded-xl bg-stone-100 hover:bg-orange-50 text-stone-700 hover:text-orange-600 border border-stone-200 transition-colors"
                    title="Call Partner"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  <button
                    id="map-chat-btn"
                    onClick={() => setIsChatOpen(true)}
                    className="p-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white shadow-2xs transition-colors"
                    title="Chat with Partner"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Delivery Partner Details Card */}
            <div className="p-4 sm:p-5 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative">
                  <img
                    src={dummyOrder.deliveryPartner.photoUrl}
                    alt={dummyOrder.deliveryPartner.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-orange-500"
                  />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-stone-900">
                      {dummyOrder.deliveryPartner.name}
                    </h3>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      {dummyOrder.deliveryPartner.rating} ★
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    {dummyOrder.deliveryPartner.totalDeliveries}+ successful deliveries
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Temp: {dummyOrder.deliveryPartner.temperature} • Sanitized Bag</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  id="partner-card-call-btn"
                  onClick={() => setIsCallOpen(true)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-800 text-xs font-bold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-stone-600" />
                  <span>Call Rider</span>
                </button>
                <button
                  id="partner-card-chat-btn"
                  onClick={() => setIsChatOpen(true)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-2xs transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Live Chat</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Stage Order Timeline & Receipt (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Order Stages Step Tracker */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Live Milestones
            </h3>

            <div className="space-y-4 relative pl-2">
              {/* Connecting vertical timeline track */}
              <div className="absolute left-[19px] top-3 bottom-5 w-0.5 bg-stone-200"></div>
              <div 
                className="absolute left-[19px] top-3 w-0.5 bg-orange-600 transition-all duration-500"
                style={{ height: `${(stageIndex / (STAGES.length - 1)) * 90}%` }}
              ></div>

              {STAGES.map((s, idx) => {
                const Icon = s.icon;
                const isPassed = idx <= stageIndex;
                const isCurrent = idx === stageIndex;

                return (
                  <div key={s.key} className="flex items-start gap-3 relative z-10">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        isPassed
                          ? 'bg-orange-600 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-400 border border-stone-200'
                      } ${isCurrent ? 'ring-4 ring-orange-100' : ''}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`text-xs font-bold ${
                            isCurrent
                              ? 'text-orange-600 font-extrabold'
                              : isPassed
                              ? 'text-stone-900'
                              : 'text-stone-400'
                          }`}
                        >
                          {s.label}
                        </h4>
                        {isCurrent && (
                          <span className="text-[10px] uppercase font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full animate-pulse">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 leading-snug mt-0.5">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Destination Address Info */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-stone-900">
              <MapPin className="w-4 h-4 text-orange-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Delivering to
              </h4>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                {dummyOrder.deliveryAddress.tag}
              </span>
              <p className="text-xs text-stone-800 font-medium mt-1">
                {dummyOrder.deliveryAddress.flat}, {dummyOrder.deliveryAddress.street}
              </p>
              <p className="text-xs text-stone-500">
                {dummyOrder.deliveryAddress.city} - {dummyOrder.deliveryAddress.pincode}
              </p>
            </div>
          </div>

          {/* Order Summary & Receipt Action */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Bill Summary
              </h4>
              <button
                id="view-full-receipt-btn"
                onClick={() => setShowReceiptModal(true)}
                className="text-xs text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>View Full Receipt</span>
              </button>
            </div>

            <div className="text-xs text-stone-600 space-y-1.5">
              <div className="flex justify-between">
                <span>Total Paid ({dummyOrder.paymentMethod})</span>
                <span className="font-extrabold text-stone-900 font-['Outfit',sans-serif] text-sm">
                  ₹{dummyOrder.grandTotal}
                </span>
              </div>
              {dummyOrder.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Saved ({dummyOrder.couponCode})</span>
                  <span>-₹{dummyOrder.discountAmount}</span>
                </div>
              )}
            </div>

            <button
              onClick={onBackToMenu}
              className="w-full py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors text-center"
            >
              Order More Items
            </button>
          </div>
        </div>
      </div>

      {/* Full Digital Tax Receipt Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4">
            <div className="text-center border-b border-stone-200 pb-4">
              <span className="font-['Outfit',sans-serif] text-2xl font-black text-stone-900">
                FOOD<span className="text-orange-600">HUB</span>
              </span>
              <p className="text-[11px] text-stone-500 uppercase tracking-wider mt-0.5">
                Official Digital Tax Invoice
              </p>
              <p className="text-xs font-mono text-stone-600 mt-1 font-bold">
                Order ID: {dummyOrder.id}
              </p>
            </div>

            <div className="text-xs space-y-2 text-stone-700">
              <div className="flex justify-between">
                <span className="text-stone-500">Order Placed At:</span>
                <span className="font-medium">{dummyOrder.placedAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Payment Status:</span>
                <span className="font-bold text-emerald-700">Paid via {dummyOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Delivery Address:</span>
                <span className="font-medium text-right max-w-[200px] truncate">
                  {dummyOrder.deliveryAddress.flat}, {dummyOrder.deliveryAddress.city}
                </span>
              </div>
            </div>

            <div className="border-t border-b border-dashed border-stone-200 py-3 space-y-1 text-xs">
              <div className="flex justify-between font-semibold">
                <span>Subtotal Items</span>
                <span>₹{dummyOrder.itemTotal}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Packaging Charges</span>
                <span>₹{dummyOrder.packagingFee}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Delivery Partner Fee</span>
                <span>{dummyOrder.deliveryFee === 0 ? 'FREE' : `₹${dummyOrder.deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>GST (5%)</span>
                <span>₹{dummyOrder.gstTax}</span>
              </div>
              {dummyOrder.tipAmount > 0 && (
                <div className="flex justify-between text-stone-500">
                  <span>Rider Tip</span>
                  <span>₹{dummyOrder.tipAmount}</span>
                </div>
              )}
              {dummyOrder.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount Applied</span>
                  <span>-₹{dummyOrder.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between font-['Outfit',sans-serif] text-base font-black text-stone-900 pt-2 border-t border-stone-200">
                <span>Grand Total</span>
                <span>₹{dummyOrder.grandTotal}</span>
              </div>
            </div>

            <button
              onClick={() => setShowReceiptModal(false)}
              className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}

      {/* In-App Live Rider Chat Modal */}
      <RiderChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        partner={dummyOrder.deliveryPartner}
        deliveryPin={dummyOrder.deliveryPin}
      />

      {/* In-App Live Rider Call Modal */}
      <RiderCallModal
        isOpen={isCallOpen}
        onClose={() => setIsCallOpen(false)}
        partner={dummyOrder.deliveryPartner}
      />
    </div>
  );
};
