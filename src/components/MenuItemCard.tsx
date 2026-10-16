import React from 'react';
import { MenuItem } from '../types';
import { Star, Clock, Flame, Plus, Minus, Heart } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  onOpenCustomizer: (item: MenuItem) => void;
  cartQuantity: number;
  onUpdateQuantity: (item: MenuItem, delta: number) => void;
  isFavorite: boolean;
  onToggleFavorite: (itemId: string) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onAddToCart,
  onOpenCustomizer,
  cartQuantity,
  onUpdateQuantity,
  isFavorite,
  onToggleFavorite,
}) => {
  const hasCustomizations = item.customizationGroups && item.customizationGroups.length > 0;

  return (
    <div 
      id={`menu-item-${item.id}`}
      className="group bg-white rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
    >
      <div>
        {/* Image & Badges Container */}
        <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
          <img
            src={item.imageUrl}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* Top Indicators: Veg/Non-Veg & Badges */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
            {/* FSSAI Veg / Non-Veg Icon */}
            <div className="bg-white/90 backdrop-blur-xs p-1 rounded-sm shadow-xs">
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

            {item.isBestseller && (
              <span className="bg-amber-500 text-stone-900 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow-xs tracking-wider">
                Bestseller
              </span>
            )}
            {item.isChefSpecial && (
              <span className="bg-rose-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded shadow-xs tracking-wider">
                Chef's Special
              </span>
            )}
          </div>

          {/* Favorite heart toggle */}
          <button
            id={`fav-btn-${item.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(item.id);
            }}
            className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 backdrop-blur-xs text-stone-700 hover:text-rose-500 transition-colors z-10"
            aria-label="Add to favorites"
          >
            <Heart 
              className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-700'}`} 
            />
          </button>

          {/* Bottom stats overlay on image: Rating & Prep time */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-xs font-semibold z-10">
            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{item.rating}</span>
              <span className="text-[10px] text-stone-300">({item.ratingCount})</span>
            </div>
            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md text-[11px] text-stone-200">
              <Clock className="w-3 h-3 text-stone-300" />
              <span>{item.prepTime}</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold font-['Outfit',sans-serif] text-base text-stone-900 leading-snug group-hover:text-orange-600 transition-colors">
              {item.name}
            </h3>
          </div>

          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Spice & Calories indicator */}
          <div className="flex items-center gap-3 pt-1 text-[11px] text-stone-500">
            <span className="flex items-center gap-1 font-medium capitalize">
              <Flame className={`w-3.5 h-3.5 ${
                item.spiceLevel === 'hot' ? 'text-red-500' : 
                item.spiceLevel === 'medium' ? 'text-orange-500' : 'text-amber-500'
              }`} />
              {item.spiceLevel} spice
            </span>
            <span>•</span>
            <span>{item.calories} kcal</span>
          </div>
        </div>
      </div>

      {/* Pricing & Add to Cart footer */}
      <div className="p-4 pt-0 flex items-center justify-between border-t border-stone-100 mt-2">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-['Outfit',sans-serif] text-lg font-black text-stone-900">
              ₹{item.price}
            </span>
            {item.originalPrice && (
              <span className="text-xs text-stone-400 line-through">
                ₹{item.originalPrice}
              </span>
            )}
          </div>
          {hasCustomizations && (
            <span className="text-[10px] font-semibold text-orange-600 block">
              Customisable
            </span>
          )}
        </div>

        {/* Interactive Add Button or Quantity Controller */}
        <div>
          {cartQuantity > 0 ? (
            <div className="flex items-center bg-orange-600 text-white rounded-xl shadow-xs overflow-hidden">
              <button
                id={`cart-decrease-${item.id}`}
                onClick={() => onUpdateQuantity(item, -1)}
                className="p-1.5 hover:bg-orange-700 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2.5 text-xs font-bold font-mono">
                {cartQuantity}
              </span>
              <button
                id={`cart-increase-${item.id}`}
                onClick={() => {
                  if (hasCustomizations) {
                    onOpenCustomizer(item);
                  } else {
                    onUpdateQuantity(item, 1);
                  }
                }}
                className="p-1.5 hover:bg-orange-700 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              id={`btn-add-${item.id}`}
              onClick={() => {
                if (hasCustomizations) {
                  onOpenCustomizer(item);
                } else {
                  onAddToCart(item);
                }
              }}
              className="flex items-center gap-1 px-4 py-2 bg-orange-50 hover:bg-orange-600 text-orange-700 hover:text-white border border-orange-200 hover:border-orange-600 rounded-xl text-xs font-bold transition-all shadow-2xs group/btn"
            >
              <span>ADD</span>
              <Plus className="w-3.5 h-3.5 group-hover/btn:rotate-90 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
