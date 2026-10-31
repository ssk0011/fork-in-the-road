# Data review

All 64 dishes in `src/data/dishes.ts` were written from general knowledge, with no sources checked. Richness, heat, size, price and familiarity are judgment calls. These are the ones most worth checking.

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
