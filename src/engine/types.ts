export type Region =
  | 'south-asia'
  | 'southeast-asia'
  | 'east-asia'
  | 'middle-east'
  | 'mediterranean'
  | 'caucasus-eastern-europe'
  | 'africa'
  | 'latin-america'
  | 'caribbean'
  | 'north-america';

export type Format =
  | 'soup'
  | 'stew'
  | 'bowl'
  | 'noodles'
  | 'dumpling'
  | 'handheld'
  | 'bread'
  | 'plate'
  | 'grill'
  | 'salad';

export type Texture = 'crunchy' | 'creamy' | 'chewy' | 'brothy' | 'tender' | 'fresh';

// What a typical restaurant version usually contains, including hidden ingredients
// such as fish sauce or soy sauce. Deliberately cautious.
export type ContainsTag =
  | 'pork'
  | 'beef'
  | 'meat'
  | 'poultry'
  | 'fish'
  | 'shellfish'
  | 'egg'
  | 'dairy'
  | 'gluten'
  | 'peanut'
  | 'tree-nut'
  | 'sesame'
  | 'soy'
  | 'alcohol';

// Ingredients people often dislike. Unlike allergens these are soft preferences.
export type Notable =
  | 'mushrooms'
  | 'cilantro'
  | 'olives'
  | 'eggplant'
  | 'coconut'
  | 'okra'
  | 'raw-fish'
  | 'organ-meat'
  | 'raw-onion'
  | 'blue-cheese';

export type Dish = {
  id: string;
  name: string;
  cuisine: string;
  region: Region;
  blurb: string;
  richness: 1 | 2 | 3 | 4 | 5;
  heat: 0 | 1 | 2 | 3 | 4;
  size: 1 | 2 | 3 | 4 | 5;
  price: 1 | 2 | 3;
  familiarity: 1 | 2 | 3 | 4 | 5;
  format: Format;
  mainIngredient: string;
  texture: Texture;
  searchName: string;
  contains: ContainsTag[];
  notable: Notable[];
  subregion?: string; // e.g. Kerala, shown next to the cuisine
};

export type Settings = {
  tired: string[];
  restrictions: string[];
  dislikes?: string[];
  hunger: number; // 1-5
  budget: number; // 1-3
  adventure: number; // 1-3
  light?: number; // 1 keep it light, 2 no preference
};

export type ReasonId =
  | 'too-heavy'
  | 'not-filling'
  | 'too-spicy'
  | 'too-pricey'
  | 'too-unfamiliar'
  | 'ingredient'
  | 'too-similar'
  | 'not-feeling';

export type Constraints = {
  maxRichness?: number;
  minSize?: number;
  maxHeat?: number;
  maxPrice?: number;
  minFamiliarity?: number;
  excludedIngredients: string[];
  excludedFormats: string[];
  avoidedNotables: string[];
  penalizedTextures: string[];
  penalizedCuisines: string[];
  noveltyBoost: number;
};

export type Session = Settings & {
  seed: number;
  recentlyAccepted: string[];
  rejected: ReadonlySet<string>;
  constraints: Constraints;
  consecutiveNos: number;
  shown: number;
};
