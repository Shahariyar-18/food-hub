import React, { useState, useEffect } from 'react';
import { MenuItem, CustomizationOption, CartItem } from '../types';
import { X, Plus, Check, MessageSquare, Flame } from 'lucide-react';

interface CustomizerModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveToCart: (cartItem: CartItem) => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  item,
  isOpen,
  onClose,
  onSaveToCart,
}) => {
  if (!isOpen || !item) return null;

  // State for portions & add-ons
  const [selectedPortion, setSelectedPortion] = useState<CustomizationOption | undefined>(
    item.customizationGroups?.find((g) => g.id === 'portion')?.options[0]
  );
  const [selectedAddons, setSelectedAddons] = useState<CustomizationOption[]>([]);
  const [cookingNotes, setCookingNotes] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Reset when item changes
  useEffect(() => {
    if (item) {
      const defaultPortion = item.customizationGroups?.find((g) => g.id === 'portion')?.options[0];
      setSelectedPortion(defaultPortion);
      setSelectedAddons([]);
      setCookingNotes('');
      setQuantity(1);
    }
  }, [item]);

  // Calculate dynamic price per unit
  const basePrice = item.price;
  const portionPrice = selectedPortion ? selectedPortion.price : 0;
  const addonsPrice = selectedAddons.reduce((acc, curr) => acc + curr.price, 0);
  const unitTotal = basePrice + portionPrice + addonsPrice;
  const grandTotal = unitTotal * quantity;

  const toggleAddon = (option: CustomizationOption) => {
    if (selectedAddons.some((a) => a.id === option.id)) {
      setSelectedAddons(selectedAddons.filter((a) => a.id !== option.id));
    } else {
      setSelectedAddons([...selectedAddons, option]);
    }
  };

  const handleAdd = () => {
    // Generate unique composite key
    const addonIds = selectedAddons.map((a) => a.id).sort().join('-');
    const portionId = selectedPortion ? selectedPortion.id : 'base';
    const cartItemId = `${item.id}-${portionId}-${addonIds}`;

    const newCartItem: CartItem = {
      cartItemId,
      menuItem: item,
      quantity,
      selectedPortion,
      selectedAddons,
      cookingInstructions: cookingNotes.trim() || undefined,
      itemTotalPrice: unitTotal,
    };

    onSaveToCart(newCartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        id="customizer-modal-container"
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-start justify-between gap-3 bg-stone-50/70">
          <div className="flex items-start gap-3">
            {/* Veg / Non-veg indicator */}
            <div className="mt-1 bg-white p-1 rounded border border-stone-200 shadow-2xs">
              {item.diet === 'veg' ? (
                <div className="w-3.5 h-3.5 border-2 border-emerald-600 flex items-center justify-center p-[2px]">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div>
                </div>
              ) : (
                <div className="w-3.5 h-3.5 border-2 border-rose-600 flex items-center justify-center p-[2px]">
                  <div className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[6px] border-b-rose-600"></div>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold font-['Outfit',sans-serif] text-stone-900 leading-tight">
                {item.name}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Base price: <span className="font-semibold text-stone-800">₹{item.price}</span>
              </p>
            </div>
          </div>

          <button
            id="close-customizer-btn"
            onClick={onClose}
            className="p-1.5 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 transition-colors"
            aria-label="Close customizer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Customization Options */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-sm">
          {item.customizationGroups?.map((group) => (
            <div key={group.id} className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                  {group.title}
                </h3>
                {group.required && (
                  <span className="text-[10px] uppercase font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                    Required
                  </span>
                )}
              </div>

              {group.type === 'single' ? (
                // Radio button style
                <div className="space-y-1.5">
                  {group.options.map((opt) => {
                    const isSelected = selectedPortion?.id === opt.id;
                    return (
                      <label
                        key={opt.id}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-orange-600 bg-orange-50/50 shadow-2xs'
                            : 'border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name={group.id}
                            checked={isSelected}
                            onChange={() => setSelectedPortion(opt)}
                            className="text-orange-600 focus:ring-orange-500"
                          />
                          <span className={`text-xs font-semibold ${isSelected ? 'text-orange-950' : 'text-stone-700'}`}>
                            {opt.name}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-stone-800">
                          {opt.price === 0 ? 'Included' : `+₹${opt.price}`}
                        </span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                // Checkbox style for add-ons
                <div className="space-y-1.5">
                  {group.options.map((opt) => {
                    const isChecked = selectedAddons.some((a) => a.id === opt.id);
                    return (
                      <label
                        key={opt.id}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'border-orange-600 bg-orange-50/50 shadow-2xs'
                            : 'border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleAddon(opt)}
                            className="rounded text-orange-600 focus:ring-orange-500"
                          />
                          <span className={`text-xs font-semibold ${isChecked ? 'text-orange-950' : 'text-stone-700'}`}>
                            {opt.name}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-stone-800">
                          +₹{opt.price}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {/* Cooking Instructions note */}
          <div className="space-y-2 pt-2 border-t border-stone-200">
            <label 
              htmlFor="cooking-notes-textarea" 
              className="flex items-center gap-1.5 font-bold text-stone-900 text-xs uppercase tracking-wider"
            >
              <MessageSquare className="w-3.5 h-3.5 text-stone-500" />
              Chef Instructions / Notes
            </label>
            <textarea
              id="cooking-notes-textarea"
              rows={2}
              placeholder="e.g. Please make it less spicy, extra green chutney, no disposable cutlery..."
              value={cookingNotes}
              onChange={(e) => setCookingNotes(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-stone-800"
            />
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center bg-white border border-stone-200 rounded-xl shadow-2xs p-1">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="p-1.5 text-stone-600 hover:text-stone-900 disabled:opacity-40 transition-colors"
            >
              -
            </button>
            <span className="px-3 text-xs font-bold font-mono text-stone-900">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="p-1.5 text-stone-600 hover:text-stone-900 transition-colors"
            >
              +
            </button>
          </div>

          {/* Add to Cart Submit */}
          <button
            id="confirm-customization-btn"
            onClick={handleAdd}
            className="flex-1 flex items-center justify-between px-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md transition-all group"
          >
            <span>Add to Cart</span>
            <span className="font-['Outfit',sans-serif] text-base tracking-tight group-hover:scale-105 transition-transform">
              ₹{grandTotal}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
