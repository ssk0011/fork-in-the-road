import { describe, expect, it } from 'vitest';
import { mapsUrl, recipeUrl } from './links';

describe('links', () => {
  it('builds the Maps search URL', () => {
    expect(mapsUrl('Banh Mi')).toBe(
      'https://www.google.com/maps/search/?api=1&query=Banh%20Mi%20restaurant',
    );
  });

  it('builds the recipe search URL', () => {
    expect(recipeUrl('Banh Mi')).toBe('https://www.google.com/search?q=Banh%20Mi%20recipe');
  });

  it('encodes characters that would break out of the query', () => {
    expect(recipeUrl('a&b=c#d')).toBe('https://www.google.com/search?q=a%26b%3Dc%23d%20recipe');
  });
});
