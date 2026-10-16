import React from 'react';
import { CUISINES_LIST } from '../data/menuData';
import { 
  Search, 
  SlidersHorizontal, 
  Flame, 
  Star, 
  RotateCcw, 
  Sparkles, 
  Check
} from 'lucide-react';

export interface FilterState {
  searchQuery: string;
  selectedCuisine: string;
  diet: 'all' | 'veg' | 'non-veg';
  spiceLevel: 'all' | 'mild' | 'medium' | 'hot';
  minRating: number; // 0, 4.0, 4.5
  priceRange: 'all' | 'under-200' | '200-350' | 'above-350';
  sortBy: 'recommended' | 'rating' | 'price-asc' | 'price-desc' | 'delivery-time';
  offersOnly: boolean;
}

interface MenuFilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  totalResults: number;
}

export const MenuFilterBar: React.FC<MenuFilterBarProps> = ({
  filters,
  onChange,
  totalResults,
}) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const update = (partial: Partial<FilterState>) => {
    onChange({ ...filters, ...partial });
  };

  const hasActiveFilters = 
    filters.searchQuery !== '' ||
    filters.selectedCuisine !== 'All' ||
    filters.diet !== 'all' ||
    filters.spiceLevel !== 'all' ||
    filters.minRating > 0 ||
    filters.priceRange !== 'all' ||
    filters.sortBy !== 'recommended' ||
    filters.offersOnly;

  const resetFilters = () => {
    onChange({
      searchQuery: '',
      selectedCuisine: 'All',
      diet: 'all',
      spiceLevel: 'all',
      minRating: 0,
      priceRange: 'all',
      sortBy: 'recommended',
      offersOnly: false,
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Search & Primary Quick Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="menu-search-input"
            type="text"
            placeholder="Search for biryani, butter chicken, dosa, paneer..."
            value={filters.searchQuery}
            onChange={(e) => update({ searchQuery: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-2xs"
          />
          {filters.searchQuery && (
            <button
              onClick={() => update({ searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick Diet Pills (Veg, Non-Veg) & Filter Drawer Toggle */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {/* Pure Veg Pill */}
          <button
            id="filter-diet-veg"
            onClick={() => update({ diet: filters.diet === 'veg' ? 'all' : 'veg' })}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap ${
              filters.diet === 'veg'
                ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-2xs'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            <span className="w-3.5 h-3.5 border-2 border-emerald-600 flex items-center justify-center rounded-xs p-[2px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            </span>
            <span>Pure Veg</span>
          </button>

          {/* Non-Veg Pill */}
          <button
            id="filter-diet-nonveg"
            onClick={() => update({ diet: filters.diet === 'non-veg' ? 'all' : 'non-veg' })}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap ${
              filters.diet === 'non-veg'
                ? 'bg-rose-50 border-rose-600 text-rose-900 shadow-2xs'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            <span className="w-3.5 h-3.5 border-2 border-rose-600 flex items-center justify-center rounded-xs p-[2px]">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            </span>
            <span>Non-Veg</span>
          </button>

          {/* Offers only pill */}
          <button
            id="filter-offers-toggle"
            onClick={() => update({ offersOnly: !filters.offersOnly })}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap ${
              filters.offersOnly
                ? 'bg-amber-50 border-amber-500 text-amber-900'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Offers %</span>
          </button>

          {/* Toggle More Filters */}
          <button
            id="toggle-advanced-filters-btn"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap ${
              showAdvanced || filters.spiceLevel !== 'all' || filters.minRating > 0 || filters.priceRange !== 'all'
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          {hasActiveFilters && (
            <button
              id="reset-filters-btn"
              onClick={resetFilters}
              title="Reset all filters"
              className="p-2 rounded-xl border border-stone-200 hover:bg-rose-50 text-stone-500 hover:text-rose-600 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Cuisine Horizontal Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {CUISINES_LIST.map((cuisine) => {
          const isSelected = filters.selectedCuisine === cuisine;
          return (
            <button
              key={cuisine}
              id={`cuisine-chip-${cuisine.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => update({ selectedCuisine: cuisine })}
              className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-stone-900 text-white shadow-2xs font-semibold'
                  : 'bg-stone-100 hover:bg-stone-200/80 text-stone-700'
              }`}
            >
              {cuisine}
            </button>
          );
        })}
      </div>

      {/* Expandable Advanced Filter Panel */}
      {showAdvanced && (
        <div 
          id="advanced-filters-drawer"
          className="p-4 bg-white rounded-2xl border border-stone-200/90 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            {/* Spice Level */}
            <div>
              <label className="font-bold text-stone-700 uppercase tracking-wider block mb-2 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                Spice Level
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Any', val: 'all' },
                  { label: 'Mild 🌶️', val: 'mild' },
                  { label: 'Medium 🌶️🌶️', val: 'medium' },
                  { label: 'Hot 🌶️🌶️🌶️', val: 'hot' },
                ].map((s) => (
                  <button
                    key={s.val}
                    onClick={() => update({ spiceLevel: s.val as FilterState['spiceLevel'] })}
                    className={`px-2.5 py-1.5 rounded-lg border font-medium ${
                      filters.spiceLevel === s.val
                        ? 'bg-orange-600 text-white border-orange-600'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="font-bold text-stone-700 uppercase tracking-wider block mb-2 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                Customer Rating
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'All', val: 0 },
                  { label: '4.0+ ★', val: 4.0 },
                  { label: '4.5+ ★', val: 4.5 },
                  { label: '4.8+ ★', val: 4.8 },
                ].map((r) => (
                  <button
                    key={r.val}
                    onClick={() => update({ minRating: r.val })}
                    className={`px-2.5 py-1.5 rounded-lg border font-medium ${
                      filters.minRating === r.val
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range (in ₹ INR) */}
            <div>
              <label className="font-bold text-stone-700 uppercase tracking-wider block mb-2">
                Price (₹ INR)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'All', val: 'all' },
                  { label: 'Under ₹200', val: 'under-200' },
                  { label: '₹200 - ₹350', val: '200-350' },
                  { label: '₹350+', val: 'above-350' },
                ].map((p) => (
                  <button
                    key={p.val}
                    onClick={() => update({ priceRange: p.val as FilterState['priceRange'] })}
                    className={`px-2.5 py-1.5 rounded-lg border font-medium ${
                      filters.priceRange === p.val
                        ? 'bg-stone-800 text-white border-stone-800'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sorting */}
            <div>
              <label className="font-bold text-stone-700 uppercase tracking-wider block mb-2">
                Sort By
              </label>
              <select
                id="sort-select"
                value={filters.sortBy}
                onChange={(e) => update({ sortBy: e.target.value as FilterState['sortBy'] })}
                className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 text-stone-800"
              >
                <option value="recommended">Chef's Recommended</option>
                <option value="rating">Top Rated (Highest First)</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="delivery-time">Fastest Preparation</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-500">
            <span>Showing {totalResults} delicious dishes matching your filters</span>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-orange-600 hover:text-orange-700 font-semibold"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
