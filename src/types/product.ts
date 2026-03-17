// types/beer.ts — переименуй в types/product.ts
export type Category = 'beer' | 'food';

export interface Product {
  id: string;
  category: 'beer' | 'food' | 'other';
  name: string;
  price: number;
  image: string;
  description?: string;

  // только для пива
  style?: string;
  country?: string;
  abv?: number;
  ibu?: number;

  // для пива и еды
  quantity?: number;           // 500, 330, 250
  unit?: 'ml' | 'g' | 'pcs';  // мл, граммы, штуки
}

