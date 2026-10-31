# Data review

All 81 dishes in `src/data/dishes.ts` were written from general knowledge, with no sources checked. Richness, heat, size, price and familiarity are judgment calls. These are the ones most worth checking.

## Dietary tags: please check these first

The `contains` tags decide what people with allergies and diets get shown, so they matter more than anything else here. They're from general knowledge, describe a typical restaurant version and lean cautious. They aren't a guarantee, which is why the app tells people to ask the restaurant.

**Hidden ingredients I assumed:**

- Thai, Vietnamese, Indonesian and Filipino dishes: fish sauce or shrimp paste, even in vegetable-looking dishes.
- Soy sauce counts as gluten.
- Indian and Nepali dishes: ghee counts as dairy, so Chana Masala and Dal Bhat aren't vegan here, although many are.
- Mirin and Shaoxing wine count as alcohol. Other marinades and sauces may also use alcohol that I haven't tagged.
- Injera counts as gluten, although pure teff versions exist.
- Jollof Rice is tagged poultry for chicken stock, and Thukpa, Momo and Groundnut Stew are tagged for their usual chicken. All have vegetable versions, so vegetarians won't see them.

**Worth a second look:**

- **Tree nuts:** Butter Chicken and Aji de Gallina are tagged for cashews or walnuts or pecans that not every kitchen uses. Dishes fried in peanut oil or garnished with nuts aren't tagged.
- **Peanuts:** only dishes where peanuts are expected are tagged. Cross-contact is common in Thai, Vietnamese, Indonesian and West African kitchens, and the data can't capture it.
- **Sesame, soy and mustard** aren't tracked at all, although sesame and soy are major allergens. Falafel Wrap's tahini is one example.
- **Halal-friendly:** covers pork and alcohol only, and says nothing about how meat was slaughtered.
- **New dishes** (Aloo Gobi, Rajma Chawal, Pho Chay, Mujaddara, Imam Bayildi, Gigantes Plaki, Tacos de Papa, Guacamole with Totopos, Lobio, Vegetable Tagine, Acai Bowl, Ital Stew, Red Red, Solterito, Scallion Pancakes, Inari Sushi, Shiro): some kitchens use meat stock, dairy or fish-based dashi in these.

## Prices vary a lot by city

- **Galbi ($$$), Chirashi ($$$), Cantonese Roast Duck ($$$), Moqueca ($$$), Lamb Couscous ($$$), Chiles en Nogada ($$$), Rice and Peas with Oxtail ($$$):** the $$$ tier may be high at casual places.
- **Banh Mi, Tacos al Pastor, Lahmacun ($):** assumes casual counter-service places.

## Familiarity is a guess at US diners

- **Suya, Thukpa, Dal Bhat, Gado-Gado, Sinigang, Khinkali, Khachapuri:** rated 1. Khachapuri may now be better known than that.
- **Momo, Ceviche, Bibimbap:** familiarity depends heavily on where someone lives.

## Availability

These may be hard to find at restaurants outside large cities, which matters most for "Find it nearby":

- Georgian dishes, especially Badrijani Nigvzit
- Thukpa, Dal Bhat, Chiles en Nogada (seasonal at many places), Sinigang, Aji de Gallina

## Dishes that vary a lot

- **Momo:** listed as chicken, but often beef, pork, buffalo or vegetable.
- **Groundnut Stew:** listed with peanuts as the main ingredient. Recipes vary across West Africa.
- **Khachapuri:** the boat shape and egg describe the Adjaruli style only.
- **Chicken Adobo:** recipes vary by region and household, and some use coconut milk.
- **Jollof Rice:** heat varies by country and cook.
- **Pad Kra Pao:** listed as pork, but chicken is just as common.

## Categories I chose

- **Nepali/Tibetan** sits in `south-asia`. Tibetan food could reasonably be placed in East Asia.
- **Georgian** sits in `caucasus-eastern-europe` and displays as "the Caucasus".
- **Turkish** sits in `middle-east`. Mediterranean is also reasonable.
- **`north-america`** has no dishes, because the target cuisine list has none. It's in the data type only.

## Display names

Plain-ASCII spellings are used, so diacritics are missing: Pao de Queijo (Pão de Queijo), Banh Mi (Bánh Mì), Goi Cuon (Gỏi Cuốn), Bun Bo Hue (Bún Bò Huế). The brief asked for common English spellings.
