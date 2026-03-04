import React from 'react'
import styles from "./BeersMenu.module.scss"
import { ProductCard } from '@/components/ProductCard';
import Link from 'next/link';

export const BeersMenu = () => {
   const beers = [
  {
    id: 1,
    name: "Heineken",
    price: 150,
    imgUrl: "https://cdn.lentochka.lenta.com/resample/webp/900x900/photo/4148/414868H.png",
    description: "Классическое европейское лагерное пиво с мягким вкусом и легкой горечью.",
    country: "Нидерланды",
    volume: 500,
    measurementUnit: "мл"
  },
  {
    id: 2,
    name: "Guinness Draught",
    price: 220,
    imgUrl: "https://img.vkusvill.ru/pim/images/site/site_LargeWebP/01a4c62f-6879-4aab-bcca-d2c8bfe1754d.webp",
    description: "Ирландский стаут с густой пеной и насыщенным вкусом кофе с шоколадом.",
    country: "Ирландия",
    volume: 440,
    measurementUnit: "мл"
  },
  {
    id: 3,
    name: "Hoegaarden",
    price: 180,
    imgUrl: "https://tsx.x5static.net/i/800x800-fit/xdelivery/files/85/0f/3c1e1a16ae0b56154ce0cbb0ab0c.jpg",
    description: "Белое бельгийское пиво с цитрусовыми нотами и специями кориандра.",
    country: "Бельгия",
    volume: 330,
    measurementUnit: "мл"
  },
  {
    id: 4,
    name: "Stella Artois",
    price: 160,
    description: "Премиальное бельгийское пиво с золотистым цветом и сбалансированным вкусом.",
    country: "Бельгия",
    volume: 500,
    measurementUnit: "мл"
  },
  {
    id: 5,
    name: "Corona Extra",
    price: 140,
    imgUrl: "https://web.alkoteka.com/storage/product/6d/ee/70835_image.png",
    description: "Мексиканское светлое пиво с легким вкусом цитруса — идеально с лаймом.",
    country: "Мексика",
    volume: 355,
    measurementUnit: "мл"
  },
  {
    id: 6,
    name: "Budweiser",
    price: 130,
    imgUrl: "https://tsx.x5static.net/i/800x800-fit/xdelivery/files/55/84/e1fe62e551ccb1db0eab75485a43.jpg",
    description: "Американский лагер с рисом — легкое и освежающее пиво для любой компании.",
    country: "США",
    volume: 473,
    measurementUnit: "мл"
  },
  {
    id: 7,
    name: "Paulaner Weissbier",
    price: 200,
    imgUrl: "https://web.alkoteka.com/storage/product/83/ae/81302_image.png",
    description: "Немецкое пшеничное пиво с фруктовыми нотами банана и гвоздики.",
    country: "Германия",
    volume: 500,
    measurementUnit: "мл"
  },
  {
    id: 8,
    name: "Baltika 7",
    price: 110,
    imgUrl: "https://baltika4you.ru/images/detailed/9/0.9.png",
    description: "Классическое российское светлое пиво с золотистым цветом и хмелевой горечью.",
    country: "Россия",
    volume: 450,
    measurementUnit: "мл"
  },
  {
    id: 9,
    name: "Leffe Blonde",
    price: 210,
    imgUrl: "https://web.alkoteka.com/storage/product/b8/50/86213_image.png",
    description: "Бельгийский аббатский эль с фруктовыми и пряными оттенками.",
    country: "Бельгия",
    volume: 330,
    measurementUnit: "мл"
  },
  {
    id: 10,
    name: "Peroni Nastro Azzurro",
    price: 170,
    imgUrl: "https://cdn.metro-cc.ru/ru/ru_pim_159066001001_01.png",
    description: "Итальянское премиальное пиво с нежным вкусом и тонкой горечью.",
    country: "Италия",
    volume: 330,
    measurementUnit: "мл"
  },
  {
    id: 11,
    name: "Duvel",
    price: 240,
    imgUrl: "https://tsx.x5static.net/i/800x800-fit/xdelivery/files/bf/e5/3a10b44860bf6d2d9f4e46692a1b.jpg",
    description: "Бельгийский золотой эль с высокой крепостью и сложным вкусом.",
    country: "Бельгия",
    volume: 330,
    measurementUnit: "мл"
  },
  {
    id: 12,
    name: "Żywiec",
    price: 145,
    imgUrl: "https://www.distribev.pl/wp-content/uploads/2020/01/zywiec_jasne_pelne_butelka_500ml-600x551.png",
    description: "Польское светлое пиво с чистым вкусом и хорошей пеной.",
    country: "Польша",
    volume: 500,
    measurementUnit: "мл"
  }
];


  return (
    <section className={`${styles['beer-menu']} container`}>
        <div className={"section-header"}>
            <h2 className={"section-header__title"}>
                Популярное
            </h2>
            <Link className='accent-button' href={"/catalog?category=beer"}>В каталог</Link>
        </div>
        <div className='catalog-layout'>
        {beers.map(beer => (
            <ProductCard type='beer' key={beer.id} name={beer.name} price={beer.price} country={beer.country} description={beer.description} imgUrl={beer.imgUrl} id={beer.id} measurementUnit={beer.measurementUnit} volume={beer.volume}></ProductCard>
        ))}
        </div>
    </section>
  )
}