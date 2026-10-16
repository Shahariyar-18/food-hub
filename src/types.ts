export type DietType = 'veg' | 'non-veg' | 'vegan';
export type SpiceLevel = 'mild' | 'medium' | 'hot' | 'extra-hot';

export interface CustomizationOption {
  id: string;
  name: string;
  price: number; // in INR
}

export interface CustomizationGroup {
  id: string;
  title: string;
  required?: boolean;
  type: 'single' | 'multiple';
  options: CustomizationOption[];
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number; // in INR
  originalPrice?: number;
  diet: DietType;
  spiceLevel: SpiceLevel;
  rating: number;
  ratingCount: number;
  prepTime: string; // e.g. "20-25 mins"
  calories: number;
  imageUrl: string;
  isBestseller?: boolean;
  isChefSpecial?: boolean;
  customizationGroups?: CustomizationGroup[];
  ingredients?: string[];
}

export interface SelectedCustomization {
  groupId: string;
  groupTitle: string;
  optionId: string;
  optionName: string;
  price: number;
}

export interface CartItem {
  cartItemId: string; // unique item id including options
  menuItem: MenuItem;
  quantity: number;
  selectedPortion?: CustomizationOption;
  selectedAddons: CustomizationOption[];
  cookingInstructions?: string;
  itemTotalPrice: number;
}

export type OrderStage = 
  | 'confirmed' 
  | 'preparing' 
  | 'picked_up' 
  | 'on_the_way' 
  | 'delivered';

export interface DeliveryPartner {
  name: string;
  phone: string;
  rating: number;
  totalDeliveries: number;
  vehicle: string;
  photoUrl: string;
  temperature: string;
  currentLatPercent: number; // 0-100% on simulated path
}

export interface Order {
  id: string;
  items: CartItem[];
  itemTotal: number;
  deliveryFee: number;
  packagingFee: number;
  gstTax: number;
  tipAmount: number;
  discountAmount: number;
  couponCode?: string;
  grandTotal: number;
  placedAt: string;
  estimatedDeliveryTime: string;
  status: OrderStage;
  deliveryAddress: {
    tag: string;
    flat: string;
    street: string;
    city: string;
    pincode: string;
  };
  deliveryPartner: DeliveryPartner;
  deliveryPin: string;
  paymentMethod: 'UPI' | 'Cash on Delivery' | 'Card / Net Banking';
}

export interface UserProfile {
  userId: string;
  displayName: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  foodCoins: number;
  defaultAddress: {
    tag: string;
    flat: string;
    street: string;
    city: string;
    pincode: string;
  };
}
