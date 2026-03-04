import React from "react";
import styles from "./FoodMenu.module.scss";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
export const FoodMenu = () => {
  const foods = [
    {
      id: 1,
      name: "Мидии в сливочном соусе",
      price: 490,
      imgUrl: "https://s0.rbk.ru/v6_top_pics/media/img/2/43/347398153538432.webp",
      description: "Свежие мидии в нежном сливочно-чесночном соусе с зеленью",
      volume: 300,
      measurementUnit: "г",
      type: "food",
    },
    {
      id: 2,
      name: "Пицца Маргарита",
      price: 520,
      imgUrl: "https://km-doma.ru/assets/thumbnails/803x600/a60b9d6bb60eea148d4167b2e78104f7.jpg",
      description: "Классическая пицца с томатным соусом и моцареллой",
      volume: 400,
      measurementUnit: "г",
      type: "food",
    },
    {
      id: 3,
      name: "Картофель фри",
      price: 220,
      imgUrl: "https://kraftandpaper.ru/wp-content/uploads/2020/upakovka-dlya-kartofelya-fri/upakovka-dlya-kartofelya-fri-main.jpg",
      description: "Хрустящий картофель фри с соусом на выбор",
      volume: 200,
      measurementUnit: "г",
      type: "food",
    },
    {
      id: 4,
      name: "Луковые кольца",
      price: 250,
      imgUrl: "https://images.gastronom.ru/_2HlOCkKmzaAgtQ7gdLEK26H4R4KqFkQNtJRCTji34c/pr:recipe-cover-image/g:ce/rs:auto:0:0:0/L2Ntcy9hbGwtaW1hZ2VzLzEzZjllMGZlLThjZWItNDFjYi1iMjQ2LWYxYmM2ODZjZGNmOC5qcGc.webp",
      description: "Хрустящие луковые кольца в пивном кляре",
      volume: 180,
      measurementUnit: "г",
      type: "food",
    },
    {
      id: 5,
      name: "Сырный суп",
      price: 320,
      imgUrl: "https://www.ermolino-produkty.ru/recipes/picts/recipes/tnw1000-sirniy_sup_kuritsey-670%D1%85430.jpg",
      description: "Густой сырный суп с гренками и беконом",
      volume: 350,
      measurementUnit: "мл",
      type: "food",
    },
    {
      id: 6,
      name: "Куриные крылья BBQ",
      price: 450,
      imgUrl: "https://e2.edimdoma.ru/data/recipes/0012/7620/127620-ed4_wide.jpg?1759209436",
      description:
        "Сочные куриные крылья в соусе барбекю, запечённые в духовке",
      volume: 350,
      measurementUnit: "г",
      type: "food",
    },
  ];

  return (
    <section className={`${styles["food-menu"]} container`}>
      <div className="section-header">
        <h2 className={"section-header__title"}>Популярное</h2>
        <Link className="accent-button" href={"/catalog?category=food"}>
          В каталог
        </Link>
      </div>
      <div className="catalog-layout">
        {foods.map( food => (
             <ProductCard
          id={food.id}
          name={food.name}
          price={food.price}
          type="food"
          country=""
          description=""
          imgUrl={food.imgUrl}
          key={food.id}
          measurementUnit={food.measurementUnit}
          volume={food.volume}
        ></ProductCard>
        ))}
      </div>
    </section>
  );
};

