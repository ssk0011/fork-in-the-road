import type { Dish, Region } from '../engine/types';

type Row = Omit<Dish, 'id' | 'cuisine' | 'region' | 'searchName'> & { searchName?: string };

function slug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function group(cuisine: string, region: Region, rows: Row[]): Dish[] {
  return rows.map((row) => ({
    ...row,
    id: slug(row.name),
    cuisine,
    region,
    searchName: row.searchName ?? row.name,
  }));
}

export const DISHES: readonly Dish[] = [
  ...group('Indian', 'south-asia', [
    { name: 'Masala Dosa', blurb: 'A huge crisp rice crepe wrapped around spiced potatoes.', richness: 3, heat: 2, size: 3, price: 1, familiarity: 3, format: 'plate', mainIngredient: 'potato', texture: 'crunchy' },
    { name: 'Chana Masala', blurb: 'Chickpeas simmered in a tangy, spiced tomato gravy.', richness: 3, heat: 2, size: 4, price: 1, familiarity: 4, format: 'stew', mainIngredient: 'chickpeas', texture: 'tender' },
    { name: 'Butter Chicken', blurb: 'Tender chicken in a mild, creamy tomato sauce.', richness: 5, heat: 1, size: 4, price: 2, familiarity: 5, format: 'stew', mainIngredient: 'chicken', texture: 'creamy' },
    { name: 'Pani Puri', blurb: 'Hollow crisp shells you fill with spiced water and eat in one bite.', richness: 1, heat: 2, size: 1, price: 1, familiarity: 2, format: 'handheld', mainIngredient: 'potato', texture: 'crunchy' },
  ]),
  ...group('Nepali/Tibetan', 'south-asia', [
    { name: 'Momo', blurb: 'Plump steamed dumplings served with a bright tomato chutney.', richness: 2, heat: 2, size: 3, price: 1, familiarity: 3, format: 'dumpling', mainIngredient: 'chicken', texture: 'tender', searchName: 'Nepali momo' },
    { name: 'Thukpa', blurb: 'A warming noodle soup with vegetables and gentle spice.', richness: 2, heat: 1, size: 4, price: 1, familiarity: 1, format: 'noodles', mainIngredient: 'wheat noodles', texture: 'brothy' },
    { name: 'Dal Bhat', blurb: 'Lentil soup, rice and vegetable sides served together on one tray.', richness: 2, heat: 1, size: 5, price: 1, familiarity: 1, format: 'plate', mainIngredient: 'lentils', texture: 'tender' },
  ]),
  ...group('Thai', 'southeast-asia', [
    { name: 'Som Tam', blurb: 'Shredded green papaya pounded with lime, chili and peanuts.', richness: 1, heat: 4, size: 2, price: 1, familiarity: 3, format: 'salad', mainIngredient: 'green papaya', texture: 'crunchy' },
    { name: 'Pad Kra Pao', blurb: 'Stir-fried ground meat with chilies and holy basil, over rice.', richness: 3, heat: 3, size: 4, price: 1, familiarity: 3, format: 'bowl', mainIngredient: 'pork', texture: 'tender' },
    { name: 'Khao Soi', blurb: 'Coconut curry noodle soup topped with crispy fried noodles.', richness: 4, heat: 2, size: 4, price: 2, familiarity: 2, format: 'noodles', mainIngredient: 'egg noodles', texture: 'creamy' },
  ]),
  ...group('Vietnamese', 'southeast-asia', [
    { name: 'Goi Cuon', blurb: 'Soft rice paper rolls of shrimp, herbs and noodles, served cool.', richness: 1, heat: 0, size: 2, price: 1, familiarity: 4, format: 'handheld', mainIngredient: 'shrimp', texture: 'fresh', searchName: 'Vietnamese summer rolls' },
    { name: 'Banh Mi', blurb: 'A crackly baguette stuffed with savory meat, pickles and herbs.', richness: 2, heat: 1, size: 3, price: 1, familiarity: 4, format: 'handheld', mainIngredient: 'pork', texture: 'crunchy' },
    { name: 'Bun Bo Hue', blurb: 'A spicy, lemongrass-scented beef soup with thick round noodles.', richness: 3, heat: 3, size: 5, price: 2, familiarity: 2, format: 'noodles', mainIngredient: 'beef', texture: 'brothy' },
  ]),
  ...group('Malaysian/Indonesian', 'southeast-asia', [
    { name: 'Gado-Gado', blurb: 'Vegetables, tofu and egg with a warm peanut dressing.', richness: 3, heat: 1, size: 3, price: 1, familiarity: 1, format: 'salad', mainIngredient: 'tofu', texture: 'crunchy' },
    { name: 'Nasi Goreng', blurb: 'Smoky sweet fried rice, usually crowned with a fried egg.', richness: 3, heat: 2, size: 4, price: 1, familiarity: 3, format: 'bowl', mainIngredient: 'rice', texture: 'chewy' },
    { name: 'Beef Rendang', blurb: 'Beef slow-cooked in coconut and spices until nearly dry and deep.', richness: 5, heat: 3, size: 5, price: 2, familiarity: 2, format: 'stew', mainIngredient: 'beef', texture: 'tender' },
  ]),
  ...group('Filipino', 'southeast-asia', [
    { name: 'Lumpia', blurb: 'Thin, crisp fried spring rolls made for dipping.', richness: 3, heat: 0, size: 2, price: 1, familiarity: 3, format: 'handheld', mainIngredient: 'pork', texture: 'crunchy', searchName: 'Filipino lumpia' },
    { name: 'Chicken Adobo', blurb: 'Chicken braised in vinegar, soy, garlic and bay.', richness: 3, heat: 0, size: 4, price: 1, familiarity: 3, format: 'stew', mainIngredient: 'chicken', texture: 'tender', searchName: 'Filipino chicken adobo' },
    { name: 'Sinigang', blurb: 'A puckery tamarind soup with pork and vegetables.', richness: 2, heat: 1, size: 4, price: 2, familiarity: 1, format: 'soup', mainIngredient: 'pork', texture: 'brothy' },
  ]),
  ...group('Chinese', 'east-asia', [
    { name: 'Xiao Long Bao', blurb: 'Delicate steamed dumplings with hot soup sealed inside.', richness: 3, heat: 0, size: 2, price: 2, familiarity: 3, format: 'dumpling', mainIngredient: 'pork', texture: 'brothy' },
    { name: 'Mapo Tofu', blurb: 'Silky tofu in a fiery, tingly Sichuan chili sauce.', richness: 3, heat: 4, size: 3, price: 1, familiarity: 3, format: 'stew', mainIngredient: 'tofu', texture: 'tender' },
    { name: 'Cantonese Roast Duck', blurb: 'Lacquered duck with crackling skin, served with rice.', richness: 4, heat: 0, size: 4, price: 3, familiarity: 3, format: 'plate', mainIngredient: 'duck', texture: 'tender' },
  ]),
  ...group('Japanese', 'east-asia', [
    { name: 'Onigiri', blurb: 'A rice ball with a savory filling, wrapped in seaweed.', richness: 1, heat: 0, size: 1, price: 1, familiarity: 3, format: 'handheld', mainIngredient: 'rice', texture: 'chewy' },
    { name: 'Okonomiyaki', blurb: 'A savory cabbage pancake with tangy sauce and mayo.', richness: 4, heat: 0, size: 4, price: 2, familiarity: 2, format: 'plate', mainIngredient: 'cabbage', texture: 'tender' },
    { name: 'Chirashi', blurb: 'A bowl of seasoned rice scattered with slices of raw fish.', richness: 2, heat: 0, size: 3, price: 3, familiarity: 2, format: 'bowl', mainIngredient: 'raw fish', texture: 'fresh' },
    { name: 'Tonkotsu Ramen', blurb: 'Noodles in a silky, long-simmered pork broth.', richness: 5, heat: 1, size: 5, price: 2, familiarity: 5, format: 'noodles', mainIngredient: 'pork', texture: 'brothy' },
  ]),
  ...group('Korean', 'east-asia', [
    { name: 'Tteokbokki', blurb: 'Chewy rice cakes in a sweet, spicy red chili sauce.', richness: 3, heat: 3, size: 2, price: 1, familiarity: 3, format: 'stew', mainIngredient: 'rice cakes', texture: 'chewy' },
    { name: 'Bibimbap', blurb: 'Rice topped with vegetables, egg and chili paste, mixed at the table.', richness: 2, heat: 2, size: 4, price: 2, familiarity: 4, format: 'bowl', mainIngredient: 'rice', texture: 'crunchy' },
    { name: 'Sundubu Jjigae', blurb: 'A bubbling, spicy stew of very soft tofu.', richness: 2, heat: 3, size: 4, price: 2, familiarity: 2, format: 'stew', mainIngredient: 'tofu', texture: 'brothy' },
    { name: 'Galbi', blurb: 'Sweet soy-marinated short ribs grilled over high heat.', richness: 4, heat: 0, size: 5, price: 3, familiarity: 3, format: 'grill', mainIngredient: 'beef', texture: 'tender', searchName: 'Korean galbi' },
  ]),
  ...group('Georgian', 'caucasus-eastern-europe', [
    { name: 'Khachapuri', blurb: 'Boat-shaped bread filled with molten cheese and a runny egg.', richness: 5, heat: 0, size: 4, price: 2, familiarity: 1, format: 'bread', mainIngredient: 'cheese', texture: 'chewy' },
    { name: 'Khinkali', blurb: 'Big pleated dumplings full of spiced broth and meat.', richness: 3, heat: 1, size: 3, price: 2, familiarity: 1, format: 'dumpling', mainIngredient: 'beef', texture: 'brothy' },
    { name: 'Badrijani Nigvzit', blurb: 'Eggplant slices rolled around a garlicky walnut paste.', richness: 3, heat: 1, size: 1, price: 2, familiarity: 1, format: 'plate', mainIngredient: 'eggplant', texture: 'creamy', searchName: 'Georgian eggplant walnut rolls' },
  ]),
  ...group('Turkish', 'middle-east', [
    { name: 'Lahmacun', blurb: 'Thin flatbread with spiced minced lamb, rolled up with herbs and lemon.', richness: 2, heat: 1, size: 2, price: 1, familiarity: 1, format: 'bread', mainIngredient: 'lamb', texture: 'crunchy' },
    { name: 'Iskender Kebab', blurb: 'Sliced doner over bread with tomato sauce, yogurt and hot butter.', richness: 5, heat: 1, size: 5, price: 2, familiarity: 2, format: 'plate', mainIngredient: 'lamb', texture: 'tender' },
    { name: 'Mercimek Corbasi', blurb: 'A smooth red lentil soup brightened with lemon.', richness: 2, heat: 1, size: 2, price: 1, familiarity: 2, format: 'soup', mainIngredient: 'lentils', texture: 'creamy', searchName: 'Turkish red lentil soup' },
  ]),
  ...group('Lebanese', 'middle-east', [
    { name: 'Fattoush', blurb: 'A lemony chopped salad with shards of toasted pita.', richness: 1, heat: 0, size: 2, price: 1, familiarity: 3, format: 'salad', mainIngredient: 'pita', texture: 'crunchy' },
    { name: 'Falafel Wrap', blurb: 'Crisp herby chickpea fritters in flatbread with tahini sauce.', richness: 3, heat: 1, size: 3, price: 1, familiarity: 5, format: 'handheld', mainIngredient: 'chickpeas', texture: 'crunchy' },
    { name: 'Shish Tawook', blurb: 'Garlic and yogurt marinated chicken skewers off the grill.', richness: 2, heat: 0, size: 4, price: 2, familiarity: 3, format: 'grill', mainIngredient: 'chicken', texture: 'tender' },
  ]),
  ...group('Greek', 'mediterranean', [
    { name: 'Horiatiki', blurb: 'Tomato, cucumber, olives and a slab of feta, no lettuce involved.', richness: 2, heat: 0, size: 2, price: 1, familiarity: 5, format: 'salad', mainIngredient: 'tomato', texture: 'fresh', searchName: 'Greek village salad' },
    { name: 'Pork Souvlaki', blurb: 'Grilled pork skewers tucked into warm pita with tzatziki.', richness: 3, heat: 0, size: 3, price: 1, familiarity: 4, format: 'grill', mainIngredient: 'pork', texture: 'tender' },
    { name: 'Moussaka', blurb: 'Baked layers of eggplant, spiced meat and thick creamy topping.', richness: 5, heat: 0, size: 5, price: 2, familiarity: 3, format: 'plate', mainIngredient: 'eggplant', texture: 'creamy' },
  ]),
  ...group('Ethiopian', 'africa', [
    { name: 'Misir Wot', blurb: 'Red lentils stewed with berbere spice, scooped up with spongy injera.', richness: 2, heat: 3, size: 4, price: 1, familiarity: 1, format: 'stew', mainIngredient: 'lentils', texture: 'tender' },
    { name: 'Doro Wat', blurb: 'A deep, spicy chicken stew with a whole boiled egg.', richness: 4, heat: 3, size: 5, price: 2, familiarity: 2, format: 'stew', mainIngredient: 'chicken', texture: 'tender' },
    { name: 'Ethiopian Veggie Combo', blurb: 'A shared platter of lentils, greens and vegetables on injera.', richness: 2, heat: 1, size: 4, price: 2, familiarity: 1, format: 'plate', mainIngredient: 'lentils', texture: 'tender', searchName: 'Ethiopian vegetarian combination' },
  ]),
  ...group('Moroccan', 'africa', [
    { name: 'Harira', blurb: 'A tomato, lentil and chickpea soup with warm spice.', richness: 2, heat: 1, size: 3, price: 1, familiarity: 1, format: 'soup', mainIngredient: 'lentils', texture: 'brothy' },
    { name: 'Chicken Tagine', blurb: 'Chicken stewed slowly with preserved lemon and olives.', richness: 3, heat: 1, size: 4, price: 2, familiarity: 3, format: 'stew', mainIngredient: 'chicken', texture: 'tender', searchName: 'Moroccan chicken tagine' },
    { name: 'Lamb Couscous', blurb: 'Fluffy steamed couscous under tender lamb and vegetables.', richness: 3, heat: 0, size: 5, price: 3, familiarity: 3, format: 'plate', mainIngredient: 'lamb', texture: 'tender', searchName: 'Moroccan lamb couscous' },
  ]),
  ...group('West African', 'africa', [
    { name: 'Jollof Rice', blurb: 'Rice cooked in a smoky, peppery tomato sauce.', richness: 3, heat: 2, size: 4, price: 1, familiarity: 2, format: 'bowl', mainIngredient: 'rice', texture: 'tender' },
    { name: 'Suya', blurb: 'Thin beef skewers rubbed in a spicy peanut mix and grilled.', richness: 3, heat: 3, size: 2, price: 1, familiarity: 1, format: 'grill', mainIngredient: 'beef', texture: 'chewy' },
    { name: 'Groundnut Stew', blurb: 'A rich, savory peanut stew with chicken or vegetables, served with rice.', richness: 4, heat: 2, size: 5, price: 1, familiarity: 1, format: 'stew', mainIngredient: 'peanuts', texture: 'creamy', searchName: 'West African peanut stew' },
  ]),
  ...group('Peruvian', 'latin-america', [
    { name: 'Ceviche', blurb: 'Raw fish cured in lime with chili, onion and sweet potato.', richness: 1, heat: 2, size: 2, price: 2, familiarity: 3, format: 'plate', mainIngredient: 'raw fish', texture: 'fresh', searchName: 'Peruvian ceviche' },
    { name: 'Lomo Saltado', blurb: 'Beef stir-fried with onions and tomatoes, served with fries and rice.', richness: 4, heat: 1, size: 5, price: 2, familiarity: 2, format: 'plate', mainIngredient: 'beef', texture: 'tender' },
    { name: 'Aji de Gallina', blurb: 'Shredded chicken in a creamy, gently hot yellow pepper sauce.', richness: 4, heat: 2, size: 4, price: 2, familiarity: 1, format: 'stew', mainIngredient: 'chicken', texture: 'creamy' },
  ]),
  ...group('Mexican', 'latin-america', [
    { name: 'Tacos al Pastor', blurb: 'Pork marinated in chilies and shaved onto tortillas with pineapple.', richness: 3, heat: 2, size: 3, price: 1, familiarity: 4, format: 'handheld', mainIngredient: 'pork', texture: 'tender' },
    { name: 'Pozole Rojo', blurb: 'A brick-red pork and hominy soup with crunchy garnishes.', richness: 3, heat: 2, size: 5, price: 2, familiarity: 2, format: 'soup', mainIngredient: 'hominy', texture: 'brothy' },
    { name: 'Esquites', blurb: 'Warm corn in a cup with lime, chili, cheese and a little mayo.', richness: 3, heat: 1, size: 1, price: 1, familiarity: 3, format: 'bowl', mainIngredient: 'corn', texture: 'creamy' },
    { name: 'Chiles en Nogada', blurb: 'Stuffed poblano peppers under a creamy walnut sauce.', richness: 4, heat: 1, size: 4, price: 3, familiarity: 1, format: 'plate', mainIngredient: 'poblano pepper', texture: 'creamy' },
  ]),
  ...group('Brazilian', 'latin-america', [
    { name: 'Pao de Queijo', blurb: 'Small, chewy cheese breads made with tapioca flour.', richness: 3, heat: 0, size: 1, price: 1, familiarity: 2, format: 'bread', mainIngredient: 'cheese', texture: 'chewy', searchName: 'Brazilian cheese bread' },
    { name: 'Moqueca', blurb: 'Fish stewed gently in coconut milk, tomato and peppers.', richness: 3, heat: 1, size: 4, price: 3, familiarity: 1, format: 'stew', mainIngredient: 'white fish', texture: 'tender', searchName: 'Brazilian moqueca' },
    { name: 'Feijoada', blurb: 'A long-simmered black bean and pork stew, served with rice and greens.', richness: 5, heat: 0, size: 5, price: 2, familiarity: 2, format: 'stew', mainIngredient: 'black beans', texture: 'tender', searchName: 'Brazilian feijoada' },
  ]),
  ...group('Jamaican', 'caribbean', [
    { name: 'Jamaican Beef Patty', blurb: 'Flaky golden pastry filled with spiced ground beef.', richness: 4, heat: 2, size: 2, price: 1, familiarity: 3, format: 'handheld', mainIngredient: 'beef', texture: 'crunchy' },
    { name: 'Jerk Chicken', blurb: 'Chicken marinated in allspice and Scotch bonnet, then charred.', richness: 3, heat: 4, size: 4, price: 2, familiarity: 4, format: 'grill', mainIngredient: 'chicken', texture: 'tender' },
    { name: 'Rice and Peas with Oxtail', blurb: 'Fall-apart braised oxtail with coconut rice and kidney beans.', richness: 5, heat: 1, size: 5, price: 3, familiarity: 2, format: 'plate', mainIngredient: 'oxtail', texture: 'tender', searchName: 'Jamaican oxtail' },
  ]),
];
