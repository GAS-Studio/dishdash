export type IngredientCategory = {
  label: string;
  emoji: string;
  ingredients: string[];
};

export const INGREDIENT_CATEGORIES: IngredientCategory[] = [
  {
    label: 'Vegetables',
    emoji: '🥦',
    ingredients: [
      'tomato', 'onion', 'capsicum', 'bhindi', 'bottle gourd', 'carrot',
      'cucumber', 'beetroot', 'brinjal', 'cluster beans', 'baby potatoes',
      'cherry tomatoes', 'green chilli', 'green peas', 'potato',
      'fresh methi', 'mixed vegetables',
    ],
  },
  {
    label: 'Dairy',
    emoji: '🧀',
    ingredients: [
      'paneer', 'butter', 'ghee', 'fresh cream', 'yoghurt', 'buttermilk',
      'cheese', 'milk',
    ],
  },
  {
    label: 'Grains & Lentils',
    emoji: '🌾',
    ingredients: [
      'basmati rice', 'raw rice', 'poha', 'semolina', 'whole wheat flour',
      'all-purpose flour', 'besan', 'ragi flour', 'cornflour',
      'chana dal', 'toor dal', 'urad dal', 'yellow moong dal',
      'whole green moong dal', 'rajma', 'kabuli chana', 'kala chana',
      'idli batter', 'dosa batter', 'roasted vermicelli',
    ],
  },
  {
    label: 'Proteins',
    emoji: '🥚',
    ingredients: [
      'egg', 'eggs', 'soya chunks', 'mixed sprouts', 'peanuts', 'cashews',
    ],
  },
  {
    label: 'Herbs & Fresh',
    emoji: '🌿',
    ingredients: [
      'ginger', 'garlic', 'curry leaves', 'fresh coriander',
      'lemon juice', 'tamarind', 'pomegranate seeds',
    ],
  },
  {
    label: 'Spices',
    emoji: '🌶️',
    ingredients: [
      'cumin seeds', 'mustard seeds', 'turmeric', 'red chilli powder',
      'coriander powder', 'garam masala', 'kasuri methi', 'kashmiri red chilli',
      'ajwain', 'amchur', 'asafoetida', 'bay leaf', 'cardamom', 'cinnamon',
      'cloves', 'fennel powder', 'fenugreek seeds', 'black pepper',
      'sambhar powder',
    ],
  },
  {
    label: 'Pantry Staples',
    emoji: '🫙',
    ingredients: [
      'oil', 'salt', 'sugar', 'jaggery', 'baking powder', 'baking soda',
      'eno fruit salt', 'sev', 'water',
    ],
  },
];
