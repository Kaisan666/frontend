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
  quantity: number;
  unit: "ml" | "g" | "pcs";
  slug: string;
  imageUrl?: string
}