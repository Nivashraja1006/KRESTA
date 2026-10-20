import type { SyntheticEvent } from 'react';
import type { MenuItem } from '../../types';

const CATEGORY_IMAGE_FILES = {
  beverages: 'beverages.svg',
  desserts: 'desserts.svg',
  breads: 'breads.svg',
  starters: 'starters.svg',
  mains: 'mains.svg',
} as const;

type MenuImageItem = Pick<MenuItem, 'name' | 'image_url' | 'category'>;

const getImageCategory = (item: MenuImageItem): keyof typeof CATEGORY_IMAGE_FILES => {
  const name = item.name.toLowerCase();
  const category = item.category?.name.toLowerCase() ?? '';

  if (/\b(chai|tea|coffee|latte|lassi|beverage|drink|juice|mojito)\b/.test(name)) {
    return 'beverages';
  }
  if (/\b(dessert|sweet|gulab|jamun|ice cream|cake|pastry)\b/.test(name)) {
    return 'desserts';
  }
  if (/\b(naan|roti|bread|breads)\b/.test(name)) {
    return 'breads';
  }
  if (/\b(biryani|curry|rogan josh|main course|mains)\b/.test(name)) {
    return 'mains';
  }
  if (/\b(starter|appetizer|bite|skewer|samosa|pakora|fries)\b/.test(name)) {
    return 'starters';
  }

  if (/\b(beverage|drink)\b/.test(category)) {
    return 'beverages';
  }
  if (/\b(dessert|sweet)\b/.test(category)) {
    return 'desserts';
  }
  if (/\b(bread)\b/.test(category)) {
    return 'breads';
  }
  if (/\b(starter|appetizer)\b/.test(category)) {
    return 'starters';
  }

  return 'mains';
};

export const getCategoryFallbackImage = (item: MenuImageItem): string => {
  const backendOrigin = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, '');
  const imagePath = `/static/menu-fallbacks/${CATEGORY_IMAGE_FILES[getImageCategory(item)]}`;
  return backendOrigin ? `${backendOrigin}${imagePath}` : imagePath;
};

export const getMenuImageUrl = (item: MenuImageItem): string => {
  const imageUrl = item.image_url?.trim();
  const isLegacySharedBiryaniImage = imageUrl?.includes('photo-1589302168068-964664d93dc0');

  if (!imageUrl || isLegacySharedBiryaniImage) {
    return getCategoryFallbackImage(item);
  }
  if (/^(https?:|data:|blob:)/i.test(imageUrl)) {
    return imageUrl;
  }

  const backendOrigin = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, '');
  const relativePath = imageUrl.replace(/^\/+/, '');
  return backendOrigin ? `${backendOrigin}/${relativePath}` : `/${relativePath}`;
};

export const handleMenuImageError = (
  event: SyntheticEvent<HTMLImageElement>,
  item: MenuImageItem
): void => {
  const fallbackUrl = getCategoryFallbackImage(item);
  const absoluteFallbackUrl = new URL(fallbackUrl, event.currentTarget.ownerDocument.baseURI).href;
  if (event.currentTarget.src !== absoluteFallbackUrl) {
    event.currentTarget.src = fallbackUrl;
  } else {
    event.currentTarget.style.visibility = 'hidden';
  }
};
