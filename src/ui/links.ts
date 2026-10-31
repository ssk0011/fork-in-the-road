export function mapsUrl(searchName: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchName)}%20restaurant`;
}

export function recipeUrl(searchName: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(searchName)}%20recipe`;
}
