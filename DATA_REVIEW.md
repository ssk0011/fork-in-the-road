# Data review

All 136 dishes in `src/data/dishes.ts` were written from general knowledge, with no sources checked. Richness, heat, size, price and familiarity are judgment calls. These are the ones most worth checking.

## Dietary tags: please check these first

The `contains` tags decide what people with allergies and diets get shown, so they matter more than anything else here. They're from general knowledge, describe a typical restaurant version and lean cautious. They aren't a guarantee, which is why the app tells people to ask the restaurant.

**Hidden ingredients I assumed:**

- Thai, Vietnamese, Indonesian and Filipino dishes: fish sauce or shrimp paste, even in vegetable-looking dishes.
- Soy sauce counts as gluten.
- Indian and Nepali dishes: ghee counts as dairy, so Chana Masala, Aloo Gobi, Rajma Chawal and Dal Bhat aren't vegan here, although many are.
- Mirin and Shaoxing wine count as alcohol. Other marinades and sauces may also use alcohol that I haven't tagged.
- Injera counts as gluten, although pure teff versions exist.
- Jollof Rice is tagged poultry for chicken stock, and Thukpa, Momo and Groundnut Stew are tagged for their usual chicken. All have vegetable versions, so vegetarians won't see them.

**What the tags can't capture:**

- Cross-contact from shared fryers, woks, bakeries and tahini equipment. Middle Eastern, Turkish, Korean and Japanese kitchens carry the most sesame risk.
- Peanut oil, which isn't tagged.
- Bread sides such as naan and bhatura, which can add gluten, egg or sesame.
- Asafoetida, which often contains wheat, and candlenut in Southeast Asian pastes.
- Honey and gelatin, for vegans.

**Worth a second look:**

- **Tree nuts:** Butter Chicken and Aji de Gallina are tagged for cashews or walnuts or pecans that not every kitchen uses. Dishes fried in peanut oil or garnished with nuts aren't tagged.
- **Peanuts:** only dishes where peanuts are expected are tagged. Cross-contact is common in Thai, Vietnamese, Indonesian and West African kitchens, and the data can't capture it.
- **Sesame:** tagged wherever it's commonly used, including sesame oil, seeds, tahini, hummus sides, za'atar and furikake. It's often hidden, so some are cautious guesses (Masala Dosa, Dal Bhat, Shish Tawook). Breads with seeds aren't always captured. Ethiopian spice blends aren't tagged.
- **Soy:** tagged for tofu, soy sauce, oyster and hoisin sauces, and stock cubes such as Maggi in West African cooking. Soybean cooking oil isn't tagged, so people with severe soy allergies can't rely on this.
- **Fish:** includes fish sauce and dashi. Inari Sushi, Bibimbap (kimchi) and Red Red (often cooked with smoked fish) are cautious tags, so vegans won't see them.
- **Mustard** isn't tracked. It isn't a major US allergen, but it is elsewhere.
- **Halal-friendly:** covers pork and alcohol only, and says nothing about how meat was slaughtered.
- **Dishes added in the third round:** 41 more, including all Italian and American dishes. Their tags had a separate independent audit, noted in REVIEW_NOTES.md.
- **Dishes added in the second round** (Aloo Gobi, Rajma Chawal, Pho Chay, Mujaddara, Imam Bayildi, Gigantes Plaki, Tacos de Papa, Guacamole with Totopos, Lobio, Vegetable Tagine, Acai Bowl, Ital Stew, Red Red, Solterito, Scallion Pancakes, Inari Sushi, Shiro): some kitchens use meat stock, dairy or fish-based dashi in these.

## Kerala dishes

These 14 dishes were added as a regional test, and their tags had their own independent audit.

- **Coconut:** used in almost all of them, but not tagged. Coconut isn't a peanut, and the US FDA no longer counts it as a tree nut. Some people with tree-nut allergies still avoid it, so it may be worth a tag of its own.
- **Mustard seeds and curry leaves:** used throughout, and neither is tracked.
- **Cooking oil:** Kerala food is cooked in coconut oil. Sesame (gingelly) oil appears in some dishes and isn't tagged.
- **Kerala Sadya and Thalassery Biryani:** usually come with payasam or a fried-onion garnish, so they're tagged for cashews and ghee.
- **Karimeen Pollichathu:** pearl spot is rare outside Kerala, so its search uses "fish pollichathu", as US menus do. Thalassery Biryani is often listed as "Malabar biryani" in the US.
- **Availability outside India:** dishes like Karimeen Pollichathu and Kerala Sadya may only be easy to find in cities with Malayali communities.

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
