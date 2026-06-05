export type Product = {
  id: string;
  // style — массив названий стилей пива; в Sanity это reference[] на beerStyle,
  // GROQ-запросы дереференсят в массив строк через `style[]->title`.
  style?: string[];
  country?: string;
  abv?: number;
  ibu?: number;
  pl?: number;
  name: string;
  category: "beer" | "food" | "other";
  price: number;
  // Вариации: товары одной линейки (марки) с разными вкусами/типами.
  // variantLabel — подпись вкуса; lineId — id линейки (алиас line->_id в GROQ).
  variantLabel?: string;
  lineId?: string;
  description?: string;
  // foodType — тип/категория еды (дереференс foodCategory->title в GROQ).
  foodType?: string;
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