import React, { useState } from 'react';
import { UserProfile } from '../types';
import { DEMO_USERS } from '../data/menuData';
import { User, Phone, CheckCircle2, Sparkles, ArrowRight, X, LogOut, ShieldCheck, Coins } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
}) => {
  const [userIdInput, setUserIdInput] = useState('');
  const [userNameInput, setUserNameInput] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = userIdInput.trim().toLowerCase();
    if (!cleanId) {
      setError('Please enter a valid User ID or Mobile Number');
      return;
    }

    // Check if matching demo user
    const existing = DEMO_USERS.find(
      (u) => u.userId.toLowerCase() === cleanId || u.phone.includes(cleanId)
    );

    if (existing) {
      onLogin(existing);
      onClose();
      return;
    }

    // Create user with custom ID (no password needed as requested)
    const newUser: UserProfile = {
      userId: cleanId,
      displayName: userNameInput.trim() || cleanId.split('@')[0] || 'Foodie Explorer',
      phone: cleanId.match(/^\d+$/) ? `+91 ${cleanId}` : '+91 98765 00000',
      foodCoins: 150, // welcome bonus
      defaultAddress: {
        tag: 'Home',
        flat: 'House No. 12',
        street: 'MG Road, Central Market',
        city: 'Bengaluru',
        pincode: '560001',
      },
    };

    onLogin(newUser);
    onClose();
  };

  const handleSelectDemo = (user: UserProfile) => {
    onLogin(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        id="login-modal-container"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden"
      >
        {/* Header decoration banner */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 px-6 py-6 text-white relative">
          <button
            id="close-login-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-amber-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>ID-Only Fast Access • No Password Required</span>
          </div>
          <h2 className="text-2xl font-bold font-['Outfit',sans-serif] tracking-tight">
            {currentUser ? 'Your Profile' : 'Welcome to FOOD HUB'}
          </h2>
          <p className="text-amber-100 text-sm mt-1">
            {currentUser 
              ? 'Manage your active session and delivery addresses' 
              : 'Sign in with your User ID or Mobile to track live orders'}
          </p>
        </div>

        {/* Content body */}
        <div className="p-6">
          {currentUser ? (
            <div className="space-y-5">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-amber-50/80 border border-amber-200/70">
                <div className="w-14 h-14 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-xl shadow-md border-2 border-white overflow-hidden">
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
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-stone-900 truncate">
                      {currentUser.displayName}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 font-mono mt-0.5">ID: {currentUser.userId}</p>
                  <p className="text-xs text-stone-600 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-stone-400" /> {currentUser.phone}
                  </p>
                </div>
              </div>

              {/* FoodCoins reward badge */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-stone-500 block">FoodCoins Balance</span>
                    <span className="text-sm font-bold text-stone-900">{currentUser.foodCoins} Coins</span>
                  </div>
                </div>
                <span className="text-xs text-amber-700 font-medium bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  Worth ₹{Math.floor(currentUser.foodCoins / 2)}
                </span>
              </div>

              {/* Saved default delivery address */}
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Primary Address ({currentUser.defaultAddress.tag})
                  </span>
                </div>
                <p className="text-xs text-stone-800 font-medium">
                  {currentUser.defaultAddress.flat}, {currentUser.defaultAddress.street}
                </p>
                <p className="text-xs text-stone-500">
                  {currentUser.defaultAddress.city} - {currentUser.defaultAddress.pincode}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  id="sign-out-btn"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-sm font-semibold transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
                <button
                  id="continue-shopping-btn"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold shadow-sm transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Form for custom ID */}
              <form onSubmit={handleCustomLogin} className="space-y-3.5">
                <div>
                  <label htmlFor="user-id-input" className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                    Enter User ID or Mobile
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="user-id-input"
                      type="text"
                      placeholder="e.g. 9876543210 or your_handle"
                      value={userIdInput}
                      onChange={(e) => {
                        setUserIdInput(e.target.value);
                        setError('');
                      }}
                      className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-stone-50/50"
                      autoFocus
                    />
                  </div>
                  {error && <p className="text-xs text-rose-600 mt-1.5 font-medium">{error}</p>}
                </div>

                <div>
                  <label htmlFor="user-name-input" className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                    Your Name (Optional)
                  </label>
                  <input
                    id="user-name-input"
                    type="text"
                    placeholder="e.g. Ankit Sharma"
                    value={userNameInput}
                    onChange={(e) => setUserNameInput(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-stone-50/50"
                  />
                </div>

                <div className="text-[11px] text-stone-500 flex items-center gap-1.5 bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/50">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>No password needed! Your session is preserved automatically.</span>
                </div>

                <button
                  id="submit-login-id-btn"
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold text-sm shadow-md transition-all"
                >
                  <span>Continue with ID</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Demo 1-click accounts */}
              <div className="pt-2 border-t border-stone-200">
                <span className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2.5">
                  Or select a Demo Profile:
                </span>
                <div className="space-y-2">
                  {DEMO_USERS.map((user) => (
                    <button
                      key={user.userId}
                      id={`select-demo-${user.userId}`}
                      type="button"
                      onClick={() => handleSelectDemo(user)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/50 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={user.avatarUrl} 
                          alt={user.displayName} 
                          className="w-9 h-9 rounded-full object-cover border border-stone-200" 
                        />
                        <div>
                          <p className="text-xs font-bold text-stone-900 group-hover:text-amber-700">
                            {user.displayName}
                          </p>
                          <p className="text-[11px] text-stone-500 font-mono">
                            ID: {user.userId} • {user.defaultAddress.city}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-amber-600 opacity-80 group-hover:opacity-100 flex items-center gap-1">
                        Select <ArrowRight className="w-3 h-3" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
