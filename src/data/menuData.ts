import { MenuItem, UserProfile } from '../types';

export const CUISINES_LIST = [
  'All',
  'Biryani & Pulao',
  'North Indian Curries',
  'Tandoor & Starters',
  'South Indian Tiffins',
  'Street Food & Chaat',
  'Breads & Rice',
  'Desserts & Chai'
];

export const SAMPLE_MENU: MenuItem[] = [
  {
    id: 'dish-1',
    name: 'Hyderabadi Dum Chicken Biryani',
    category: 'Biryani & Pulao',
    description: 'Slow-cooked fragrant Basmati rice layered with succulent chicken marinated in aged spices, saffron, and fresh mint. Served with Mirchi ka Salan and creamy Burani Raita.',
    price: 349,
    originalPrice: 420,
    diet: 'non-veg',
    spiceLevel: 'hot',
    rating: 4.8,
    ratingCount: 1840,
    prepTime: '25-30 mins',
    calories: 680,
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    isBestseller: true,
    ingredients: ['Basmati Rice', 'Chicken', 'Kashmiri Saffron', 'Fried Onions', 'Mint', 'Ghee'],
    customizationGroups: [
      {
        id: 'portion',
        title: 'Choose Portion Size',
        required: true,
        type: 'single',
        options: [
          { id: 'p-reg', name: 'Regular (Serves 1-2, 2 pc chicken)', price: 0 },
          { id: 'p-large', name: 'Handi Large (Serves 2-3, 4 pc chicken)', price: 160 },
          { id: 'p-family', name: 'Jumbo Family Pack (Serves 4)', price: 340 }
        ]
      },
      {
        id: 'spice',
        title: 'Spice Preference',
        type: 'single',
        options: [
          { id: 'sp-med', name: 'Medium Spicy (Original Nizami Style)', price: 0 },
          { id: 'sp-hot', name: 'Extra Andhra Spicy (Spicy Tadka)', price: 15 }
        ]
      },
      {
        id: 'addons',
        title: 'Add-on Accompaniments',
        type: 'multiple',
        options: [
          { id: 'add-egg', name: 'Extra Boiled Egg (2 pcs)', price: 35 },
          { id: 'add-raita', name: 'Extra Mint Burani Raita (200ml)', price: 30 },
          { id: 'add-salan', name: 'Extra Mirchi Ka Salan (150ml)', price: 40 },
          { id: 'add-gulab', name: 'Angoori Gulab Jamun (2 pcs)', price: 45 }
        ]
      }
    ]
  },
  {
    id: 'dish-2',
    name: 'Paneer Makhani & Butter Naan Meal',
    category: 'North Indian Curries',
    description: 'Cottage cheese simmered in a velvety Kashmiri tomato gravy, infused with fenugreek butter and cashew paste. Paired with 2 crisp tandoori butter naans.',
    price: 289,
    originalPrice: 340,
    diet: 'veg',
    spiceLevel: 'mild',
    rating: 4.7,
    ratingCount: 1420,
    prepTime: '20-25 mins',
    calories: 590,
    imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80',
    isBestseller: true,
    ingredients: ['Malai Paneer', 'Fresh Butter', 'Cashew Cream', 'Kasuri Methi', 'Tomatoes'],
    customizationGroups: [
      {
        id: 'portion',
        title: 'Choose Portion Size',
        required: true,
        type: 'single',
        options: [
          { id: 'p-reg', name: 'Standard Meal (Curry + 2 Naan)', price: 0 },
          { id: 'p-deluxe', name: 'Deluxe Combo (+ Dal Makhani & Jeera Rice)', price: 110 }
        ]
      },
      {
        id: 'bread',
        title: 'Bread Selection',
        type: 'single',
        options: [
          { id: 'br-butter', name: '2 Butter Naan', price: 0 },
          { id: 'br-garlic', name: '2 Garlic Herb Naan', price: 25 },
          { id: 'br-roti', name: '3 Whole Wheat Tandoori Roti', price: 0 }
        ]
      },
      {
        id: 'addons',
        title: 'Add-ons',
        type: 'multiple',
        options: [
          { id: 'add-chutney', name: 'Sirka Onion & Mint Chutney Box', price: 20 },
          { id: 'add-chaas', name: 'Spiced Buttermilk (Chaas 250ml)', price: 35 }
        ]
      }
    ]
  },
  {
    id: 'dish-3',
    name: 'Old Delhi Murgh Makhani (Butter Chicken)',
    category: 'North Indian Curries',
    description: 'Charred clay-oven chicken chunks drenched in a rich tomato, slow-churned butter, and aromatic mace-cardamom gravy. Served with pickled onion relish.',
    price: 360,
    originalPrice: 420,
    diet: 'non-veg',
    spiceLevel: 'medium',
    rating: 4.9,
    ratingCount: 2310,
    prepTime: '20-25 mins',
    calories: 710,
    imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80',
    isChefSpecial: true,
    ingredients: ['Tandoori Chicken', 'Amul Butter', 'Cream', 'Tomato Puree', 'Cardamom'],
    customizationGroups: [
      {
        id: 'portion',
        title: 'Portion Size',
        type: 'single',
        options: [
          { id: 'p-reg', name: 'Boneless (450ml Bowl)', price: 0 },
          { id: 'p-handi', name: 'Full Handi (750ml Bowl)', price: 180 }
        ]
      },
      {
        id: 'addons',
        title: 'Accompaniments',
        type: 'multiple',
        options: [
          { id: 'add-naan', name: 'Flaky Chur Chur Naan', price: 55 },
          { id: 'add-rice', name: 'Steamed Basmati Rice', price: 80 },
          { id: 'add-gulab', name: 'Hot Gulab Jamun (2 pcs)', price: 45 }
        ]
      }
    ]
  },
  {
    id: 'dish-4',
    name: 'Benne Dosa with Aloo Palya & Sambar',
    category: 'South Indian Tiffins',
    description: 'Golden Davangere butter dosa with a crisp crust and soft pillowy center, layered with spiced potato mash, red garlic chutney, coconut chutney and piping hot drumstick sambar.',
    price: 165,
    diet: 'veg',
    spiceLevel: 'medium',
    rating: 4.8,
    ratingCount: 1150,
    prepTime: '15-20 mins',
    calories: 380,
    imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80',
    isBestseller: true,
    ingredients: ['Fermented Rice & Urad Lentils', 'Cultured White Butter', 'Aloo Masala', 'Guntur Chutney'],
    customizationGroups: [
      {
        id: 'dosa-style',
        title: 'Dosa Variant',
        type: 'single',
        options: [
          { id: 'd-classic', name: 'Classic Benne Masala Dosa', price: 0 },
          { id: 'd-cheese', name: 'Loaded Amul Cheese Benne Dosa', price: 45 },
          { id: 'd-podi', name: 'Ghee Gunpowder (Podi) Dosa', price: 30 }
        ]
      },
      {
        id: 'addons',
        title: 'Extra Sides',
        type: 'multiple',
        options: [
          { id: 'add-vada', name: 'Crispy Medu Vada (1 pc)', price: 35 },
          { id: 'add-filter-coffee', name: 'Degree Filter Coffee (Hot 150ml)', price: 40 },
          { id: 'add-sambar', name: 'Extra Madras Sambar (250ml)', price: 25 }
        ]
      }
    ]
  },
  {
    id: 'dish-5',
    name: 'Amritsari Kulcha & Pindi Chole Thali',
    category: 'North Indian Curries',
    description: 'Tandoor-baked flaky potato and onion stuffed kulcha topped with coriander and kalonji, served with tangy dark-spiced chickpeas, pickled green chilies and tamarind chutney.',
    price: 245,
    originalPrice: 290,
    diet: 'veg',
    spiceLevel: 'hot',
    rating: 4.6,
    ratingCount: 890,
    prepTime: '20 mins',
    calories: 520,
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80',
    ingredients: ['Kabuli Chana', 'Anardana (Pomegranate)', 'Stuffed Kulcha', 'Spiced Butter'],
    customizationGroups: [
      {
        id: 'portion',
        title: 'Thali Option',
        type: 'single',
        options: [
          { id: 'k-reg', name: '2 Amritsari Aloo Pyaaz Kulcha Thali', price: 0 },
          { id: 'k-paneer', name: '2 Paneer Stuffed Kulcha Thali', price: 50 }
        ]
      },
      {
        id: 'addons',
        title: 'Add-ons',
        type: 'multiple',
        options: [
          { id: 'add-lassi', name: 'Sweet Malai Lassi (300ml earthen kulhad)', price: 55 },
          { id: 'add-boondi', name: 'Crispy Boondi Raita', price: 30 }
        ]
      }
    ]
  },
  {
    id: 'dish-6',
    name: 'Tandoori Malai Chicken Tikka (6 pcs)',
    category: 'Tandoor & Starters',
    description: 'Boneless chicken morsels steeped in hung curd, green cardamom, roasted cumin, and rich dairy cream, char-grilled in a clay tandoor. Served with mint dip and lachha onion.',
    price: 320,
    originalPrice: 380,
    diet: 'non-veg',
    spiceLevel: 'mild',
    rating: 4.9,
    ratingCount: 1670,
    prepTime: '20-25 mins',
    calories: 460,
    imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80',
    isChefSpecial: true,
    ingredients: ['Chicken Thigh', 'Hung Yogurt', 'Cashew Cream', 'Mace', 'Mint Sauce'],
    customizationGroups: [
      {
        id: 'portion',
        title: 'Portion Size',
        type: 'single',
        options: [
          { id: 'p-6', name: 'Half Plate (6 pcs)', price: 0 },
          { id: 'p-12', name: 'Full Platter (12 pcs)', price: 270 }
        ]
      },
      {
        id: 'addons',
        title: 'Sides',
        type: 'multiple',
        options: [
          { id: 'add-rumali', name: 'Soft Rumali Roti (2 pcs)', price: 40 },
          { id: 'add-mayo', name: 'Tandoori Dip & Green Chutney', price: 25 }
        ]
      }
    ]
  },
  {
    id: 'dish-7',
    name: 'Mumbai Special Pav Bhaji (Double Butter)',
    category: 'Street Food & Chaat',
    description: 'Chowpatty style mashed vegetable blend stewed with tomatoes, green peas, and fragrant pav bhaji masala, crowned with a slab of butter and 3 toasted soft ladi pavs.',
    price: 195,
    diet: 'veg',
    spiceLevel: 'medium',
    rating: 4.7,
    ratingCount: 2150,
    prepTime: '15-20 mins',
    calories: 440,
    imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&auto=format&fit=crop&q=80',
    isBestseller: true,
    ingredients: ['Potatoes', 'Green Peas', 'Capsicum', 'Amul Butter', 'Toasted Pav'],
    customizationGroups: [
      {
        id: 'style',
        title: 'Preparation Style',
        type: 'single',
        options: [
          { id: 'p-classic', name: 'Classic Pav Bhaji (Extra Butter)', price: 0 },
          { id: 'p-cheese', name: 'Grated Amul Cheese Pav Bhaji', price: 40 }
        ]
      },
      {
        id: 'addons',
        title: 'Add Extra Pav / Sides',
        type: 'multiple',
        options: [
          { id: 'add-pav', name: 'Extra Butter Ladi Pav (2 pcs)', price: 30 },
          { id: 'add-gulab', name: 'Warm Gulab Jamun (1 pc)', price: 25 }
        ]
      }
    ]
  },
  {
    id: 'dish-8',
    name: 'Dal Makhani Bukhara Style (Slow 24h Simmered)',
    category: 'North Indian Curries',
    description: 'Whole black urad lentils and rajma slow-simmered for 24 hours on gentle charcoal embers, finished with farm butter and dairy cream. Velvety perfection.',
    price: 260,
    diet: 'veg',
    spiceLevel: 'mild',
    rating: 4.9,
    ratingCount: 1920,
    prepTime: '15-20 mins',
    calories: 480,
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
    isChefSpecial: true,
    ingredients: ['Black Urad Dal', 'Kashmiri Chili', 'Slow-cooked Butter', 'Garlic Puree'],
    customizationGroups: [
      {
        id: 'addons',
        title: 'Add Breads / Rice',
        type: 'multiple',
        options: [
          { id: 'add-jeera-rice', name: 'Jeera Ghee Rice', price: 90 },
          { id: 'add-garlic-naan', name: 'Garlic Butter Naan', price: 50 },
          { id: 'add-sirka', name: 'Sirka Onion & Chutney', price: 20 }
        ]
      }
    ]
  },
  {
    id: 'dish-9',
    name: 'Kolkata Kathi Chicken Egg Roll',
    category: 'Street Food & Chaat',
    description: 'Paratha layered with farm egg, rolled with smokey tandoori chicken chunks, sliced red onions, green chili relish, and freshly squeezed lemon.',
    price: 180,
    originalPrice: 210,
    diet: 'non-veg',
    spiceLevel: 'hot',
    rating: 4.6,
    ratingCount: 780,
    prepTime: '15 mins',
    calories: 410,
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80',
    ingredients: ['Flaky Paratha', 'Egg', 'Chicken Tikka', 'Chili Lemon Relish'],
    customizationGroups: [
      {
        id: 'roll-type',
        title: 'Customize Your Roll',
        type: 'single',
        options: [
          { id: 'r-single', name: 'Single Egg, Single Chicken Roll', price: 0 },
          { id: 'r-double', name: 'Double Egg, Double Chicken Monster Roll', price: 60 }
        ]
      },
      {
        id: 'addons',
        title: 'Extra Toppings',
        type: 'multiple',
        options: [
          { id: 'add-cheese-slice', name: 'Melted Cheese Slice', price: 30 },
          { id: 'add-mayo-chutney', name: 'Spicy Mint Mayo Dip', price: 20 }
        ]
      }
    ]
  },
  {
    id: 'dish-10',
    name: 'Paneer Tikka Angara (Tandoori Kebabs)',
    category: 'Tandoor & Starters',
    description: 'Fresh paneer cubes, bell peppers and onions marinated in stone-ground mustard, carom seeds (ajwain), and red chilies, roasted over smoky coal.',
    price: 275,
    originalPrice: 320,
    diet: 'veg',
    spiceLevel: 'hot',
    rating: 4.7,
    ratingCount: 940,
    prepTime: '20 mins',
    calories: 390,
    imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&auto=format&fit=crop&q=80',
    ingredients: ['Cottage Cheese', 'Bell Peppers', 'Mustard Oil', 'Kasuri Methi', 'Ajwain'],
    customizationGroups: [
      {
        id: 'addons',
        title: 'Pair with Breads / Dips',
        type: 'multiple',
        options: [
          { id: 'add-rumali', name: 'Tandoori Roti (2 pcs)', price: 35 },
          { id: 'add-chutney-jar', name: 'Extra Mint Yogurt Dip', price: 25 }
        ]
      }
    ]
  },
  {
    id: 'dish-11',
    name: 'Kesar Pista Gulab Jamun & Rabdi Duo',
    category: 'Desserts & Chai',
    description: 'Two warm, syrup-soaked khoya gulab jamuns dunked in chilled saffron-pistachio thickened rabdi. Royal Indian dessert decadence.',
    price: 150,
    diet: 'veg',
    spiceLevel: 'mild',
    rating: 4.9,
    ratingCount: 1530,
    prepTime: '10 mins',
    calories: 340,
    imageUrl: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=800&auto=format&fit=crop&q=80',
    isBestseller: true,
    ingredients: ['Khoya', 'Kesar (Saffron)', 'Pistachios', 'Condensed Milk'],
    customizationGroups: [
      {
        id: 'portion',
        title: 'Portion',
        type: 'single',
        options: [
          { id: 'ds-single', name: 'Single Serving (2 Gulab Jamun + Rabdi)', price: 0 },
          { id: 'ds-double', name: 'Double Feast (4 Gulab Jamun + Rabdi)', price: 110 }
        ]
      }
    ]
  },
  {
    id: 'dish-12',
    name: 'Royal Alphonso Mango Lassi (400ml)',
    category: 'Desserts & Chai',
    description: 'Pure Ratnagiri Alphonso mango pulp churned with farm yogurt, cardamom, and a touch of saffron, garnished with chopped pistachios.',
    price: 120,
    diet: 'veg',
    spiceLevel: 'mild',
    rating: 4.8,
    ratingCount: 1320,
    prepTime: '5-10 mins',
    calories: 260,
    imageUrl: 'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?w=800&auto=format&fit=crop&q=80',
    isBestseller: true,
    ingredients: ['Alphonso Mango', 'Thick Curd', 'Cardamom', 'Kesar', 'Pista'],
    customizationGroups: [
      {
        id: 'sweetness',
        title: 'Sweetness Level',
        type: 'single',
        options: [
          { id: 'sw-normal', name: 'Regular Sweet', price: 0 },
          { id: 'sw-low', name: 'Low Sugar / Mild Sweet', price: 0 }
        ]
      }
    ]
  }
];

export const DEMO_USERS: UserProfile[] = [
  {
    userId: 'skhan_c',
    displayName: 'Md. Shahariyar Khan',
    phone: '+91 98765 43210',
    email: 'skhan@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    foodCoins: 380,
    defaultAddress: {
      tag: 'Home',
      flat: 'Flat 402, Lotus Residency',
      street: '12th Main Road, 4th Block Koramangala',
      city: 'Bengaluru',
      pincode: '560034'
    }
  },
  {
    userId: 'priya_foodie',
    displayName: 'Priya Sharma',
    phone: '+91 98123 78901',
    email: 'priya.s@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    foodCoins: 210,
    defaultAddress: {
      tag: 'Work',
      flat: 'Building 7, Cyber Gateway',
      street: 'HITEC City, Madhapur',
      city: 'Hyderabad',
      pincode: '500081'
    }
  },
  {
    userId: 'rohit_chef',
    displayName: 'Rohit Verma',
    phone: '+91 99887 66554',
    email: 'rohit.v@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    foodCoins: 450,
    defaultAddress: {
      tag: 'Home',
      flat: 'Villa 14, Palm Meadows',
      street: 'Near Barakhamba Road, Connaught Place',
      city: 'New Delhi',
      pincode: '110001'
    }
  }
];

export const AVAILABLE_COUPONS = [
  {
    code: 'FOODHUB50',
    title: '50% OFF up to ₹120',
    description: 'Valid on orders above ₹199',
    minOrder: 199,
    discountPercent: 50,
    maxDiscount: 120
  },
  {
    code: 'FEAST100',
    title: 'Flat ₹100 OFF',
    description: 'Valid on orders above ₹399',
    minOrder: 399,
    discountFixed: 100
  },
  {
    code: 'FREEDEL',
    title: 'Free Delivery',
    description: 'Free courier fee on your meal',
    minOrder: 149,
    freeDelivery: true
  }
];
