export type Product = {
  id: string;
  style?: string;
  country?: string;
  abv?: number;
  ibu?: number;
  pl?: number;
  name: string;
  category: "beer" | "food" | "other";
  price: number;
  description?: string;
  ingredients?: string;
  calories?: number;
  protein?: number;
  fat?: number;
  carbs?: number;
  quantity?: number;
  unit?: "мл" | "гр" | "шт";
  slug: string;
  imageUrl?: string
}