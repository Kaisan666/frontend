// app/data/products.ts
import { Beer, Food, Product } from '@/types/product';

export const beers: Beer[] = [
  {
    id: 1,
    category: 'beer',
    name: 'Chimay Blue',
    style: 'Belgian Strong Ale',
    country: 'Бельгия',
    abv: 9,
    ibu: 35,
    volume: 0.33,
    price: 650,
    image: '/images/beers/chimay-blue.jpg',
    description: 'Классический бельгийский трапист с нотами сухофруктов и карамели',
  },
  {
    id: 2,
    category: 'beer',
    name: 'Sierra Nevada Torpedo',
    style: 'IPA',
    country: 'США',
    abv: 7.2,
    ibu: 65,
    volume: 0.33,
    price: 480,
    image: '/images/beers/sierra-nevada.jpg',
    description: 'Американский IPA с ярким цитрусовым и хвойным ароматом',
  },
  {
    id: 3,
    category: 'beer',
    name: 'Paulaner Weissbier',
    style: 'Wheat',
    country: 'Германия',
    abv: 5.5,
    ibu: 14,
    volume: 0.5,
    price: 420,
    image: '/images/beers/paulaner.jpg',
    description: 'Мягкое баварское пшеничное пиво с нотами банана и гвоздики',
  },
  {
    id: 4,
    category: 'beer',
    name: 'Guinness Draught',
    style: 'Stout',
    country: 'Ирландия',
    abv: 4.2,
    ibu: 45,
    volume: 0.44,
    price: 390,
    image: '/images/beers/guinness.jpg',
    description: 'Легендарный ирландский стаут с кремовой пеной и вкусом кофе',
  },
  {
    id: 5,
    category: 'beer',
    name: 'Duvel',
    style: 'Belgian Strong Ale',
    country: 'Бельгия',
    abv: 8.5,
    ibu: 32,
    volume: 0.33,
    price: 580,
    image: '/images/beers/duvel.jpg',
    description: 'Золотистый бельгийский эль с фруктовым ароматом и сухим финишем',
  },
  {
    id: 6,
    category: 'beer',
    name: 'BrewDog Punk IPA',
    style: 'IPA',
    country: 'Шотландия',
    abv: 5.6,
    ibu: 35,
    volume: 0.33,
    price: 450,
    image: '/images/beers/brewdog-punk.jpg',
    description: 'Культовый шотландский IPA с тропическими нотами манго и личи',
  },
  {
    id: 7,
    category: 'beer',
    name: 'Hoegaarden Original',
    style: 'Wheat',
    country: 'Бельгия',
    abv: 4.9,
    ibu: 11,
    volume: 0.5,
    price: 370,
    image: '/images/beers/hoegaarden.jpg',
    description: 'Бельгийское белое пиво с кориандром и апельсиновой цедрой',
  },
  {
    id: 8,
    category: 'beer',
    name: 'Weihenstephaner Hefe',
    style: 'Wheat',
    country: 'Германия',
    abv: 5.4,
    ibu: 14,
    volume: 0.5,
    price: 440,
    image: '/images/beers/weihenstephaner.jpg',
    description: 'Старейшая пивоварня мира — классическое баварское хефевайцен',
  },
  {
    id: 9,
    category: 'beer',
    name: 'Left Hand Milk Stout',
    style: 'Stout',
    country: 'США',
    abv: 6,
    ibu: 25,
    volume: 0.33,
    price: 520,
    image: '/images/beers/left-hand.jpg',
    description: 'Молочный стаут с нежной сладостью, шоколадом и кремовой текстурой',
  },
  {
    id: 10,
    category: 'beer',
    name: 'Erdinger Dunkel',
    style: 'Dunkel',
    country: 'Германия',
    abv: 5.3,
    ibu: 17,
    volume: 0.5,
    price: 410,
    image: '/images/beers/erdinger-dunkel.jpg',
    description: 'Тёмное баварское пшеничное пиво с нотами хлеба и карамели',
  },
  {
    id: 11,
    category: 'beer',
    name: 'Orval Trappist',
    style: 'Belgian Pale Ale',
    country: 'Бельгия',
    abv: 6.2,
    ibu: 38,
    volume: 0.33,
    price: 690,
    image: '/images/beers/orval.jpg',
    description: 'Уникальный трапистский эль с сухим хмелеванием и дикими дрожжами',
  },
  {
    id: 12,
    category: 'beer',
    name: 'Anchor Steam Beer',
    style: 'Lager',
    country: 'США',
    abv: 4.9,
    ibu: 33,
    volume: 0.33,
    price: 460,
    image: '/images/beers/anchor-steam.jpg',
    description: 'Легендарный калифорнийский лагер с карамельным солодом и землистым хмелем',
  },
  {
    id: 13,
    category: 'beer',
    name: 'Schneider Aventinus',
    style: 'Weizenbock',
    country: 'Германия',
    abv: 8.2,
    ibu: 16,
    volume: 0.5,
    price: 530,
    image: '/images/beers/aventinus.jpg',
    description: 'Мощный пшеничный бок с нотами слив, шоколада и пряностей',
  },
  {
    id: 14,
    category: 'beer',
    name: 'Rochefort 10',
    style: 'Belgian Strong Ale',
    country: 'Бельгия',
    abv: 11.3,
    ibu: 27,
    volume: 0.33,
    price: 750,
    image: '/images/beers/rochefort-10.jpg',
    description: 'Один из лучших трапистских элей мира — тёмный, богатый, с изюмом и специями',
  },
  {
    id: 15,
    category: 'beer',
    name: 'Stone IPA',
    style: 'IPA',
    country: 'США',
    abv: 6.9,
    ibu: 77,
    volume: 0.33,
    price: 490,
    image: '/images/beers/stone-ipa.jpg',
    description: 'Агрессивный американский IPA с горьким хмелевым характером и цитрусом',
  },
];

export const foods: Food[] = [
  { id: 16, category: 'food', name: 'Сырная тарелка', weight: 250, price: 490, image: '/images/food/cheese.jpg', description: 'Ассорти из 5 сортов сыра с мёдом и орехами' },
  { id: 17, category: 'food', name: 'Мясная нарезка', weight: 300, price: 590, image: '/images/food/meat.jpg', description: 'Колбасы, ветчина и копчёности собственного приготовления' },
  { id: 18, category: 'food', name: 'Картофель фри', weight: 200, price: 220, image: '/images/food/fries.jpg', description: 'Хрустящий картофель с соусом на выбор' },
  { id: 19, category: 'food', name: 'Крылья BBQ', weight: 400, price: 450, image: '/images/food/wings.jpg', description: 'Куриные крылья в соусе барбекю с овощами' },
  { id: 20, category: 'food', name: 'Брускетта', weight: 180, price: 290, image: '/images/food/bruschetta.jpg', description: 'Хрустящий хлеб с томатами, базиликом и оливковым маслом' },
];

export const fetchProducts = (filters?: {
  category?: 'beer' | 'food';
  style?: string;
  country?: string;
  volume?: number;
  abvMax?: number;
  priceMax?: number;
}): Product[] => {
  // Выбираем нужный массив по категории
  let result: Product[] = filters?.category === 'food' ? foods : beers;

  if (filters?.style) {
    result = result.filter(p => p.category === 'beer' && p.style === filters.style);
  }

  if (filters?.country) {
    result = result.filter(p => p.category === 'beer' && p.country === filters.country);
  }

  if (filters?.volume !== undefined) {
    result = result.filter(p => p.category === 'beer' && p.volume === filters.volume);
  }

  if (filters?.abvMax !== undefined) {
    result = result.filter(p => p.category === 'beer' && p.abv <= filters.abvMax!);
  }

  if (filters?.priceMax !== undefined) {
    result = result.filter(p => p.price <= filters.priceMax!);
  }

  return result;
};
