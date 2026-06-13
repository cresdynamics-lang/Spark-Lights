export interface StoreProduct {
  id: number | string;
  slug: string;
  name: string;
  price: string;
  img: string;
  imageFile?: string;
  tag?: string;
  categories?: string[];
  shortDesc?: string;
  longDesc?: string;
  careInstructions?: string;
  sizes: { label: string; price: string }[];
  badge?: string;
  oldPrice?: string;
}
